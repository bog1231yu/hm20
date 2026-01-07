import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { S3Service } from '../aws/s3.service';
import type { ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    private usersService: UsersService,
    private s3Service: S3Service,
  ) {}

  async create(dto: CreateProductDto) {
    const created = await this.productModel.create({
      name: dto.name,
      price: dto.price,
      category: dto.category,
      description: dto.description,
      quantity: dto.quantity,
    });
    return created.toObject();
  }

  async findAll(email?: string) {
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
    if (!applyDiscount) return products;

    return products.map(p => ({ ...p, price: Math.round((p.price * 0.9) * 100) / 100 }));
  }

  async uploadProductPhotos(productId: string, files: Express.Multer.File[]): Promise<string[]> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Only image files are allowed');
      }
      if (file.size > maxFileSize) {
        throw new Error('Each file size must be less than 5MB');
      }
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const key = `products/${productId}/photo-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
      const photoUrl = await this.s3Service.uploadFile(file, key);
      uploadedUrls.push(photoUrl);
    }

    product.photos = [...(product.photos || []), ...uploadedUrls];
    await product.save();

    return uploadedUrls;
  }

  async deleteProductPhoto(productId: string, photoUrl: string): Promise<boolean> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
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

  async deleteAllProductPhotos(productId: string): Promise<boolean> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
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

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const keyIndex = url.indexOf('.amazonaws.com/');
      if (keyIndex === -1) return null;
      return url.substring(keyIndex + '.amazonaws.com/'.length);
    } catch {
      return null;
    }
  }
}
