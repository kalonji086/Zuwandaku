import { Module } from '@nestjs/common';
import { ApiKeyController } from './apikey.controller';
import { ApiKeyService } from './apikey.service';
import { ModuleStatusController } from './module-status.controller';
import { ModuleStatusService } from './module-status.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApiKeyController, ModuleStatusController],
  providers: [ApiKeyService, ModuleStatusService],
  exports: [ApiKeyService, ModuleStatusService],
})
export class ApiKeyModule {}

