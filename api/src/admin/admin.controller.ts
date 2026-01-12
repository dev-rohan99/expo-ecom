import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Controller('admin')
@UseGuards(ClerkAuthGuard, AdminGuard)
export class AdminController {
  @Get('dashboard')
  getDashboard() {
    return {
      message: 'Welcome Admin!',
    };
  }
}
