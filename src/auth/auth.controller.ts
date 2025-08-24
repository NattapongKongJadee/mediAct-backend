// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'สมัครผู้ใช้ใหม่ + กำหนด role' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.svc.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบและรับ JWT' })
  @ApiResponse({ status: 201, description: 'Returns { access_token }' })
  @ApiConsumes('application/x-www-form-urlencoded') // 👈 ทำให้เป็นฟอร์ม
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.svc.login(dto);
  }
}
