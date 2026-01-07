import { IsOptional, IsNumber, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const KNOWN_CATEGORIES = ['food', 'transport', 'utilities', 'entertainment', 'office', 'supplies', 'other'];

export class QueryExpensesDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page must be a number' })
  @Min(1, { message: 'page must be at least 1' })
  page: number = 1;

  @ApiPropertyOptional({ example: 30, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'take must be a number' })
  @Min(1, { message: 'take must be at least 1' })
  take: number = 30;

  @ApiPropertyOptional({ example: 'food', enum: KNOWN_CATEGORIES, description: 'Filter by expense category' })
  @IsOptional()
  @IsString({ message: 'category must be a string' })
  @IsIn(KNOWN_CATEGORIES, { message: `category must be one of: ${KNOWN_CATEGORIES.join(', ')}` })
  category?: string;

  @ApiPropertyOptional({ example: 10, description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'priceFrom must be a number' })
  @Min(0, { message: 'priceFrom must be at least 0' })
  priceFrom?: number;

  @ApiPropertyOptional({ example: 100, description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'priceTo must be a number' })
  @Min(0, { message: 'priceTo must be at least 0' })
  priceTo?: number;
}
