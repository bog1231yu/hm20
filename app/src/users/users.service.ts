import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // READ ALL
  findAll(): User[] {
    return this.users;
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
