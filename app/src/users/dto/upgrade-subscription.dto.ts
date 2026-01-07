import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpgradeSubscriptionDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address to upgrade subscription' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
