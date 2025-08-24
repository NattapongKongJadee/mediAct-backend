// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('nurse' | 'head_nurse')[]) =>
  SetMetadata(ROLES_KEY, roles);
