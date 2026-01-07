import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  uploadProfilePhoto: jest.fn(),
  deleteProfilePhoto: jest.fn(),
  getGenderStatistics: jest.fn(),
  upgradeSubscription: jest.fn(),
};

const mockUser = {
  _id: 'user-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'USER',
};

const mockRequest = {
  user: {
    userId: 'user-id',
    role: 'USER',
  },
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users for admin', async () => {
      const query: QueryUsersDto = { page: 1, take: 10 };
      const adminRequest = { user: { role: 'ADMIN' } };

      mockUsersService.findAll.mockResolvedValue({
        data: [mockUser],
        total: 1,
        page: 1,
        take: 10,
      });

      const result = await controller.findAll(query, adminRequest);

      expect(usersService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        data: [mockUser],
        total: 1,
        page: 1,
        take: 10,
      });
    });

    it('should return paginated users for admin', async () => {
      const adminRequest = { user: { role: 'admin' } };
      const query: QueryUsersDto = { page: 1, take: 10 };

      mockUsersService.findAll.mockResolvedValue({
        data: [mockUser],
        total: 1,
        page: 1,
        take: 10,
      });

      const result = await controller.findAll(query, adminRequest);

      expect(usersService.findAll).toHaveBeenCalledWith(query);
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
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('user-id', mockRequest);

      expect(usersService.findOne).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException for accessing other user data', async () => {
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        _id: 'other-user-id',
      });

      await expect(controller.findOne('other-user-id', mockRequest)).rejects.toThrow(
        'Access denied'
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue({ ...mockUser, ...updateUserDto });

      const result = await controller.update('user-id', updateUserDto, mockRequest);

      expect(usersService.update).toHaveBeenCalledWith('user-id', updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.delete.mockResolvedValue(true);

      const result = await controller.delete('user-id', mockRequest);

      expect(usersService.delete).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({ success: true });
    });
  });

  describe('uploadProfilePhoto', () => {
    it('should upload profile photo', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      mockUsersService.uploadProfilePhoto.mockResolvedValue('https://example.com/photo.jpg');

      const result = await controller.uploadProfilePhoto('user-id', mockFile, mockRequest);

      expect(usersService.uploadProfilePhoto).toHaveBeenCalledWith('user-id', mockFile);
      expect(result).toEqual({ photoUrl: 'https://example.com/photo.jpg' });
    });
  });

  describe('deleteProfilePhoto', () => {
    it('should delete profile photo', async () => {
      mockUsersService.deleteProfilePhoto.mockResolvedValue(true);

      const result = await controller.deleteProfilePhoto('user-id', mockRequest);

      expect(usersService.deleteProfilePhoto).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({ success: true });
    });
  });

  describe('getGenderStatistics', () => {
    it('should return gender statistics', async () => {
      const mockStats = [
        { gender: 'male', count: 5 },
        { gender: 'female', count: 3 },
      ];

      mockUsersService.getGenderStatistics.mockResolvedValue(mockStats);

      const result = await controller.getGenderStatistics();

      expect(usersService.getGenderStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('upgradeSubscription', () => {
    it('should upgrade user subscription', async () => {
      const upgradeDto = { months: 6 };
      const adminRequest = { user: { role: 'admin' } };

      mockUsersService.upgradeSubscription.mockResolvedValue(mockUser);

      const result = await controller.upgradeSubscription('user-id', upgradeDto, adminRequest);

      expect(usersService.upgradeSubscription).toHaveBeenCalledWith('user-id', upgradeDto);
      expect(result).toEqual(mockUser);
    });
  });
});
