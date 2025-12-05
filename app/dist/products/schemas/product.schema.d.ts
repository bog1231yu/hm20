import { Schema, Document } from 'mongoose';
export interface ProductDocument extends Document {
    name: string;
    price: number;
    category: string;
    description?: string;
    quantity: number;
}
export declare const ProductSchema: Schema<ProductDocument, import("mongoose").Model<ProductDocument, any, any, any, Document<unknown, any, ProductDocument> & ProductDocument & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductDocument, Document<unknown, {}, import("mongoose").FlatRecord<ProductDocument>> & import("mongoose").FlatRecord<ProductDocument> & {
    _id: import("mongoose").Types.ObjectId;
}>;
