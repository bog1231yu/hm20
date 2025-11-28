import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './user.interface';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): User;
    findAll(): User[];
    findOne(id: string): User | undefined;
    update(id: string, updateUserDto: UpdateUserDto): User | undefined;
    delete(id: string): {
        success: boolean;
    };
}
