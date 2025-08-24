// src/leaves/leaves.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LeavesService } from './leaves.service';
import { ApproveLeaveDto, CreateLeaveDto } from './dto';

@ApiTags('leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave-requests')
export class LeavesController {
  constructor(private readonly svc: LeavesService) {}

  // (พยาบาล) ขออนุมัติลา
  @Post()
  @Roles('nurse', 'head_nurse')
  @ApiOperation({ summary: '(พยาบาล) ขออนุมัติลา' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateLeaveDto })
  request(@Req() req: any, @Body() dto: CreateLeaveDto) {
    return this.svc.request(
      Number(req.user.userId),
      Number(dto.shiftAssignmentId),
      dto.reason,
    );
  }
  @Get()
  @Roles('head_nurse')
  @ApiOperation({ summary: '(หัวหน้า) ดูคำขอลาทั้งหมด' })
  list() {
    return this.svc.listAll();
  }
  // (หัวหน้า) อนุมัติ/ปฏิเสธ
  @Patch(':id/approve')
  @Roles('head_nurse')
  @ApiOperation({ summary: 'อนุมัติ/ปฏิเสธคำขอลา' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: ApproveLeaveDto })
  decide(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ApproveLeaveDto,
  ) {
    return this.svc.decide(
      Number(id),
      { userId: Number(req.user.userId), role: req.user.role },
      dto.status,
    );
  }
}
