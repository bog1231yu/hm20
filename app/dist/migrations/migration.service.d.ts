import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
export declare class MigrationService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    addIsActiveToUsers(): Promise<import("mongoose").UpdateWriteOpResult>;
}
