import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import type { Expense } from './expense.interface';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto): Expense;
    findAll(): Expense[];
    findOne(id: string): Expense | undefined;
}
