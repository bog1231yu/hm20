import { IsString, IsEmail, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString({ message: 'firstName must be a string' })
  @MinLength(2, { message: 'firstName must be at least 2 characters' })
  @MaxLength(50, { message: 'firstName must be at most 50 characters' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString({ message: 'lastName must be a string' })
  @MinLength(2, { message: 'lastName must be at least 2 characters' })
  @MaxLength(50, { message: 'lastName must be at most 50 characters' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
  @IsOptional()
  @IsString({ message: 'phoneNumber must be a string' })
  @MinLength(5, { message: 'phoneNumber must be at least 5 characters' })
  @MaxLength(20, { message: 'phoneNumber must be at most 20 characters' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'other'], description: 'User gender' })
  @IsOptional()
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  gender?: string;
}
