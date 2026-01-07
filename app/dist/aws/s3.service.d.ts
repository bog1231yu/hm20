import { ConfigService } from '@nestjs/config';
import { CloudFrontService } from './cloudfront.service';
export declare class S3Service {
    private configService;
    private cloudFrontService;
    private s3Client;
    constructor(configService: ConfigService, cloudFrontService: CloudFrontService);
    uploadFile(file: Express.Multer.File, key: string, bucket?: string): Promise<string>;
    deleteFile(key: string, bucket?: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number, bucket?: string): Promise<string>;
    getPublicUrl(key: string, bucket?: string): string;
    getCloudFrontUrl(key: string, distributionDomain?: string): string | null;
}
