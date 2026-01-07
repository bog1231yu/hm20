import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { CloudFrontService } from './cloudfront.service';

@Module({
  imports: [ConfigModule],
  providers: [S3Service, CloudFrontService],
  exports: [S3Service, CloudFrontService],
})
export class AwsModule {}