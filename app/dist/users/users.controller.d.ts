import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: any): Promise<any>;
    findAll(query: QueryUsersDto): Promise<any>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<any>;
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
    getGenderStatistics(): Promise<any[]>;
    uploadProfilePhoto(id: string, file: Express.Multer.File, req: any): Promise<{
        photoUrl: string;
    }>;
    deleteProfilePhoto(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
