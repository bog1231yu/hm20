import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpenseSchema } from './schemas/expense.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
