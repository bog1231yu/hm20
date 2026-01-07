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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (Gender = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
class CreateUserDto {
    firstName;
    lastName;
    email;
    password;
    phoneNumber;
    gender;
    age;
    isActive;
    role;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John', description: 'User first name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'firstName is required' }),
    (0, class_validator_1.IsString)({ message: 'firstName must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'firstName must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(50, { message: 'firstName must be at most 50 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe', description: 'User last name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'lastName is required' }),
    (0, class_validator_1.IsString)({ message: 'lastName must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'lastName must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(50, { message: 'lastName must be at most 50 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@example.com', description: 'User email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'email must be a valid email address' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', description: 'User password' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'password is required' }),
    (0, class_validator_1.IsString)({ message: 'password must be a string' }),
    (0, class_validator_1.MinLength)(6, { message: 'password must be at least 6 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890', description: 'User phone number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'phoneNumber is required' }),
    (0, class_validator_1.IsString)({ message: 'phoneNumber must be a string' }),
    (0, class_validator_1.MinLength)(5, { message: 'phoneNumber must be at least 5 characters' }),
    (0, class_validator_1.MaxLength)(20, { message: 'phoneNumber must be at most 20 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'male', enum: ['male', 'female', 'other'], description: 'User gender' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'gender is required' }),
    (0, class_validator_1.IsEnum)(Gender, { message: 'gender must be male, female, or other' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, required: false, description: 'User age' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'age must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'age must be at least 1' }),
    (0, class_validator_1.Max)(120, { message: 'age must be at most 120' }),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false, description: 'User active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isActive must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user', enum: ['user', 'admin'], required: false, description: 'User role' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserRole, { message: 'role must be user or admin' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
//# sourceMappingURL=create-user.dto.js.map