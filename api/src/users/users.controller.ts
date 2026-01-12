import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(ClerkAuthGuard)
  @Get('me')
  async me(@Req() req) {
    const clerkUserId = req.auth.userId;
    // const email = (sessionClaims?.email as string) || '';
    // const name = (sessionClaims?.full_name as string) || '';

    const user = await this.usersService.findOrCreateUser(clerkUserId);
    return user;
  }
}
