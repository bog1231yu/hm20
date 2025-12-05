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
export declare const UserSchema: Schema<UserDocument, import("mongoose").Model<UserDocument, any, any, any, Document<unknown, any, UserDocument> & UserDocument & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserDocument, Document<unknown, {}, import("mongoose").FlatRecord<UserDocument>> & import("mongoose").FlatRecord<UserDocument> & {
    _id: import("mongoose").Types.ObjectId;
}>;
