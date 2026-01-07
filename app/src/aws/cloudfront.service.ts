import { Injectable } from '@nestjs/common';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudFrontService {
  private cloudFrontClient: CloudFrontClient;

  constructor(private configService: ConfigService) {
    this.cloudFrontClient = new CloudFrontClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
    });
  }

  async invalidateCache(paths: string[]): Promise<void> {
    const distributionId = this.configService.get('CLOUDFRONT_DISTRIBUTION_ID');

    if (!distributionId) {
      console.warn('CloudFront distribution ID not configured, skipping cache invalidation');
      return;
    }

    try {
      const command = new CreateInvalidationCommand({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: `invalidation-${Date.now()}`,
          Paths: {
            Quantity: paths.length,
            Items: paths,
          },
        },
      });

      await this.cloudFrontClient.send(command);
      console.log(`Invalidated CloudFront cache for paths: ${paths.join(', ')}`);
    } catch (error) {
      console.error('Failed to invalidate CloudFront cache:', error);
    }
  }
}