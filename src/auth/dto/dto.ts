/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(6) password: string;
  @ApiProperty({ enum: ['nurse', 'head_nurse'], required: false })
  @IsEnum(['nurse', 'head_nurse'] as any)
  @IsOptional()
  role?: 'nurse' | 'head_nurse';
}

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() password: string;
}
