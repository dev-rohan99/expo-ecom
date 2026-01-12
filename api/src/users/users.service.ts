import { createClerkClient } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  async findOrCreateUser(clerkId) {
    let user = await this.prisma.user.findUnique({ where: { clerkId } });

    if (user) {
      return user;
    }

    const clerkUser = await this.clerk.users.getUser(clerkId);
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      null;
    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? null;

    if (!user) {
      user = await this.prisma.user.create({
        data: { clerkId, name, email, role: 'USER' },
      });

      return user;
    }
  }

  async getUserByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({ where: { clerkId } });
  }

  async promoteToAdmin(clerkId: string) {
    return this.prisma.user.update({
      where: { clerkId },
      data: { role: 'ADMIN' },
    });
  }
}
