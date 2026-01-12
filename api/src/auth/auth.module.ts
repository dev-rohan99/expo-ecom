import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [UsersService, PrismaService],
})
export class AuthModule {}
