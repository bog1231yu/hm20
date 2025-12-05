import { Controller, Get, Post, Put, Delete, Param, Body, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import type { User } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // CREATE
  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  // READ ALL with pagination and filtering
  @Get()
  async findAll(@Query(ValidationPipe) query: QueryUsersDto): Promise<any> {
    return this.usersService.findAll(query);
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.usersService.delete(id);
    return { success };
  }

  // UPGRADE SUBSCRIPTION
  @Post('upgrade-subscription')
  async upgradeSubscription(@Body(ValidationPipe) body: UpgradeSubscriptionDto): Promise<any>{
    const user = await this.usersService.upgradeSubscription(body.email);
    if (!user) return { success: false };
    return { success: true, user };
  }
}
