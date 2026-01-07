import { ConfigService } from '@nestjs/config';
export declare class CloudFrontService {
    private configService;
    private cloudFrontClient;
    constructor(configService: ConfigService);
    invalidateCache(paths: string[]): Promise<void>;
}
