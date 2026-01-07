import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ type: Number, min: 1, max: 120 })
  age?: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  subscriptionStartDate?: Date;

  @Prop()
  subscriptionEndDate?: Date;

  @Prop()
  profilePhoto?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface UserDocument extends User {}
