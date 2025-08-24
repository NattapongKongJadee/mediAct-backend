<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Relation in Database
<img width="712" height="736" alt="mediActAssingment drawio" src="https://github.com/user-attachments/assets/2f841c86-2d35-4054-b422-7b5793c08273" />

## Description (database)
คำอธิบายแบบย่อ
1) User
	-	เก็บข้อมูลผู้ใช้: nurse และ head_nurse
	-	ฟิลด์สำคัญ: email (unique), role
	-	ความสัมพันธ์:
	-	createdShifts: เวรที่หัวหน้าพยาบาลสร้าง
	-	assignments: เวรที่พยาบาลถูกจัด
	-	approvedLeaves: ใบลาที่หัวหน้าอนุมัติ/ปฏิเสธ

2) Shift
	-	กำหนด “ช่วงเวร”: date (วันของเวร), startTime, endTime
	-	สร้างโดย createdById (FK → User.id, ต้องเป็นหัวหน้า)
	-	Constraint สำคัญ: @@unique([date, startTime, endTime]) กันสร้างเวรซ้ำวันเวลาเดียวกัน
	-	ความสัมพันธ์: มีหลาย ShiftAssignment

3) ShiftAssignment
	-	การ “จัดเวร” ให้พยาบาล 1 คนกับเวร 1 กะ
	-	Unique: @@unique([userId, shiftId]) กันจัดซ้ำคนเดิมในเวรเดียวกัน
	-	Soft status:
	-	isActive: แสดงว่าแถวนี้ยังมีผลอยู่ไหม (ช่วยทำให้ “อนุมัติลาแล้วเวรว่าง” โดยไม่ต้องลบแถว)
	-	revokedAt: เวลาที่แถวถูกยกเลิก (เช่น หลังใบลา approved)
	-	ความสัมพันธ์: มีหลาย LeaveRequest (พยาบาลยื่นหลายครั้งได้ แต่พิจารณาจากใบล่าสุด)

4) LeaveRequest
	-	ใบขอลาจากพยาบาล (ผูกกับ ShiftAssignment)
	-	สถานะ: pending | approved | rejected
	-	approvedById: ผู้อนุมัติ (หัวหน้าพยาบาล), optional (ตอน pending ยังว่าง)
	-	การลอจิกที่พบบ่อย:
	-	เมื่อ approved → ไปอัปเดต ShiftAssignment.isActive = false เพื่อทำให้เวรนั้น “ว่าง” และสามารถ assign ใหม่ได้


## Project setup

```bash
$ npm install
```
## 🧪 การทดสอบระบบด้วย Swagger & Docker Compose

### 🚀 การใช้ Swagger ทดสอบ API
โปรเจคนี้ได้ติดตั้ง **Swagger UI** เพื่อช่วยทดสอบ API ได้ง่าย ๆ ผ่านหน้าเว็บ  
- เปิดได้ที่: [http://localhost:3000/api](http://localhost:3000/api)  
- Swagger จะแสดงทุก endpoint เช่น
  - `POST /auth/register` — สมัครผู้ใช้ใหม่
  - `POST /auth/login` — เข้าสู่ระบบและรับ JWT token
  - `POST /shifts` — (หัวหน้า) สร้างเวร
  - `POST /shift-assignments` — (หัวหน้า) จัดเวรให้พยาบาล
  - `GET /my-schedule` — (พยาบาล) ดูเวรของตัวเอง
  - `POST /leave-requests` — (พยาบาล) ขออนุมัติลา
  - `PATCH /leave-requests/:id/approve` — (หัวหน้า) อนุมัติ/ปฏิเสธคำขอลา

⚠️ **Protected Routes**  
- API บางตัวถูกป้องกันด้วย **JWT Auth**  
- ต้องทำการ `POST /auth/login` ก่อน เพื่อรับ `access_token`  
- จากนั้นกดปุ่ม 🔓 Authorize ใน Swagger แล้วใส่ค่าเป็น:  


---

### 🐳 การใช้ Docker Compose ทดสอบฐานข้อมูล
โปรเจคนี้มีไฟล์ `docker-compose.yml` สำหรับรัน **PostgreSQL** และ **pgAdmin** เพื่อทดสอบฐานข้อมูล

คำสั่งหลัก:
```bash
# รันฐานข้อมูลและ pgAdmin
docker compose up -d

# ดู container ที่กำลังรัน
docker compose ps

# หยุดและลบ container
docker compose down



## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



