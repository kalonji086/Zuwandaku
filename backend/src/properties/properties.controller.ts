import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get('owner/my-properties')
  @UseGuards(JwtAuthGuard)
  findMyProperties(@Request() req) {
    return this.propertiesService.findByOwner(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    return this.propertiesService.create({ ...createPropertyDto, owner: { connect: { id: req.user.userId } } } as any);
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('provinceId') provinceId?: string,
    @Query('villeId') villeId?: string,
    @Query('status') status?: string,
  ) {
    return this.propertiesService.findAll({ type, provinceId, villeId, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: any) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
