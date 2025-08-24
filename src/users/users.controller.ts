import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

class ListUsersQueryDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // 'nurse' | 'head_nurse' มี 2 role ในระบบ
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@Query() q: ListUsersQueryDto) {
    return this.usersService.list(q.role);
  }
}
