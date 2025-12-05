"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const now = new Date();
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);
        const created = await this.userModel.create({
            ...createUserDto,
            subscriptionStartDate: now,
            subscriptionEndDate: end,
        });
        return created.toObject();
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map