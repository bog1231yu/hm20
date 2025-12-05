import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto): Promise<import("./schemas/expense.schema").ExpenseDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(query: QueryExpensesDto): Promise<{
        data: (import("mongoose").FlattenMaps<import("./schemas/expense.schema").ExpenseDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        take: number;
    }>;
    findOne(id: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/expense.schema").ExpenseDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    update(id: string, dto: CreateExpenseDto): Promise<(import("mongoose").FlattenMaps<import("./schemas/expense.schema").ExpenseDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
