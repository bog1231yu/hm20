import { Schema, Document, Types } from 'mongoose';

export interface ExpenseDocument extends Document {
  user: Types.ObjectId;
  category: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export const ExpenseSchema = new Schema<ExpenseDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});
