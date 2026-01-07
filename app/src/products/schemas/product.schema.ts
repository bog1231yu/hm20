import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: [String], default: [] })
  photos: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export interface ProductDocument extends Product {}
