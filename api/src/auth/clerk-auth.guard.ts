import { createClerkClient } from '@clerk/backend';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const requestState = await this.clerk.authenticateRequest(request);

      if (requestState.status !== 'signed-in') {
        throw new UnauthorizedException('User is not signed in');
      }

      request.auth = requestState.toAuth();
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message || 'Invalid Clerk token');
    }
  }
}
