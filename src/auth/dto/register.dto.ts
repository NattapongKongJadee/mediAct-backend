/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nurse A' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'nurse.a@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['nurse', 'head_nurse'], example: 'nurse' })
  @IsEnum(['nurse', 'head_nurse'])
  role: 'nurse' | 'head_nurse';
}
