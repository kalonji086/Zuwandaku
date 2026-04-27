import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProcedureService } from '../procedure/procedure.service';
import { ApiKeyGuard } from '../auth/apikey.guard';

@Controller('public/procedure')
@UseGuards(ApiKeyGuard)
export class PublicProcedureController {
  constructor(private procedureService: ProcedureService) {}

  @Get('tasks')
  async getTasks(@Query('dossierId') dossierId?: string) {
    return this.procedureService.findAll();
  }
}
