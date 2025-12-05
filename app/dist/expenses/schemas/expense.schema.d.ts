import { Schema, Document, Types } from 'mongoose';
export interface ExpenseDocument extends Document {
    user: Types.ObjectId;
    category: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}
export declare const ExpenseSchema: Schema<ExpenseDocument, import("mongoose").Model<ExpenseDocument, any, any, any, Document<unknown, any, ExpenseDocument> & ExpenseDocument & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExpenseDocument, Document<unknown, {}, import("mongoose").FlatRecord<ExpenseDocument>> & import("mongoose").FlatRecord<ExpenseDocument> & {
    _id: Types.ObjectId;
}>;
