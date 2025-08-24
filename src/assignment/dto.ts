/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/assignments/dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
export class AssignDto {
  @ApiProperty({ example: 2, description: 'รหัสพยาบาล (userId)' })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1, description: 'รหัสเวร (shiftId)' })
  @Type(() => Number)
  @IsInt()
  shiftId: number;
}
