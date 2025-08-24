// src/shifts/shifts.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('shifts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly svc: ShiftsService) {}

  @Post()
  @Roles('head_nurse')
  @ApiOperation({ summary: '(หัวหน้า) สร้างเวร' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateShiftDto })
  create(@Req() req: any, @Body() dto: CreateShiftDto) {
    return this.svc.create(dto, Number(req.user.userId)); // ใช้ userId จาก JWT
  }

  @Get()
  @Roles('head_nurse')
  @ApiOperation({ summary: 'ดูรายการเวรทั้งหมด' })
  list() {
    return this.svc.list();
  }
}
