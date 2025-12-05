import { Controller, Get, Post, Body, Headers, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  async findAll(@Headers('email') email?: string) {
    // If no email header provided, return all products (no error)
    return this.productsService.findAll(email);
  }
}
