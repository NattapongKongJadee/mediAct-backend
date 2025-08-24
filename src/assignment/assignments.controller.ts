// src/assignments/assignments.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { AssignDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class AssignmentsController {
  constructor(private readonly svc: AssignmentsService) {}

  @Post('shift-assignments')
  @Roles('head_nurse')
  @ApiOperation({ summary: '(หัวหน้า) จัดเวรให้พยาบาล' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: AssignDto })
  assign(@Body() dto: AssignDto) {
    return this.svc.assign(dto.userId, dto.shiftId);
  }

  @Get('my-schedule')
  @ApiOperation({ summary: '(พยาบาล) ดูเวรตัวเอง' })
  mySchedule(@Req() req: any) {
    return this.svc.mySchedule(Number(req.user.userId));
  }
}
