import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MigrationService } from './migration.service';
import { UserDocument } from '../users/schemas/user.schema';

const mockUserModel = {
  updateMany: jest.fn().mockResolvedValue({ modifiedCount: 5 }),
};

describe('MigrationService', () => {
  let service: MigrationService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MigrationService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<MigrationService>(MigrationService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addIsActiveToUsers', () => {
    it('should add isActive field to users without it', async () => {
      const result = await service.addIsActiveToUsers();

      expect(userModel.updateMany).toHaveBeenCalledWith(
        { isActive: { $exists: false } },
        { $set: { isActive: true } }
      );
      expect(result).toEqual({ modifiedCount: 5 });
    });
  });
});