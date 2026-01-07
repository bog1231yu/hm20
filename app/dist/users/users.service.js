"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("./schemas/user.schema");
const s3_service_1 = require("../aws/s3.service");
let UsersService = class UsersService {
    userModel;
    s3Service;
    constructor(userModel, s3Service) {
        this.userModel = userModel;
        this.s3Service = s3Service;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const now = new Date();
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);
        const created = await this.userModel.create({
            ...createUserDto,
            password: hashedPassword,
            role: createUserDto.role || user_schema_1.UserRole.USER,
            subscriptionStartDate: now,
            subscriptionEndDate: end,
        });
        const user = created.toObject();
        delete user.password;
        return user;
    }
    async findAll(query) {
        const filter = {};
        if (query.gender)
            filter.gender = query.gender;
        if (query.email)
            filter.email = { $regex: `^${query.email}`, $options: 'i' };
        const page = query.page || 1;
        const take = query.take || 30;
        const total = await this.userModel.countDocuments(filter);
        const data = await this.userModel.find(filter).skip((page - 1) * take).limit(take).lean();
        return { data, total, page, take };
    }
    async findOne(id) {
        return this.userModel.findById(id).lean();
    }
    async update(id, updateUserDto) {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).lean();
    }
    async delete(id) {
        const res = await this.userModel.findByIdAndDelete(id);
        return !!res;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: { $regex: `^${email}$`, $options: 'i' } }).lean();
    }
    async validateUser(loginDto) {
        const user = await this.userModel.findOne({ email: { $regex: `^${loginDto.email}$`, $options: 'i' } });
        if (!user)
            return null;
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid)
            return null;
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }
    async upgradeSubscription(email) {
        const user = await this.userModel.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
        if (!user)
            return null;
        const currentEnd = user.subscriptionEndDate ?? new Date();
        const newEnd = new Date(currentEnd);
        newEnd.setMonth(newEnd.getMonth() + 1);
        user.subscriptionEndDate = newEnd;
        await user.save();
        return user.toObject();
    }
    async getGenderStatistics() {
        const statistics = await this.userModel.aggregate([
            {
                $match: { age: { $exists: true, $ne: null } }
            },
            {
                $group: {
                    _id: '$gender',
                    userCount: { $sum: 1 },
                    totalAge: { $sum: '$age' },
                    averageAge: { $avg: '$age' },
                    users: { $push: { firstName: '$firstName', lastName: '$lastName', age: '$age' } }
                }
            },
            {
                $project: {
                    gender: '$_id',
                    userCount: 1,
                    averageAge: { $round: ['$averageAge', 1] },
                    users: 1,
                    _id: 0
                }
            },
            { $sort: { userCount: -1 } }
        ]);
        return statistics;
    }
    async uploadProfilePhoto(userId, file) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.profilePhoto) {
            const oldKey = this.extractKeyFromUrl(user.profilePhoto);
            if (oldKey) {
                await this.s3Service.deleteFile(oldKey);
            }
        }
        const key = `users/${userId}/profile-${Date.now()}-${file.originalname}`;
        const photoUrl = await this.s3Service.uploadFile(file, key);
        user.profilePhoto = photoUrl;
        await user.save();
        return photoUrl;
    }
    async deleteProfilePhoto(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.profilePhoto) {
            return false;
        }
        const key = this.extractKeyFromUrl(user.profilePhoto);
        if (key) {
            await this.s3Service.deleteFile(key);
        }
        user.profilePhoto = undefined;
        await user.save();
        return true;
    }
    extractKeyFromUrl(url) {
        try {
            const urlParts = url.split('/');
            const keyIndex = url.indexOf('.amazonaws.com/');
            if (keyIndex === -1)
                return null;
            return url.substring(keyIndex + '.amazonaws.com/'.length);
        }
        catch {
            return null;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        s3_service_1.S3Service])
], UsersService);
//# sourceMappingURL=users.service.js.map