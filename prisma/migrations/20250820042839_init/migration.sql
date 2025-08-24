-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('nurse', 'head_nurse');

-- CreateEnum
CREATE TYPE "public"."LeaveStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'nurse',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shift" (
    "id" BIGSERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShiftAssignment" (
    "id" BIGSERIAL NOT NULL,
    "userId" INT NOT NULL,
    "shiftId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeaveRequest" (
    "id" BIGSERIAL NOT NULL,
    "shiftAssignmentId" INT NOT NULL,
    "reason" TEXT,
    "status" "public"."LeaveStatus" NOT NULL DEFAULT 'pending',
    "approvedById" INT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shift_date_startTime_endTime_key" ON "public"."Shift"("date", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "ShiftAssignment_userId_idx" ON "public"."ShiftAssignment"("userId");

-- CreateIndex
CREATE INDEX "ShiftAssignment_shiftId_idx" ON "public"."ShiftAssignment"("shiftId");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftAssignment_userId_shiftId_key" ON "public"."ShiftAssignment"("userId", "shiftId");

-- CreateIndex
CREATE INDEX "LeaveRequest_shiftAssignmentId_idx" ON "public"."LeaveRequest"("shiftAssignmentId");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "public"."LeaveRequest"("status");

-- AddForeignKey
ALTER TABLE "public"."ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "public"."Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_shiftAssignmentId_fkey" FOREIGN KEY ("shiftAssignmentId") REFERENCES "public"."ShiftAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
