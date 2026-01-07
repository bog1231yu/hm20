import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CloudFrontService } from './cloudfront.service';

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: any) => {
    const config = {
      AWS_REGION: 'us-east-1',
      CLOUDFRONT_DISTRIBUTION_ID: 'test-distribution-id',
    };
    return config[key] || defaultValue;
  }),
};

// Mock the AWS SDK
jest.mock('@aws-sdk/client-cloudfront', () => ({
  CloudFrontClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  CreateInvalidationCommand: jest.fn(),
}));

describe('CloudFrontService', () => {
  let service: CloudFrontService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudFrontService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CloudFrontService>(CloudFrontService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('invalidateCache', () => {
    it('should invalidate CloudFront cache', async () => {
      const paths = ['/test-path1', '/test-path2'];

      const result = await service.invalidateCache(paths);

      expect(result).toBeUndefined();
    });

    it('should handle empty paths array', async () => {
      const result = await service.invalidateCache([]);

      expect(result).toBeUndefined();
    });
  });
});