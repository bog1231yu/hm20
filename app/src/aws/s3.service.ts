import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { CloudFrontService } from './cloudfront.service';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(
    private configService: ConfigService,
    private cloudFrontService: CloudFrontService,
  ) {
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    key: string,
    bucket: string = this.configService.get('AWS_S3_BUCKET', 'expense-tracker-bucket')
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);

    return `https://${bucket}.s3.${this.configService.get('AWS_REGION', 'us-east-1')}.amazonaws.com/${key}`;
  }

  async deleteFile(
    key: string,
    bucket: string = this.configService.get('AWS_S3_BUCKET', 'expense-tracker-bucket')
  ): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.s3Client.send(command);

    const cloudFrontUrl = this.getCloudFrontUrl(key);
    if (cloudFrontUrl) {
      await this.cloudFrontService.invalidateCache([`/${key}`]);
    }
  }

  async getSignedUrl(
    key: string,
    expiresIn: number = 3600,
    bucket: string = this.configService.get('AWS_S3_BUCKET', 'expense-tracker-bucket')
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  getPublicUrl(
    key: string,
    bucket: string = this.configService.get('AWS_S3_BUCKET', 'expense-tracker-bucket')
  ): string {
    return `https://${bucket}.s3.${this.configService.get('AWS_REGION', 'us-east-1')}.amazonaws.com/${key}`;
  }

  getCloudFrontUrl(
    key: string,
    distributionDomain?: string
  ): string | null {
    const domain = distributionDomain || this.configService.get('CLOUDFRONT_DOMAIN');
    if (!domain) return null;

    return `https://${domain}/${key}`;
  }
}