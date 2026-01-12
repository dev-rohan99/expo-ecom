import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.auth;
    if (!auth?.userId) {
      throw new ForbiddenException('Not authenticated!');
    }

    const user = await this.prisma.user.findUnique({
      where: { clerkId: auth.userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access only!');
    }

    return true;
  }
}
