import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from './products.service';
import { UsersService } from '../users/users.service';
import { S3Service } from '../aws/s3.service';
import { ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

const mockProduct = {
  _id: 'product-id',
  name: 'Test Product',
  description: 'Test Description',
  price: 29.99,
  quantity: 100,
  photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  toObject: jest.fn().mockReturnValue({
    _id: 'product-id',
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    quantity: 100,
    photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  }),
  save: jest.fn().mockResolvedValue(this),
};

const mockProductModel = {
  create: jest.fn().mockResolvedValue(mockProduct),
  find: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue([mockProduct]),
  }),
  findById: jest.fn().mockResolvedValue(mockProduct),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockProduct),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockProduct),
};

const mockUsersService = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
};

const mockS3Service = {
  uploadFile: jest.fn().mockResolvedValue('https://example.com/photo.jpg'),
  deleteFile: jest.fn().mockResolvedValue(undefined),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<ProductDocument>;
  let usersService: UsersService;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<ProductDocument>>(getModelToken('Product'));
    usersService = module.get<UsersService>(UsersService);
    s3Service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        quantity: 100,
      };

      const result = await service.create(createProductDto);

      expect(productModel.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = await service.findAll();

      expect(productModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });

    it('should filter products by email', async () => {
      const email = 'test@example.com';
      const mockUserWithSubscription = {
        subscriptionStartDate: new Date(Date.now() - 1000),
        subscriptionEndDate: new Date(Date.now() + 1000),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUserWithSubscription);

      const result = await service.findAll(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(productModel.find).toHaveBeenCalled();
    });
  });

  describe('uploadProductPhotos', () => {
    it('should upload product photos', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test1'), mimetype: 'image/jpeg', size: 1000 } as Express.Multer.File,
        { buffer: Buffer.from('test2'), mimetype: 'image/png', size: 2000 } as Express.Multer.File,
      ];

      const result = await service.uploadProductPhotos('product-id', mockFiles);

      expect(s3Service.uploadFile).toHaveBeenCalledTimes(2);
      expect(productModel.findById).toHaveBeenCalledWith('product-id');
      expect(result).toEqual(['https://example.com/photo.jpg', 'https://example.com/photo.jpg']);
    });

    it('should throw error for invalid file types', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test'), mimetype: 'text/plain', size: 1000 } as Express.Multer.File,
      ];

      await expect(service.uploadProductPhotos('product-id', mockFiles)).rejects.toThrow(
        'Only image files are allowed'
      );
    });

    it('should throw error for files too large', async () => {
      const mockFiles = [
        { buffer: Buffer.alloc(6 * 1024 * 1024), mimetype: 'image/jpeg', size: 6 * 1024 * 1024 } as Express.Multer.File,
      ];

      await expect(service.uploadProductPhotos('product-id', mockFiles)).rejects.toThrow(
        'Each file size must be less than 5MB'
      );
    });
  });

  describe('deleteProductPhoto', () => {
    it('should delete a specific product photo', async () => {
      const photoUrl = 'https://test-bucket.s3.us-east-1.amazonaws.com/photo.jpg';

      const result = await service.deleteProductPhoto('product-id', photoUrl);

      expect(productModel.findById).toHaveBeenCalledWith('product-id');
      expect(s3Service.deleteFile).toHaveBeenCalledWith('photo.jpg');
      expect(result).toBe(true);
    });

    it('should return false if photo not found', async () => {
      const photoUrl = 'https://example.com/nonexistent.jpg';
      const productWithoutPhoto = { ...mockProduct, photos: [] };

      mockProductModel.findById.mockResolvedValueOnce(productWithoutPhoto);

      const result = await service.deleteProductPhoto('product-id', photoUrl);

      expect(result).toBe(false);
    });
  });

  describe('deleteAllProductPhotos', () => {
    it('should delete all product photos', async () => {
      const productWithS3Photos = {
        ...mockProduct,
        photos: ['https://test-bucket.s3.us-east-1.amazonaws.com/photo1.jpg', 'https://test-bucket.s3.us-east-1.amazonaws.com/photo2.jpg']
      };

      mockProductModel.findById.mockResolvedValueOnce(productWithS3Photos);

      const result = await service.deleteAllProductPhotos('product-id');

      expect(productModel.findById).toHaveBeenCalledWith('product-id');
      expect(s3Service.deleteFile).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it('should return false if no photos to delete', async () => {
      const productWithoutPhotos = { ...mockProduct, photos: [] };

      mockProductModel.findById.mockResolvedValueOnce(productWithoutPhotos);

      const result = await service.deleteAllProductPhotos('product-id');

      expect(result).toBe(false);
    });
  });
});