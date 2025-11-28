import { IsString, IsNotEmpty, IsNumber, Min, IsIn } from 'class-validator';

const KNOWN_CATEGORIES = ['food', 'transport', 'utilities', 'entertainment', 'office', 'supplies', 'other'];

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'category is required' })
  @IsString({ message: 'category must be a string' })
  @IsIn(KNOWN_CATEGORIES, { message: `category must be one of: ${KNOWN_CATEGORIES.join(', ')}` })
  category: string;

  @IsNotEmpty({ message: 'productName is required' })
  @IsString({ message: 'productName must be a string' })
  productName: string;

  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0.01, { message: 'price must be at least 0.01' })
  price: number;
}
