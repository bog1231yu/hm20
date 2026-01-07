import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<import("../users/schemas/user.schema").UserDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    login(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
}
