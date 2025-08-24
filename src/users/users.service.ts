import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import type { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async list(role?: UserRole) {
    const where: Prisma.UserWhereInput = role ? { role } : {};
    return this.prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true },
    });
  }
}
