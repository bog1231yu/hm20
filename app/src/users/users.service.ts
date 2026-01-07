import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from './schemas/user.schema';
import { S3Service } from '../aws/s3.service';

import type { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);

    const created = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
      subscriptionStartDate: now,
      subscriptionEndDate: end,
    });
    const user = created.toObject();
    delete (user as any).password;
    return user;
  }

  async findAll(query: QueryUsersDto) {
    const filter: any = {};
    if (query.gender) filter.gender = query.gender;
    if (query.email) filter.email = { $regex: `^${query.email}`, $options: 'i' };

    const page = query.page || 1;
    const take = query.take || 30;

    const total = await this.userModel.countDocuments(filter);
    const data = await this.userModel.find(filter).skip((page - 1) * take).limit(take).lean();

    return { data, total, page, take };
  }

  async findOne(id: string) {
    return this.userModel.findById(id).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).lean();
  }

  async delete(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    return !!res;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: { $regex: `^${email}$`, $options: 'i' } }).lean();
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: { $regex: `^${loginDto.email}$`, $options: 'i' } });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) return null;
    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj;
  }

  async upgradeSubscription(email: string) {
    const user = await this.userModel.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (!user) return null;
    const currentEnd = user.subscriptionEndDate ?? new Date();
    const newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + 1);
    user.subscriptionEndDate = newEnd;
    await user.save();
    return user.toObject();
  }

  async getGenderStatistics() {
    const statistics = await this.userModel.aggregate([
      {
        $match: { age: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$gender',
          userCount: { $sum: 1 },
          totalAge: { $sum: '$age' },
          averageAge: { $avg: '$age' },
          users: { $push: { firstName: '$firstName', lastName: '$lastName', age: '$age' } }
        }
      },
      {
        $project: {
          gender: '$_id',
          userCount: 1,
          averageAge: { $round: ['$averageAge', 1] },
          users: 1,
          _id: 0
        }
      },
      { $sort: { userCount: -1 } }
    ]);

    return statistics;
  }

  async uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profilePhoto) {
      const oldKey = this.extractKeyFromUrl(user.profilePhoto);
      if (oldKey) {
        await this.s3Service.deleteFile(oldKey);
      }
    }

    const key = `users/${userId}/profile-${Date.now()}-${file.originalname}`;
    const photoUrl = await this.s3Service.uploadFile(file, key);

    user.profilePhoto = photoUrl;
    await user.save();

    return photoUrl;
  }

  async deleteProfilePhoto(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.profilePhoto) {
      return false;
    }

    const key = this.extractKeyFromUrl(user.profilePhoto);
    if (key) {
      await this.s3Service.deleteFile(key);
    }

    user.profilePhoto = undefined;
    await user.save();

    return true;
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const keyIndex = url.indexOf('.amazonaws.com/');
      if (keyIndex === -1) return null;
      return url.substring(keyIndex + '.amazonaws.com/'.length);
    } catch {
      return null;
    }
  }
}
