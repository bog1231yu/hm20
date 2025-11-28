import { Injectable } from '@nestjs/common';
import { Expense } from './expense.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

@Injectable()
export class ExpensesService {
  private expenses: Expense[] = [];
  private nextId: number = 1;

  // CREATE
  create(createExpenseDto: CreateExpenseDto): Expense {
    const totalPrice = createExpenseDto.quantity * createExpenseDto.price;
    const expense: Expense = {
      id: this.nextId++,
      ...createExpenseDto,
      totalPrice,
    };
    this.expenses.push(expense);
    return expense;
  }

  // READ ALL with pagination and filtering
  findAll(query: QueryExpensesDto): { data: Expense[]; total: number; page: number; take: number } {
    let filtered = this.expenses;

    // Apply category filter
    if (query.category) {
      filtered = filtered.filter(expense => expense.category === query.category);
    }

    // Apply price range filters
    if (query.priceFrom !== undefined) {
      filtered = filtered.filter(expense => expense.price >= query.priceFrom!);
    }

    if (query.priceTo !== undefined) {
      filtered = filtered.filter(expense => expense.price <= query.priceTo!);
    }

    const total = filtered.length;
    const page = query.page || 1;
    const take = query.take || 30;

    // Apply pagination
    const skip = (page - 1) * take;
    const data = filtered.slice(skip, skip + take);

    return { data, total, page, take };
  }

  // READ ONE
  findOne(id: number): Expense | undefined {
    return this.expenses.find(expense => expense.id === id);
  }
}
