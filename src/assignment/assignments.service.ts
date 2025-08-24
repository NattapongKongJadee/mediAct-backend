// src/assignments/assignments.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async assign(userId: number, shiftId: number) {
    // 1) ตรวจ user/shift มีจริง
    const [user, shift] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.shift.findUnique({ where: { id: shiftId } }),
    ]);
    if (!user) throw new BadRequestException('ไม่พบผู้ใช้ (userId) นี้');
    if (!shift) throw new BadRequestException('ไม่พบเวร (shiftId) นี้');

    const result = await this.prisma.$transaction(async (tx) => {
      // 2) ปิด assignment ที่ยัง active ของเวรนี้ (ถ้ามี)
      await tx.shiftAssignment.updateMany({
        where: { shiftId, isActive: true },
        data: { isActive: false, revokedAt: new Date() },
      });

      // 3) ถ้ามี record (userId, shiftId) อยู่แล้ว → reactivate
      const existing = await tx.shiftAssignment.findUnique({
        where: { userId_shiftId: { userId, shiftId } },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          shift: {
            select: { id: true, date: true, startTime: true, endTime: true },
          },
        },
      });

      if (existing) {
        // ถ้าเคยมี (inactive) → เปิดใช้งานใหม่
        if (!existing.isActive) {
          const updated = await tx.shiftAssignment.update({
            where: { userId_shiftId: { userId, shiftId } },
            data: { isActive: true, revokedAt: null },
            include: {
              user: {
                select: { id: true, name: true, email: true, role: true },
              },
              shift: {
                select: {
                  id: true,
                  date: true,
                  startTime: true,
                  endTime: true,
                },
              },
            },
          });
          return updated;
        }
        // ปกติจะไม่เข้าเคสนี้เพราะบรรทัดบนปิด active ไปแล้ว
        throw new ConflictException('เวรนี้มีพยาบาลแล้ว');
      }

      // 4) ไม่เคยมีคู่ (userId, shiftId) → สร้างใหม่
      const created = await tx.shiftAssignment.create({
        data: { userId, shiftId, isActive: true },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          shift: {
            select: { id: true, date: true, startTime: true, endTime: true },
          },
        },
      });

      return created;
    });

    return {
      success: true,
      data: {
        id: result.id,
        user: result.user,
        shift: {
          id: result.shift.id,
          date: result.shift.date,
          startTime: result.shift.startTime,
          endTime: result.shift.endTime,
        },
      },
    };
  }

  async mySchedule(currentUserId: number) {
    const rows = await this.prisma.shiftAssignment.findMany({
      where: { userId: currentUserId },
      orderBy: [{ shift: { date: 'asc' } }, { shift: { startTime: 'asc' } }],
      include: {
        // ✅ ดึง shift ปกติ (ไม่มี leaves อยู่ในนี้)
        shift: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            createdBy: { select: { id: true, name: true } },
          },
        },
        // ✅ ดึง leaves จากฝั่ง assignment นี้ (ล่าสุด 1 รายการ)
        leaves: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, status: true, createdAt: true },
        },
      },
    });

    return rows.map((a) => {
      const latest = a.leaves[0] ?? null; // อาจไม่มี
      const leaveStatus = latest?.status ?? null; // 'pending' | 'approved' | 'rejected' | null

      return {
        assignmentId: a.id,
        shiftId: a.shift.id,
        date: dayjs(a.shift.date).format('DD-MM-YYYY'),
        startTime: dayjs(a.shift.startTime).format('DD-MM-YYYY : HH:mm:ss'),
        endTime: dayjs(a.shift.endTime).format('DD-MM-YYYY : HH:mm:ss'),
        headNurse: a.shift.createdBy, // ผู้สร้างเวร
        // เพิ่มสถานะคำขอลา
        leaveRequestId: latest?.id ?? null,
        leaveStatus, // null | 'pending' | 'approved' | 'rejected'
      };
    });
  }
}
