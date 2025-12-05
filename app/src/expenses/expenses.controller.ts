import { Controller, Get, Post, Param, Body, Query, ValidationPipe, Put, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  // CREATE
  @Post()
  async create(@Body(ValidationPipe) createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  // READ ALL with pagination and filtering
  @Get()
  async findAll(@Query(ValidationPipe) query: QueryExpensesDto) {
    return this.expensesService.findAll(query);
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: CreateExpenseDto) {
    return this.expensesService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.expensesService.delete(id);
    return { success };
  }
}
