import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  uploadProductPhotos: jest.fn(),
  deleteProductPhoto: jest.fn(),
  deleteAllProductPhotos: jest.fn(),
};

const mockProduct = {
  _id: 'product-id',
  name: 'Test Product',
  description: 'Test Description',
  price: 29.99,
  quantity: 100,
  photos: ['https://example.com/photo1.jpg'],
};

const mockRequest = {
  user: {
    userId: 'user-id',
    role: 'USER',
  },
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
          name: 'Test Product',
          description: 'Test Description',
          price: 29.99,
          quantity: 100,
          category: ''
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      mockProductsService.findAll.mockResolvedValue([mockProduct]);

      const result = await controller.findAll();

      expect(productsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockProduct]);
    });

    it('should filter products by email', async () => {
      const email = 'test@example.com';

      mockProductsService.findAll.mockResolvedValue([mockProduct]);

      const result = await controller.findAll(email);

      expect(productsService.findAll).toHaveBeenCalledWith(email);
    });
  });

  describe('uploadProductPhotos', () => {
    it('should upload product photos', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as Express.Multer.File,
      ];

      mockProductsService.uploadProductPhotos.mockResolvedValue(['https://example.com/photo.jpg']);

      const result = await controller.uploadProductPhotos('product-id', mockFiles);

      expect(productsService.uploadProductPhotos).toHaveBeenCalledWith('product-id', mockFiles);
      expect(result).toEqual({ photoUrls: ['https://example.com/photo.jpg'] });
    });

    it('should throw error for no files', async () => {
      await expect(controller.uploadProductPhotos('product-id', [])).rejects.toThrow(
        'No files provided'
      );
    });
  });

  describe('deleteProductPhoto', () => {
    it('should delete a specific product photo', async () => {
      const photoUrl = 'https://example.com/photo.jpg';

      mockProductsService.deleteProductPhoto.mockResolvedValue(true);

      const result = await controller.deleteProductPhoto('product-id', photoUrl);

      expect(productsService.deleteProductPhoto).toHaveBeenCalledWith('product-id', photoUrl);
      expect(result).toEqual({ success: true });
    });

    it('should throw error for missing photo URL', async () => {
      await expect(controller.deleteProductPhoto('product-id', '')).rejects.toThrow(
        'Photo URL is required'
      );
    });
  });

  describe('deleteAllProductPhotos', () => {
    it('should delete all product photos', async () => {
      mockProductsService.deleteAllProductPhotos.mockResolvedValue(true);

      const result = await controller.deleteAllProductPhotos('product-id');

      expect(productsService.deleteAllProductPhotos).toHaveBeenCalledWith('product-id');
      expect(result).toEqual({ success: true });
    });
  });
});