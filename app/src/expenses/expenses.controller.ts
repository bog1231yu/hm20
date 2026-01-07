import { Controller, Get, Post, Param, Body, Query, ValidationPipe, Put, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.ADMIN)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body(ValidationPipe) createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create({ ...createExpenseDto, userId: req.user.userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query(ValidationPipe) query: QueryExpensesDto, @Request() req) {
    if (req.user.role === UserRole.ADMIN) {
      return this.expensesService.findAll(query);
    }
    return this.expensesService.findAll({ ...query, userId: req.user.userId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const expense = await this.expensesService.findOne(id);
    if (!expense) return null;
    
    if (req.user.role === UserRole.ADMIN || expense.user.toString() === req.user.userId) {
      return expense;
    }
    throw new ForbiddenException('Access denied');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: CreateExpenseDto, @Request() req) {
    const expense = await this.expensesService.findOne(id);
    if (!expense) return null;
    
    if (req.user.role !== UserRole.ADMIN && expense.user.toString() !== req.user.userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.expensesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async delete(@Param('id') id: string, @Request() req) {
    const expense = await this.expensesService.findOne(id);
    if (!expense) return { success: false };
    
    if (req.user.role !== UserRole.ADMIN && expense.user.toString() !== req.user.userId) {
      throw new ForbiddenException('Access denied');
    }
    const success = await this.expensesService.delete(id);
    return { success };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get expense statistics grouped by category' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStatistics(@Request() req) {
    if (req.user.role === UserRole.ADMIN) {
      return this.expensesService.getStatistics();
    }
    return this.expensesService.getStatistics(req.user.userId);
  }

  @Get('top-spenders')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get top spenders (Admin only)' })
  @ApiResponse({ status: 200, description: 'Top spenders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of top spenders to return' })
  async getTopSpenders(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.expensesService.getTopSpenders(limitNum);
  }
}
