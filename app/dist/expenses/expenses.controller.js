"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const expenses_service_1 = require("./expenses.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const query_expenses_dto_1 = require("./dto/query-expenses.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const swagger_1 = require("@nestjs/swagger");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    async create(createExpenseDto, req) {
        return this.expensesService.create({ ...createExpenseDto, userId: req.user.userId });
    }
    async findAll(query, req) {
        if (req.user.role === user_schema_1.UserRole.ADMIN) {
            return this.expensesService.findAll(query);
        }
        return this.expensesService.findAll({ ...query, userId: req.user.userId });
    }
    async findOne(id, req) {
        const expense = await this.expensesService.findOne(id);
        if (!expense)
            return null;
        if (req.user.role === user_schema_1.UserRole.ADMIN || expense.user.toString() === req.user.userId) {
            return expense;
        }
        throw new common_1.ForbiddenException('Access denied');
    }
    async update(id, dto, req) {
        const expense = await this.expensesService.findOne(id);
        if (!expense)
            return null;
        if (req.user.role !== user_schema_1.UserRole.ADMIN && expense.user.toString() !== req.user.userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.expensesService.update(id, dto);
    }
    async delete(id, req) {
        const expense = await this.expensesService.findOne(id);
        if (!expense)
            return { success: false };
        if (req.user.role !== user_schema_1.UserRole.ADMIN && expense.user.toString() !== req.user.userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const success = await this.expensesService.delete(id);
        return { success };
    }
    async getStatistics(req) {
        if (req.user.role === user_schema_1.UserRole.ADMIN) {
            return this.expensesService.getStatistics();
        }
        return this.expensesService.getStatistics(req.user.userId);
    }
    async getTopSpenders(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.expensesService.getTopSpenders(limitNum);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new expense' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all expenses with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expenses retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_expenses_dto_1.QueryExpensesDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an expense by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an expense by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an expense by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expense statistics grouped by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('top-spenders'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get top spenders (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top spenders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of top spenders to return' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getTopSpenders", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, swagger_1.ApiTags)('Expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('expenses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.USER, user_schema_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map