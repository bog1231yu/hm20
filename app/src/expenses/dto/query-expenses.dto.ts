import { IsOptional, IsNumber, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

const KNOWN_CATEGORIES = ['food', 'transport', 'utilities', 'entertainment', 'office', 'supplies', 'other'];

export class QueryExpensesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page must be a number' })
  @Min(1, { message: 'page must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'take must be a number' })
  @Min(1, { message: 'take must be at least 1' })
  take: number = 30;

  @IsOptional()
  @IsString({ message: 'category must be a string' })
  @IsIn(KNOWN_CATEGORIES, { message: `category must be one of: ${KNOWN_CATEGORIES.join(', ')}` })
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'priceFrom must be a number' })
  @Min(0, { message: 'priceFrom must be at least 0' })
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'priceTo must be a number' })
  @Min(0, { message: 'priceTo must be at least 0' })
  priceTo?: number;
}
