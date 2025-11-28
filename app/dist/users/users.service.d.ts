import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private users;
    private nextId;
    create(createUserDto: CreateUserDto): User;
    findAll(): User[];
    findOne(id: number): User | undefined;
    update(id: number, updateUserDto: UpdateUserDto): User | undefined;
    delete(id: number): boolean;
}
