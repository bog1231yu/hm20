import { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
}

export const UserSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
});
