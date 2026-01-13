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
import { ProductsService } from './products.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  // user and admin can fetch all product
  @Get()
  findAllProduct() {
    return this.productService.findAll();
  }

  // user and admin can fetch every single product
  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // Admin only - create product
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createDto(dto);
  }

  // Admin only - update product
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  // Admin only - delete product
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
