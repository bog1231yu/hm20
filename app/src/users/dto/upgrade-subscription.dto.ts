import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpgradeSubscriptionDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
