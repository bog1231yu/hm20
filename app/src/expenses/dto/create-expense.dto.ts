import { IsString, IsNotEmpty, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const KNOWN_CATEGORIES = ['food', 'transport', 'utilities', 'entertainment', 'office', 'supplies', 'other'];

export class CreateExpenseDto {
  @ApiProperty({ example: 'food', enum: KNOWN_CATEGORIES, description: 'Expense category' })
  @IsNotEmpty({ message: 'category is required' })
  @IsString({ message: 'category must be a string' })
  @IsIn(KNOWN_CATEGORIES, { message: `category must be one of: ${KNOWN_CATEGORIES.join(', ')}` })
  category: string;

  @ApiProperty({ example: 'Pizza delivery', description: 'Product name' })
  @IsNotEmpty({ message: 'productName is required' })
  @IsString({ message: 'productName must be a string' })
  productName: string;

  @ApiProperty({ example: 2, description: 'Quantity of items' })
  @IsNotEmpty({ message: 'quantity is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;

  @ApiProperty({ example: 25.50, description: 'Price per item' })
  @IsNotEmpty({ message: 'price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0.01, { message: 'price must be at least 0.01' })
  price: number;
}
