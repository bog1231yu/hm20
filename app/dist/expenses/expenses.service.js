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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
let ExpensesService = class ExpensesService {
    expenseModel;
    usersService;
    constructor(expenseModel, usersService) {
        this.expenseModel = expenseModel;
        this.usersService = usersService;
    }
    async create(createExpenseDto) {
        const user = await this.usersService.findOne(createExpenseDto.userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const totalPrice = createExpenseDto.quantity * createExpenseDto.price;
        const created = await this.expenseModel.create({
            user: createExpenseDto.userId,
            category: createExpenseDto.category,
            productName: createExpenseDto.productName,
            quantity: createExpenseDto.quantity,
            price: createExpenseDto.price,
            totalPrice,
        });
        return created.toObject();
    }
    async findAll(query) {
        const filter = {};
        if (query.category)
            filter.category = query.category;
        if (query.priceFrom !== undefined || query.priceTo !== undefined) {
            filter.price = {};
            if (query.priceFrom !== undefined)
                filter.price.$gte = query.priceFrom;
            if (query.priceTo !== undefined)
                filter.price.$lte = query.priceTo;
        }
        const page = query.page || 1;
        const take = query.take || 30;
        const total = await this.expenseModel.countDocuments(filter);
        const data = await this.expenseModel.find(filter).skip((page - 1) * take).limit(take).lean();
        return { data, total, page, take };
    }
    async findOne(id) {
        return this.expenseModel.findById(id).lean();
    }
    async update(id, dto) {
        if (dto.userId) {
            const user = await this.usersService.findOne(dto.userId);
            if (!user)
                throw new common_1.NotFoundException('User not found');
        }
        if (dto.quantity !== undefined || dto.price !== undefined) {
            const expense = await this.expenseModel.findById(id);
            if (!expense)
                return null;
            const quantity = dto.quantity ?? expense.quantity;
            const price = dto.price ?? expense.price;
            const totalPrice = quantity * price;
            const updated = await this.expenseModel.findByIdAndUpdate(id, { ...dto, totalPrice }, { new: true }).lean();
            return updated;
        }
        return this.expenseModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    }
    async delete(id) {
        const res = await this.expenseModel.findByIdAndDelete(id);
        return !!res;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Expense')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map