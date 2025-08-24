/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'head@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @IsNotEmpty()
  password: string;
}
