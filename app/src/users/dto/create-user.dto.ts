import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength, MaxLength } from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'firstName is required' })
  @IsString({ message: 'firstName must be a string' })
  @MinLength(2, { message: 'firstName must be at least 2 characters' })
  @MaxLength(50, { message: 'firstName must be at most 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName is required' })
  @IsString({ message: 'lastName must be a string' })
  @MinLength(2, { message: 'lastName must be at least 2 characters' })
  @MaxLength(50, { message: 'lastName must be at most 50 characters' })
  lastName: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'phoneNumber is required' })
  @IsString({ message: 'phoneNumber must be a string' })
  @MinLength(5, { message: 'phoneNumber must be at least 5 characters' })
  @MaxLength(20, { message: 'phoneNumber must be at most 20 characters' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'gender is required' })
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  gender: string;
}
