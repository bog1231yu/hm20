import { Expense } from './expense.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
export declare class ExpensesService {
    private expenses;
    private nextId;
    create(createExpenseDto: CreateExpenseDto): Expense;
    findAll(query: QueryExpensesDto): {
        data: Expense[];
        total: number;
        page: number;
        take: number;
    };
    findOne(id: number): Expense | undefined;
}
