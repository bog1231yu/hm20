import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

const mockExpensesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getStatistics: jest.fn(),
  getTopSpenders: jest.fn(),
};

const mockExpense = {
  _id: 'expense-id',
  user: 'user-id',
  category: 'Food',
  productName: 'Pizza',
  quantity: 2,
  price: 15.99,
  totalPrice: 31.98,
};

const mockRequest = {
  user: {
    userId: 'user-id',
    role: 'USER',
  },
};

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let expensesService: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    expensesService = module.get<ExpensesService>(ExpensesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        category: 'Food',
        productName: 'Pizza',
        quantity: 2,
        price: 15.99,
      };

      mockExpensesService.create.mockResolvedValue(mockExpense);

      const result = await controller.create(createExpenseDto, mockRequest);

      expect(expensesService.create).toHaveBeenCalledWith({
        ...createExpenseDto,
        userId: 'user-id',
      });
      expect(result).toEqual(mockExpense);
    });
  });

  describe('findAll', () => {
    it('should return all expenses for admin', async () => {
      const query: QueryExpensesDto = { page: 1, take: 10 };
      const adminRequest = { user: { role: 'ADMIN' } };

      mockExpensesService.findAll.mockResolvedValue({
        data: [mockExpense],
        total: 1,
        page: 1,
        take: 10,
      });

      const result = await controller.findAll(query, adminRequest);

      expect(expensesService.findAll).toHaveBeenCalledWith(query);
    });

    it('should return own expenses for regular user', async () => {
      const query: QueryExpensesDto = { page: 1, take: 10 };

      mockExpensesService.findAll.mockResolvedValue({
        data: [mockExpense],
        total: 1,
        page: 1,
        take: 10,
      });

      const result = await controller.findAll(query, mockRequest);

      expect(expensesService.findAll).toHaveBeenCalledWith({
        ...query,
        userId: 'user-id',
      });
    });
  });

  describe('findOne', () => {
    it('should return an expense by id for owner', async () => {
      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'user-id' },
      });

      const result = await controller.findOne('expense-id', mockRequest);

      expect(expensesService.findOne).toHaveBeenCalledWith('expense-id');
      expect(result).toEqual({
        ...mockExpense,
        user: { toString: () => 'user-id' },
      });
    });

    it('should return an expense by id for admin', async () => {
      const adminRequest = { user: { role: 'admin' } };

      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'other-user-id' },
      });

      const result = await controller.findOne('expense-id', adminRequest);

      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException for accessing other user expense', async () => {
      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'other-user-id' },
      });

      await expect(controller.findOne('expense-id', mockRequest)).rejects.toThrow(
        'Access denied'
      );
    });
  });

  describe('update', () => {
    it('should update an expense for owner', async () => {
      const updateDto: CreateExpenseDto = {
        category: 'Food',
        productName: 'Burger',
        quantity: 1,
        price: 10,
      };

      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'user-id' },
      });
      mockExpensesService.update.mockResolvedValue({ ...mockExpense, ...updateDto });

      const result = await controller.update('expense-id', updateDto, mockRequest);

      expect(expensesService.update).toHaveBeenCalledWith('expense-id', updateDto);
    });

    it('should update an expense for admin', async () => {
      const adminRequest = { user: { role: 'admin' } };
      const updateDto: CreateExpenseDto = {
        category: 'Food',
        productName: 'Burger',
        quantity: 1,
        price: 10,
      };

      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'other-user-id' },
      });
      mockExpensesService.update.mockResolvedValue({ ...mockExpense, ...updateDto });

      const result = await controller.update('expense-id', updateDto, adminRequest);

      expect(expensesService.update).toHaveBeenCalledWith('expense-id', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete an expense for owner', async () => {
      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'user-id' },
      });
      mockExpensesService.delete.mockResolvedValue(true);

      const result = await controller.delete('expense-id', mockRequest);

      expect(expensesService.delete).toHaveBeenCalledWith('expense-id');
      expect(result).toEqual({ success: true });
    });

    it('should delete an expense for admin', async () => {
      const adminRequest = { user: { role: 'admin' } };

      mockExpensesService.findOne.mockResolvedValue({
        ...mockExpense,
        user: { toString: () => 'other-user-id' },
      });
      mockExpensesService.delete.mockResolvedValue(true);

      const result = await controller.delete('expense-id', adminRequest);

      expect(result).toEqual({ success: true });
    });
  });

  describe('getStatistics', () => {
    it('should return statistics for admin', async () => {
      const adminRequest = { user: { role: 'admin' } };
      const mockStats = [{ category: 'Food', totalAmount: 100 }];

      mockExpensesService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStatistics(adminRequest);

      expect(expensesService.getStatistics).toHaveBeenCalledWith();
    });

    it('should return statistics for user', async () => {
      const mockStats = [{ category: 'Food', totalAmount: 50 }];

      mockExpensesService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStatistics(mockRequest);

      expect(expensesService.getStatistics).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getTopSpenders', () => {
    it('should return top spenders', async () => {
      const adminRequest = { user: { role: 'ADMIN' } };
      const mockTopSpenders = [
        {
          userId: 'user-id',
          user: { firstName: 'John', lastName: 'Doe' },
          totalSpent: 500,
        },
      ];

      mockExpensesService.getTopSpenders.mockResolvedValue(mockTopSpenders);

      const result = await controller.getTopSpenders('5');

      expect(expensesService.getTopSpenders).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockTopSpenders);
    });
  });
});
