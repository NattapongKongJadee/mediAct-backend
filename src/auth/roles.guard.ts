// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<(string | undefined)[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    ) as ('nurse' | 'head_nurse')[] | undefined;
    if (!required || required.length === 0) return true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = req.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user && required.includes(user.role);
  }
}
