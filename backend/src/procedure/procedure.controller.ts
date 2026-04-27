import { Controller, Get, Post, Put, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import * as dto from './dto';

@Controller('admin/procedure')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Get()
  findAll() {
    return this.procedureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.procedureService.findOne(id);
  }

  @Post()
  create(@Body() createProcedureDto: dto.CreateProcedureDto) {
    return this.procedureService.create(createProcedureDto);
  }

  @Put('task/:id')
  updateTask(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: dto.UpdateTaskDto) {
    return this.procedureService.updateTask(id, updateTaskDto);
  }

  @Post('comment')
  createComment(@Body() createCommentDto: dto.CreateCommentDto) {
    return this.procedureService.createComment(createCommentDto);
  }
}
