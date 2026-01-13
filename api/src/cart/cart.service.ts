import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cart.findMany();
  }

  async findOne(id: string) {
    return this.prisma.cart.findUnique({ where: { id } });
  }
}
