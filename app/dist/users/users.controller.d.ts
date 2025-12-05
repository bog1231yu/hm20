import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(query: QueryUsersDto): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    upgradeSubscription(body: UpgradeSubscriptionDto): Promise<any>;
}
