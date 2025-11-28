import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import type { Expense } from './expense.interface';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  // CREATE
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto): Expense {
    return this.expensesService.create(createExpenseDto);
  }

  // READ ALL
  @Get()
  findAll(): Expense[] {
    return this.expensesService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string): Expense | undefined {
    return this.expensesService.findOne(parseInt(id, 10));
  }
}
