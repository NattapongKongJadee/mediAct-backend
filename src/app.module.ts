import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ShiftsModule } from './shift/shifts.module';
import { AssignmentsModule } from './assignment/assignments.module';
import { LeavesModule } from './leaves/leaves.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ShiftsModule,
    AssignmentsModule,
    LeavesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
