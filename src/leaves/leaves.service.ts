// src/leaves/leaves.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}
  async request(
    currentUserId: number,
    shiftAssignmentId: number,
    reason?: string,
  ) {
    // ตรวจว่า assignment มีจริงและเป็นของ user นี้
    const assignment = await this.prisma.shiftAssignment.findUnique({
      where: { id: shiftAssignmentId },
      include: { user: true, shift: true },
    });
    if (!assignment)
      return { success: false, message: 'ไม่พบการจัดเวรที่ระบุ' };
    if (assignment.userId !== currentUserId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ขอลาในเวรนี้');
    }

    // กันการยื่นซ้ำ (pending อยู่ หรือเพิ่งอนุมัติแล้ว)
    const existed = await this.prisma.leaveRequest.findFirst({
      where: { shiftAssignmentId, status: { in: ['pending', 'approved'] } },
    });
    if (existed) {
      return { success: false, message: 'มีคำขอลาสำหรับเวรนี้อยู่แล้ว' };
    }

    const created = await this.prisma.leaveRequest.create({
      data: { shiftAssignmentId, reason },
      include: {
        assignment: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
            shift: {
              select: { id: true, date: true, startTime: true, endTime: true },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: {
        id: created.id,
        status: created.status,
        reason: created.reason ?? null,
        nurse: created.assignment.user,
        shift: {
          id: created.assignment.shift.id,
          date: dayjs(created.assignment.shift.date).format('DD-MM-YYYY'),
          startTime: dayjs(created.assignment.shift.startTime).format(
            'DD-MM-YYYY : HH:mm:ss',
          ),
          endTime: dayjs(created.assignment.shift.endTime).format(
            'DD-MM-YYYY : HH:mm:ss',
          ),
        },
        createdAt: dayjs(created.createdAt).format('DD-MM-YYYY : HH:mm:ss'),
      },
    };
  }

  // leaves.service.ts
  async listAll() {
    const rows = await this.prisma.leaveRequest.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        assignment: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            shift: {
              select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                createdBy: { select: { id: true, name: true } },
              },
            },
          },
        },
        approvedBy: { select: { id: true, name: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      status: r.status, // 'pending' | 'approved' | 'rejected'
      reason: r.reason ?? null,
      nurse: r.assignment.user, // { id, name, email }

      // ✅ แบนฟิลด์ shift ให้อ่านง่าย และเป็น ISO ทั้งหมด
      shiftId: r.assignment.shift.id,
      date: r.assignment.shift.date, // ISO
      startTime: r.assignment.shift.startTime, // ISO
      endTime: r.assignment.shift.endTime, // ISO
      headNurse: r.assignment.shift.createdBy, // { id, name }

      approvedBy: r.approvedBy ?? null, // { id, name } | null
      createdAt: r.createdAt, // ISO
      updatedAt: r.updatedAt, // ISO
    }));
  }
  // leaves.service.ts
  async decide(
    leaveId: number,
    approver: { userId: number; role: 'head_nurse' | 'nurse' },
    status: 'approved' | 'rejected',
  ) {
    if (approver.role !== 'head_nurse') {
      throw new ForbiddenException('เฉพาะหัวหน้าพยาบาลเท่านั้น');
    }

    await this.prisma.$transaction(async (tx) => {
      // 1) อัปเดตใบลา
      const leave = await tx.leaveRequest.update({
        where: { id: leaveId },
        data: { status, approvedById: approver.userId },
        include: { assignment: { select: { id: true } } },
      });

      if (status === 'approved') {
        await tx.shiftAssignment.update({
          where: { id: leave.assignment.id }, // ✅ ถูกต้อง
          data: { isActive: false, revokedAt: new Date() },
        });
      }
    });

    return { success: true };
  }
}
