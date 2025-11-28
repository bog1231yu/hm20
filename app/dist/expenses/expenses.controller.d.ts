import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import type { Expense } from './expense.interface';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto): Expense;
    findAll(query: QueryExpensesDto): {
        data: Expense[];
        total: number;
        page: number;
        take: number;
    };
    findOne(id: string): Expense | undefined;
}
