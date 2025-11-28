import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId: number = 1;

  // CREATE
  create(createUserDto: CreateUserDto): User {
    const user: User = {
      id: this.nextId++,
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  // READ ALL with pagination and filtering
  findAll(query: QueryUsersDto): { data: User[]; total: number; page: number; take: number } {
    let filtered = this.users;

    // Apply gender filter
    if (query.gender) {
      filtered = filtered.filter(user => user.gender === query.gender);
    }

    // Apply email filter (startsWith)
    if (query.email) {
      filtered = filtered.filter(user => user.email.toLowerCase().startsWith(query.email!.toLowerCase()));
    }

    const total = filtered.length;
    const page = query.page || 1;
    const take = query.take || 30;

    // Apply pagination
    const skip = (page - 1) * take;
    const data = filtered.slice(skip, skip + take);

    return { data, total, page, take };
  }

  // READ ONE
  findOne(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // UPDATE
  update(id: number, updateUserDto: UpdateUserDto): User | undefined {
    const user = this.findOne(id);
    if (user) {
      Object.assign(user, updateUserDto);
    }
    return user;
  }

  // DELETE
  delete(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
