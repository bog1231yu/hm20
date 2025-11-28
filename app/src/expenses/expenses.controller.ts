import { Controller, Get, Post, Param, Body, Query, ValidationPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import type { Expense } from './expense.interface';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  // CREATE
  @Post()
  create(@Body(ValidationPipe) createExpenseDto: CreateExpenseDto): Expense {
    return this.expensesService.create(createExpenseDto);
  }

  // READ ALL with pagination and filtering
  @Get()
  findAll(@Query(ValidationPipe) query: QueryExpensesDto): { data: Expense[]; total: number; page: number; take: number } {
    return this.expensesService.findAll(query);
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string): Expense | undefined {
    return this.expensesService.findOne(parseInt(id, 10));
  }
}
