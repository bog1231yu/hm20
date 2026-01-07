import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUsersService = {
  validateUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockUser = {
  _id: 'user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      mockUsersService.validateUser.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(usersService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid credentials', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      const result = await service.validateUser('invalid@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate JWT token for user', async () => {
      const mockToken = 'jwt-token-123';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
    });
  });
});