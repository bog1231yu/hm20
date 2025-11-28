import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class QueryUsersDto {
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
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  gender?: string;

  @IsOptional()
  @IsString({ message: 'email must be a string' })
  email?: string;
}
