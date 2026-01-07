import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import { CloudFrontService } from './cloudfront.service';

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: any) => {
    const config = {
      AWS_ACCESS_KEY_ID: 'test-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret',
      AWS_REGION: 'us-east-1',
      AWS_S3_BUCKET: 'test-bucket',
      CLOUDFRONT_DOMAIN: 'test-distribution.cloudfront.net',
    };
    return config[key] || defaultValue;
  }),
};

const mockCloudFrontService = {
  invalidateCache: jest.fn().mockResolvedValue(undefined),
};

// Mock the AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://signed-url.com'),
}));

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;
  let cloudFrontService: CloudFrontService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CloudFrontService,
          useValue: mockCloudFrontService,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
    cloudFrontService = module.get<CloudFrontService>(CloudFrontService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file to S3', async () => {
      const mockFile = {
        buffer: Buffer.from('test content'),
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const result = await service.uploadFile(mockFile, 'test-key');

      expect(result).toContain('https://test-bucket.s3.us-east-1.amazonaws.com/test-key');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from S3', async () => {
      const result = await service.deleteFile('test-key');

      expect(result).toBeUndefined();
    });

    it('should invalidate CloudFront cache after deletion', async () => {
      await service.deleteFile('test-key');

      expect(cloudFrontService.invalidateCache).toHaveBeenCalledWith(['/test-key']);
    });
  });

  describe('getSignedUrl', () => {
    it('should generate a signed URL', async () => {
      const result = await service.getSignedUrl('test-key');

      expect(result).toBe('https://signed-url.com');
    });

    it('should use custom bucket and expires time', async () => {
      const result = await service.getSignedUrl('test-key', 7200, 'custom-bucket');

      expect(result).toBe('https://signed-url.com');
    });
  });

  describe('getCloudFrontUrl', () => {
    it('should return CloudFront URL when distribution ID is configured', () => {
      const result = service.getCloudFrontUrl('test-key');

      expect(result).toBe('https://test-distribution.cloudfront.net/test-key');
    });

    it('should return null when distribution ID is not configured', () => {
      mockConfigService.get.mockReturnValueOnce(undefined);

      const result = service.getCloudFrontUrl('test-key');

      expect(result).toBeNull();
    });
  });
});