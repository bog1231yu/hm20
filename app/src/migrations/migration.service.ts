import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  async addIsActiveToUsers() {
    console.log('Starting migration: Adding isActive field to all users...');

    const result = await this.userModel.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    console.log(`Migration completed: ${result.modifiedCount} users updated`);
    return result;
  }
}