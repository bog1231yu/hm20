import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from '../users/users.module';
import { ProductSchema } from './schemas/product.schema';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AwsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
