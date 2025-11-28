import { Injectable } from '@nestjs/common';
import { Expense } from './expense.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';

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

  // READ ALL
  findAll(): Expense[] {
    return this.expenses;
  }

  // READ ONE
  findOne(id: number): Expense | undefined {
    return this.expenses.find(expense => expense.id === id);
  }
}
