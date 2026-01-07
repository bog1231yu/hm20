import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength, MaxLength, IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsNotEmpty({ message: 'firstName is required' })
  @IsString({ message: 'firstName must be a string' })
  @MinLength(2, { message: 'firstName must be at least 2 characters' })
  @MaxLength(50, { message: 'firstName must be at most 50 characters' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsNotEmpty({ message: 'lastName is required' })
  @IsString({ message: 'lastName must be a string' })
  @MinLength(2, { message: 'lastName must be at least 2 characters' })
  @MaxLength(50, { message: 'lastName must be at most 50 characters' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  @IsNotEmpty({ message: 'phoneNumber is required' })
  @IsString({ message: 'phoneNumber must be a string' })
  @MinLength(5, { message: 'phoneNumber must be at least 5 characters' })
  @MaxLength(20, { message: 'phoneNumber must be at most 20 characters' })
  phoneNumber: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female', 'other'], description: 'User gender' })
  @IsNotEmpty({ message: 'gender is required' })
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  gender: string;

  @ApiProperty({ example: 25, required: false, description: 'User age' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'age must be a number' })
  @Min(1, { message: 'age must be at least 1' })
  @Max(120, { message: 'age must be at most 120' })
  age?: number;

  @ApiProperty({ example: true, required: false, description: 'User active status' })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'], required: false, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be user or admin' })
  role?: UserRole;
}
