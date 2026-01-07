import { Document } from 'mongoose';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    gender: string;
    age?: number;
    isActive: boolean;
    role: UserRole;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    profilePhoto?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export interface UserDocument extends User {
}
