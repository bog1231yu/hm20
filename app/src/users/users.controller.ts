import { Controller, Get, Post, Put, Delete, Param, Body, Query, ValidationPipe, UseGuards, Request, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './schemas/user.schema';
import type { User } from './user.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto, @Request() req): Promise<any> {
    if (createUserDto.role && (!req.user || req.user.role !== UserRole.ADMIN)) {
      createUserDto.role = UserRole.USER;
    }
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(@Query(ValidationPipe) query: QueryUsersDto): Promise<any> {
    return this.usersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<any> {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<any> {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException('You can only update your own data');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string, @Request() req): Promise<{ success: boolean }> {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException('You can only delete your own data');
    }
    const success = await this.usersService.delete(id);
    return { success };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('upgrade-subscription')
  @ApiOperation({ summary: 'Upgrade user subscription to premium' })
  @ApiResponse({ status: 200, description: 'Subscription upgraded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async upgradeSubscription(@Body(ValidationPipe) body: UpgradeSubscriptionDto): Promise<any>{
    const user = await this.usersService.upgradeSubscription(body.email);
    if (!user) return { success: false };
    return { success: true, user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('statistics')
  @ApiOperation({ summary: 'Get user gender statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getGenderStatistics() {
    return this.usersService.getGenderStatistics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Post(':id/profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile photo for a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile photo file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg, png, etc.)'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Profile photo uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ): Promise<{ photoUrl: string }> {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException('You can only upload photos for your own profile');
    }

    if (!file) {
      throw new ForbiddenException('No file provided');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new ForbiddenException('Only image files are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new ForbiddenException('File size must be less than 5MB');
    }

    const photoUrl = await this.usersService.uploadProfilePhoto(id, file);
    return { photoUrl };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Delete(':id/profile-photo')
  @ApiOperation({ summary: 'Delete profile photo for a user' })
  @ApiResponse({ status: 200, description: 'Profile photo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteProfilePhoto(
    @Param('id') id: string,
    @Request() req
  ): Promise<{ success: boolean }> {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException('You can only delete your own profile photo');
    }

    const success = await this.usersService.deleteProfilePhoto(id);
    return { success };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/subscription')
  @ApiOperation({ summary: 'Upgrade user subscription (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription upgraded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async upgradeSubscription(
    @Param('id') id: string,
    @Body(ValidationPipe) upgradeSubscriptionDto: UpgradeSubscriptionDto,
    @Request() req
  ): Promise<any> {
    return this.usersService.upgradeSubscription(id, upgradeSubscriptionDto);
  }
}
