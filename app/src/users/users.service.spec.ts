import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { S3Service } from '../aws/s3.service';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

const mockUser = {
  _id: 'user-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '123456789',
  gender: 'male',
  role: 'USER',
  isActive: true,
  profilePhoto: 'https://example.com/photo.jpg',
  subscriptionStartDate: new Date(),
  subscriptionEndDate: new Date(),
  toObject: jest.fn().mockReturnThis(),
};

mockUser.save = jest.fn().mockResolvedValue(mockUser);

const mockUserModel = {
  create: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([mockUser]),
      }),
    }),
  }),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(mockUser),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(mockUser),
  }),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(mockUser),
  aggregate: jest.fn().mockResolvedValue([
    { _id: 'male', count: 5 },
    { _id: 'female', count: 3 },
  ]),
};

const mockS3Service = {
  uploadFile: jest.fn().mockResolvedValue('https://example.com/photo.jpg'),
  deleteFile: jest.fn().mockResolvedValue(undefined),
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
    s3Service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phoneNumber: '123456789',
        gender: 'male',
      };

      const result = await service.create(createUserDto);

      expect(userModel.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: expect.any(String), // Password should be hashed
        phoneNumber: '123456789',
        gender: 'male',
        role: 'user',
        subscriptionStartDate: expect.any(Date),
        subscriptionEndDate: expect.any(Date),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query: QueryUsersDto = { page: 1, take: 10 };

      const result = await service.findAll(query);

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockUser],
        total: 1,
        page: 1,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOne('user-id');

      expect(userModel.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const result = await service.update('user-id', updateUserDto);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        updateUserDto,
        { new: true }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await service.delete('user-id');

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('user-id');
      expect(result).toBe(true);
    });
  });

  describe('uploadProfilePhoto', () => {
    it('should upload profile photo', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const result = await service.uploadProfilePhoto('user-id', mockFile);

      expect(s3Service.uploadFile).toHaveBeenCalled();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { profilePhoto: 'https://example.com/photo.jpg' },
        { new: true }
      );
      expect(result).toBe('https://example.com/photo.jpg');
    });
  });

  describe('deleteProfilePhoto', () => {
    it('should delete profile photo', async () => {
      mockUserModel.findById.mockResolvedValue({ ...mockUser, profilePhoto: 'https://example.com/photo.jpg' });

      const result = await service.deleteProfilePhoto('user-id');

      expect(s3Service.deleteFile).toHaveBeenCalled();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { $unset: { profilePhoto: 1 } },
        { new: true }
      );
      expect(result).toBe(true);
    });
  });

  describe('getGenderStatistics', () => {
    it('should return gender statistics', async () => {
      const result = await service.getGenderStatistics();

      expect(userModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual([
        { gender: 'male', count: 5 },
        { gender: 'female', count: 3 },
      ]);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const loginDto = { email: 'john@example.com', password: 'password123' };

      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockUser]),
      });

      const result = await service.validateUser(loginDto);

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
