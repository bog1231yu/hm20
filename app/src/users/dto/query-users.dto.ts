import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class QueryUsersDto {
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

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'other'], description: 'Filter by gender' })
  @IsOptional()
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  gender?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Filter by email' })
  @IsOptional()
  @IsString({ message: 'email must be a string' })
  email?: string;
}
