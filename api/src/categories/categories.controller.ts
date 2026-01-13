import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // public mobile app or frontend client
  @Get()
  findAllCategory() {
    return this.categoriesService.findAll();
  }

  // Admin only - create category
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Post()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto.name);
  }

  // Admin only - update category
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Patch(':id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto.name);
  }

  // Admin only - delete category
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Delete(':id')
  removeCategory(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
