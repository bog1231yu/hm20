"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
let ExpensesService = class ExpensesService {
    expenses = [];
    nextId = 1;
    create(createExpenseDto) {
        const totalPrice = createExpenseDto.quantity * createExpenseDto.price;
        const expense = {
            id: this.nextId++,
            ...createExpenseDto,
            totalPrice,
        };
        this.expenses.push(expense);
        return expense;
    }
    findAll() {
        return this.expenses;
    }
    findOne(id) {
        return this.expenses.find(expense => expense.id === id);
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)()
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map