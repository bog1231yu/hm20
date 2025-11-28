import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // CREATE
  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  // READ ALL
  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string): User | undefined {
    return this.usersService.findOne(parseInt(id, 10));
  }

  // UPDATE
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): User | undefined {
    return this.usersService.update(parseInt(id, 10), updateUserDto);
  }

  // DELETE
  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.usersService.delete(parseInt(id, 10));
    return { success };
  }
}
