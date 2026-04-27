import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProcedureController],
  providers: [ProcedureService],
  exports: [ProcedureService],
})
export class ProcedureModule {}
