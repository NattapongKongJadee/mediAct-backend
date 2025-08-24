// src/shifts/shifts.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}
  async create(
    dto: { date: string; startTime: string; endTime: string },
    createdById: number,
  ) {
    // ใช้ Date ล้วน ๆ
    const date = new Date(dto.date);
    const startTime = new Date(dto.startTime);
    let endTime = new Date(dto.endTime);

    // ตรวจรูปแบบ (Date invalid จะให้ NaN)
    if ([date, startTime, endTime].some((d) => isNaN(d.getTime()))) {
      throw new BadRequestException('รูปแบบวัน/เวลาไม่ถูกต้อง');
    }

    // รองรับกะข้ามเที่ยงคืน: ถ้า end <= start ให้บวก 24 ชั่วโมงให้ end
    if (endTime.getTime() <= startTime.getTime()) {
      endTime = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
    }

    try {
      const shift = await this.prisma.shift.create({
        data: {
          date, // จะเก็บตามที่รับมา
          startTime,
          endTime,
          createdBy: { connect: { id: createdById } },
        },
        include: { createdBy: { select: { id: true, name: true } } },
      });

      // ตอบกลับแบบอ่านง่าย (format ด้วย dayjs ได้)
      return {
        success: true,
        data: {
          id: shift.id,
          createdBy: shift.createdBy,
          iso: {
            date: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
          },
          label: {
            date: dayjs(shift.date).format('DD-MM-YYYY'),
            start: dayjs(shift.startTime).format('HH:mm:ss'),
            end: dayjs(shift.endTime).format('HH:mm:ss'),
          },
        },
      };
    } catch (e: any) {
      if (e?.code === 'P2002') {
        return { success: false, message: 'เวรนี้ถูกสร้างไปแล้ว' };
      }
      throw e;
    }
  }

  // shifts.service.ts
  // shifts.service.ts
  async list() {
    const shifts = await this.prisma.shift.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        createdBy: { select: { id: true, name: true } },
        assignments: {
          where: { isActive: true }, // 👈 นับเฉพาะ active
          include: {
            user: { select: { id: true, name: true, email: true } },
            leaves: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { status: true },
            },
          },
        },
      },
    });

    return shifts.map((s) => {
      // จะมี 0 หรือ 1 แถว (ตามนโยบาย 1 เวร = 1 active)
      const a = s.assignments[0] ?? null;
      const assignedNurse = a?.user ?? null;

      return {
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        createdBy: s.createdBy,
        assignmentsCount: assignedNurse ? 1 : 0,
        assignedNurse,
        canAssign: !assignedNurse,
      };
    });
  }
}
