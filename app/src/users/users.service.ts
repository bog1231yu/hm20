import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

import type { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  // CREATE
  async create(createUserDto: CreateUserDto) {
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);

    const created = await this.userModel.create({
      ...createUserDto,
      subscriptionStartDate: now,
      subscriptionEndDate: end,
    });
    return created.toObject();
  }

  // READ ALL with pagination and filtering
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

  // READ ONE
  async findOne(id: string) {
    return this.userModel.findById(id).lean();
  }

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).lean();
  }

  // DELETE
  async delete(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    return !!res;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: { $regex: `^${email}$`, $options: 'i' } }).lean();
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
}
