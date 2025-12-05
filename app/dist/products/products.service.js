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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
let ProductsService = class ProductsService {
    productModel;
    usersService;
    constructor(productModel, usersService) {
        this.productModel = productModel;
        this.usersService = usersService;
    }
    async create(dto) {
        const created = await this.productModel.create({
            name: dto.name,
            price: dto.price,
            category: dto.category,
            description: dto.description,
            quantity: dto.quantity,
        });
        return created.toObject();
    }
    async findAll(email) {
        const now = new Date();
        let applyDiscount = false;
        if (email) {
            const user = await this.usersService.findByEmail(email);
            if (user && user.subscriptionStartDate && user.subscriptionEndDate) {
                const start = new Date(user.subscriptionStartDate);
                const end = new Date(user.subscriptionEndDate);
                if (start <= now && now <= end) {
                    applyDiscount = true;
                }
            }
        }
        const products = await this.productModel.find().lean();
        if (!applyDiscount)
            return products;
        return products.map(p => ({ ...p, price: Math.round((p.price * 0.9) * 100) / 100 }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Product')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], ProductsService);
//# sourceMappingURL=products.service.js.map