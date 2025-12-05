import { Model } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import type { ExpenseDocument } from './schemas/expense.schema';
import { UsersService } from '../users/users.service';
export declare class ExpensesService {
    private expenseModel;
    private usersService;
    constructor(expenseModel: Model<ExpenseDocument>, usersService: UsersService);
    create(createExpenseDto: CreateExpenseDto): Promise<ExpenseDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(query: QueryExpensesDto): Promise<{
        data: (import("mongoose").FlattenMaps<ExpenseDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        take: number;
    }>;
    findOne(id: string): Promise<(import("mongoose").FlattenMaps<ExpenseDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    update(id: string, dto: Partial<CreateExpenseDto>): Promise<(import("mongoose").FlattenMaps<ExpenseDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<boolean>;
}
