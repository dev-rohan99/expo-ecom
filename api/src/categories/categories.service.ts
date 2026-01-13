import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    const exists = this.prisma.category.findUnique({ where: { name } });
    if (exists) {
      throw new BadRequestException('Category already exists');
    }
    return this.prisma.category.create({ data: { name } });
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, name: string) {
    return this.prisma.category.update({ where: { id }, data: { name } });
  }

  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
