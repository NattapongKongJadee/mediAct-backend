/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/shifts/dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: '2025-08-21T00:00:00.000Z' })
  @IsISO8601()
  date: string;
  @ApiProperty({ example: '2025-08-21T01:00:00.000Z' })
  @IsISO8601()
  startTime: string;
  @ApiProperty({ example: '2025-08-21T09:00:00.000Z' })
  @IsISO8601()
  endTime: string;
}
