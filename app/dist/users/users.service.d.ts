import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { LoginDto } from './dto/login.dto';
import { S3Service } from '../aws/s3.service';
import type { UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    private s3Service;
    constructor(userModel: Model<UserDocument>, s3Service: S3Service);
    create(createUserDto: CreateUserDto): Promise<UserDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(query: QueryUsersDto): Promise<{
        data: (import("mongoose").FlattenMaps<UserDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        take: number;
    }>;
    findOne(id: string): Promise<(import("mongoose").FlattenMaps<UserDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<(import("mongoose").FlattenMaps<UserDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<boolean>;
    findByEmail(email: string): Promise<(import("mongoose").FlattenMaps<UserDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    validateUser(loginDto: LoginDto): Promise<(UserDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    upgradeSubscription(email: string): Promise<(UserDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getGenderStatistics(): Promise<any[]>;
    uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<string>;
    deleteProfilePhoto(userId: string): Promise<boolean>;
    private extractKeyFromUrl;
}
