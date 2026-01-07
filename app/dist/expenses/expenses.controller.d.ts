import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, req: any): Promise<import("./schemas/expense.schema").ExpenseDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(query: QueryExpensesDto, req: any): Promise<{
        data: (import("mongoose").FlattenMaps<import("./schemas/expense.schema").ExpenseDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        take: number;
    }>;
    findOne(id: string, req: any): Promise<(import("mongoose").FlattenMaps<import("./schemas/expense.schema").ExpenseDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    update(id: string, dto: CreateExpenseDto, req: any): Promise<(import("mongoose").FlattenMaps<import("./schemas/expense.schema").ExpenseDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
    getStatistics(req: any): Promise<any[]>;
    getTopSpenders(limit?: string): Promise<any[]>;
}
