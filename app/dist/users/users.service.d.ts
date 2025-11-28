import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
export declare class UsersService {
    private users;
    private nextId;
    create(createUserDto: CreateUserDto): User;
    findAll(query: QueryUsersDto): {
        data: User[];
        total: number;
        page: number;
        take: number;
    };
    findOne(id: number): User | undefined;
    update(id: number, updateUserDto: UpdateUserDto): User | undefined;
    delete(id: number): boolean;
}
