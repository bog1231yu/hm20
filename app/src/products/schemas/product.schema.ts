import { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  price: number;
  category: string;
  description?: string;
  quantity: number;
}

export const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
});
