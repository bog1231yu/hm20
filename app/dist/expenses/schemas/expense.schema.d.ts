import { Document, Types } from 'mongoose';
export declare class Expense extends Document {
    user: Types.ObjectId;
    category: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense> & Expense & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>> & import("mongoose").FlatRecord<Expense> & {
    _id: Types.ObjectId;
}>;
export interface ExpenseDocument extends Expense {
}
