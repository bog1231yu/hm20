import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpensesService } from './expenses.service';
import { UsersService } from '../users/users.service';
import { ExpenseDocument } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

const mockExpense = {
  _id: 'expense-id',
  user: 'user-id',
  category: 'Food',
  productName: 'Pizza',
  quantity: 2,
  price: 15.99,
  totalPrice: 31.98,
  toObject: jest.fn().mockReturnThis(),
};

const mockUser = {
  _id: 'user-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
};

const mockExpenseModel = {
  create: jest.fn().mockResolvedValue(mockExpense),
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([mockExpense]),
      }),
    }),
  }),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(mockExpense),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(mockExpense),
  }),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockExpense),
  aggregate: jest.fn().mockResolvedValue([
    {
      category: 'Food',
      totalAmount: 100,
      itemCount: 5,
      expenses: [mockExpense],
    },
  ]),
};

const mockUsersService = {
  findOne: jest.fn().mockResolvedValue(mockUser),
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseModel: Model<ExpenseDocument>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken('Expense'),
          useValue: mockExpenseModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expenseModel = module.get<Model<ExpenseDocument>>(getModelToken('Expense'));
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense', async () => {
      const createExpenseDto: CreateExpenseDto & { userId: string } = {
        userId: 'user-id',
        category: 'Food',
        productName: 'Pizza',
        quantity: 2,
        price: 15.99,
      };

      const result = await service.create(createExpenseDto);

      expect(usersService.findOne).toHaveBeenCalledWith('user-id');
      expect(expenseModel.create).toHaveBeenCalledWith({
        user: 'user-id',
        category: 'Food',
        productName: 'Pizza',
        quantity: 2,
        price: 15.99,
        totalPrice: 31.98,
      });
      expect(result).toEqual(mockExpense);
    });

    it('should throw error if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const createExpenseDto: CreateExpenseDto & { userId: string } = {
        userId: 'invalid-user-id',
        category: 'Food',
        productName: 'Pizza',
        quantity: 1,
        price: 10,
      };

      await expect(service.create(createExpenseDto)).rejects.toThrow('User not found');
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const query: QueryExpensesDto = { page: 1, take: 10 };

      const result = await service.findAll(query);

      expect(expenseModel.find).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockExpense],
        total: 1,
        page: 1,
        take: 10,
      });
    });

    it('should filter by userId', async () => {
      const query: QueryExpensesDto & { userId?: string } = {
        userId: 'user-id',
        page: 1,
        take: 10,
      };

      await service.findAll(query);

      expect(expenseModel.find).toHaveBeenCalledWith({ user: 'user-id' });
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const result = await service.findOne('expense-id');

      expect(expenseModel.findById).toHaveBeenCalledWith('expense-id');
      expect(result).toEqual(mockExpense);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateDto: Partial<CreateExpenseDto> = {
        quantity: 3,
        price: 20,
      };

      const result = await service.update('expense-id', updateDto);

      expect(expenseModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'expense-id',
        { ...updateDto, totalPrice: 60 },
        { new: true }
      );
      expect(result).toEqual(mockExpense);
    });
  });

  describe('delete', () => {
    it('should delete an expense', async () => {
      const result = await service.delete('expense-id');

      expect(expenseModel.findByIdAndDelete).toHaveBeenCalledWith('expense-id');
      expect(result).toBe(true);
    });
  });

  describe('getStatistics', () => {
    it('should return expense statistics', async () => {
      const result = await service.getStatistics();

      expect(expenseModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual([
        {
          category: 'Food',
          totalAmount: 100,
          itemCount: 5,
          expenses: [mockExpense],
        },
      ]);
    });

    it('should filter statistics by userId', async () => {
      const result = await service.getStatistics('user-id');

      expect(expenseModel.aggregate).toHaveBeenCalledWith([
        { $match: { user: 'user-id' } },
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
      ]);
    });
  });

  describe('getTopSpenders', () => {
    it('should return top spenders', async () => {
      const mockTopSpenders = [
        {
          userId: 'user-id',
          user: {
            _id: 'user-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          totalSpent: 500,
          expenseCount: 10,
        },
      ];

      mockExpenseModel.aggregate.mockResolvedValue(mockTopSpenders);

      const result = await service.getTopSpenders(5);

      expect(expenseModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockTopSpenders);
    });
  });
});
