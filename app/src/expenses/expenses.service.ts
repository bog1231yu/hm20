import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import type { ExpenseDocument } from './schemas/expense.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('Expense') private expenseModel: Model<ExpenseDocument>,
    private usersService: UsersService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto & { userId: string }) {
    const user = await this.usersService.findOne(createExpenseDto.userId);
    if (!user) throw new NotFoundException('User not found');

    const totalPrice = createExpenseDto.quantity * createExpenseDto.price;
    const created = await this.expenseModel.create({
      user: createExpenseDto.userId,
      category: createExpenseDto.category,
      productName: createExpenseDto.productName,
      quantity: createExpenseDto.quantity,
      price: createExpenseDto.price,
      totalPrice,
    });
    return created.toObject();
  }

  async findAll(query: QueryExpensesDto & { userId?: string }) {
    const filter: any = {};
    if (query.userId) filter.user = query.userId;
    if (query.category) filter.category = query.category;
    if (query.priceFrom !== undefined || query.priceTo !== undefined) {
      filter.price = {};
      if (query.priceFrom !== undefined) filter.price.$gte = query.priceFrom;
      if (query.priceTo !== undefined) filter.price.$lte = query.priceTo;
    }

    const page = query.page || 1;
    const take = query.take || 30;

    const total = await this.expenseModel.countDocuments(filter);
    const data = await this.expenseModel.find(filter).skip((page - 1) * take).limit(take).lean();

    return { data, total, page, take };
  }

  async findOne(id: string) {
    return this.expenseModel.findById(id).lean();
  }

  async update(id: string, dto: Partial<CreateExpenseDto>) {
    if (dto.quantity !== undefined || dto.price !== undefined) {
      const expense = await this.expenseModel.findById(id);
      if (!expense) return null;
      const quantity = dto.quantity ?? expense.quantity;
      const price = dto.price ?? expense.price;
      const totalPrice = quantity * price;
      const updated = await this.expenseModel.findByIdAndUpdate(id, { ...dto, totalPrice }, { new: true }).lean();
      return updated;
    }
    return this.expenseModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async delete(id: string) {
    const res = await this.expenseModel.findByIdAndDelete(id);
    return !!res;
  }

  async getStatistics(userId?: string) {
    const matchStage = userId ? { user: userId } : {};

    const statistics = await this.expenseModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$totalPrice' },
          itemCount: { $sum: 1 },
          expenses: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalAmount: 1,
          itemCount: 1,
          expenses: 1,
          _id: 0
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    return statistics;
  }

  async getTopSpenders(limit: number = 10) {
    const topSpenders = await this.expenseModel.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          expenseCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email'
          },
          totalSpent: 1,
          expenseCount: 1,
          _id: 0
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit }
    ]);

    return topSpenders;
  }
}
