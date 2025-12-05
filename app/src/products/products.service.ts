import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import type { ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    private usersService: UsersService,
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

  // If email provided and user has active subscription, return discounted products
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
}
