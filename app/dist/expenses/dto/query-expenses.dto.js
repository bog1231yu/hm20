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
exports.QueryExpensesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const KNOWN_CATEGORIES = ['food', 'transport', 'utilities', 'entertainment', 'office', 'supplies', 'other'];
class QueryExpensesDto {
    page = 1;
    take = 30;
    category;
    priceFrom;
    priceTo;
}
exports.QueryExpensesDto = QueryExpensesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'page must be at least 1' }),
    __metadata("design:type", Number)
], QueryExpensesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'take must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'take must be at least 1' }),
    __metadata("design:type", Number)
], QueryExpensesDto.prototype, "take", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'category must be a string' }),
    (0, class_validator_1.IsIn)(KNOWN_CATEGORIES, { message: `category must be one of: ${KNOWN_CATEGORIES.join(', ')}` }),
    __metadata("design:type", String)
], QueryExpensesDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'priceFrom must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'priceFrom must be at least 0' }),
    __metadata("design:type", Number)
], QueryExpensesDto.prototype, "priceFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'priceTo must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'priceTo must be at least 0' }),
    __metadata("design:type", Number)
], QueryExpensesDto.prototype, "priceTo", void 0);
//# sourceMappingURL=query-expenses.dto.js.map