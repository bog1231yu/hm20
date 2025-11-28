import { Expense } from './expense.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesService {
    private expenses;
    private nextId;
    create(createExpenseDto: CreateExpenseDto): Expense;
    findAll(): Expense[];
    findOne(id: number): Expense | undefined;
}
