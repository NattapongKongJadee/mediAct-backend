/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/leaves/dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateLeaveDto {
  @ApiProperty({
    example: 1,
    description: 'รหัสการจัดเวร (ShiftAssignment.id) ที่ต้องการลา',
  })
  @Type(() => Number)
  @IsInt()
  shiftAssignmentId: number;

  @ApiProperty({ required: false, example: 'ป่วยเป็นไข้' })
  @IsOptional()
  reason?: string;
}

export class ApproveLeaveDto {
  @ApiProperty({ enum: ['approved', 'rejected'], example: 'approved' })
  @IsEnum(['approved', 'rejected'] as const)
  status!: 'approved' | 'rejected';
}
