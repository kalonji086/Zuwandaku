import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MemberAssignationController } from './member-assignation.controller';
import { MemberAssignationService } from './member-assignation.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [MemberAssignationController],
  providers: [MemberAssignationService],
  exports: [MemberAssignationService],
})
export class MemberAssignationModule {}
