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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const KNOWN_CATEGORIES = ['food', 'transport', 'utilities', 'entertainment', 'office', 'supplies', 'other'];
class CreateExpenseDto {
    category;
    productName;
    quantity;
    price;
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'food', enum: KNOWN_CATEGORIES, description: 'Expense category' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'category is required' }),
    (0, class_validator_1.IsString)({ message: 'category must be a string' }),
    (0, class_validator_1.IsIn)(KNOWN_CATEGORIES, { message: `category must be one of: ${KNOWN_CATEGORIES.join(', ')}` }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pizza delivery', description: 'Product name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'productName is required' }),
    (0, class_validator_1.IsString)({ message: 'productName must be a string' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Quantity of items' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'quantity is required' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'quantity must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'quantity must be at least 1' }),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25.50, description: 'Price per item' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'price is required' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'price must be a number' }),
    (0, class_validator_1.Min)(0.01, { message: 'price must be at least 0.01' }),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "price", void 0);
//# sourceMappingURL=create-expense.dto.js.map