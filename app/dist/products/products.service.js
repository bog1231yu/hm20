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
const s3_service_1 = require("../aws/s3.service");
let ProductsService = class ProductsService {
    productModel;
    usersService;
    s3Service;
    constructor(productModel, usersService, s3Service) {
        this.productModel = productModel;
        this.usersService = usersService;
        this.s3Service = s3Service;
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
    async uploadProductPhotos(productId, files) {
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxFileSize = 5 * 1024 * 1024;
        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error('Only image files are allowed');
            }
            if (file.size > maxFileSize) {
                throw new Error('Each file size must be less than 5MB');
            }
        }
        const uploadedUrls = [];
        for (const file of files) {
            const key = `products/${productId}/photo-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
            const photoUrl = await this.s3Service.uploadFile(file, key);
            uploadedUrls.push(photoUrl);
        }
        product.photos = [...(product.photos || []), ...uploadedUrls];
        await product.save();
        return uploadedUrls;
    }
    async deleteProductPhoto(productId, photoUrl) {
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const photoIndex = product.photos?.indexOf(photoUrl);
        if (photoIndex === -1 || photoIndex === undefined) {
            return false;
        }
        const key = this.extractKeyFromUrl(photoUrl);
        if (key) {
            await this.s3Service.deleteFile(key);
        }
        product.photos.splice(photoIndex, 1);
        await product.save();
        return true;
    }
    async deleteAllProductPhotos(productId) {
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.photos || product.photos.length === 0) {
            return false;
        }
        for (const photoUrl of product.photos) {
            const key = this.extractKeyFromUrl(photoUrl);
            if (key) {
                await this.s3Service.deleteFile(key);
            }
        }
        product.photos = [];
        await product.save();
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
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Product')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        s3_service_1.S3Service])
], ProductsService);
//# sourceMappingURL=products.service.js.map