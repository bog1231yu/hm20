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

  // CREATE
  async create(createExpenseDto: CreateExpenseDto) {
    // verify user exists
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

  // READ ALL with pagination and filtering
  async findAll(query: QueryExpensesDto) {
    const filter: any = {};
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

  // READ ONE
  async findOne(id: string) {
    return this.expenseModel.findById(id).lean();
  }

  async update(id: string, dto: Partial<CreateExpenseDto>) {
    if (dto.userId) {
      const user = await this.usersService.findOne(dto.userId);
      if (!user) throw new NotFoundException('User not found');
    }
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
}
