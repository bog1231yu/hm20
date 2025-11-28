import { IsString, IsEmail, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'firstName must be a string' })
  @MinLength(2, { message: 'firstName must be at least 2 characters' })
  @MaxLength(50, { message: 'firstName must be at most 50 characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'lastName must be a string' })
  @MinLength(2, { message: 'lastName must be at least 2 characters' })
  @MaxLength(50, { message: 'lastName must be at most 50 characters' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'phoneNumber must be a string' })
  @MinLength(5, { message: 'phoneNumber must be at least 5 characters' })
  @MaxLength(20, { message: 'phoneNumber must be at most 20 characters' })
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  gender?: string;
}
