import { Controller, Get, Post, Body, Headers, ValidationPipe, UseGuards, Request, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiHeader({ name: 'email', description: 'Optional email header to filter products', required: false })
  async findAll(@Headers('email') email?: string) {
    return this.productsService.findAll(email);
  }

  @Roles(UserRole.ADMIN)
  @Post(':id/photos')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload photos for a product (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product photo files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'Image files (jpg, png, etc.)'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Product photos uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async uploadProductPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<{ photoUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Each file size must be less than 5MB');
      }
    }

    const photoUrls = await this.productsService.uploadProductPhotos(id, files);
    return { photoUrls };
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id/photos')
  @ApiOperation({ summary: 'Delete a specific photo from a product (Admin only)' })
  @ApiParam({ name: 'photoUrl', description: 'URL of the photo to delete', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product photo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product or photo not found' })
  async deleteProductPhoto(
    @Param('id') id: string,
    @Body('photoUrl') photoUrl: string
  ): Promise<{ success: boolean }> {
    if (!photoUrl) {
      throw new Error('Photo URL is required');
    }

    const success = await this.productsService.deleteProductPhoto(id, photoUrl);
    return { success };
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id/photos/all')
  @ApiOperation({ summary: 'Delete all photos from a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'All product photos deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteAllProductPhotos(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.productsService.deleteAllProductPhotos(id);
    return { success };
  }
}
