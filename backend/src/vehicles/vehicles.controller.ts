import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehiclesService.create(createVehicleDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query('provinceId') provinceId?: string,
    @Query('villeId') villeId?: string,
    @Query('type') type?: string,
    @Query('availability') availability?: string,
  ) {
    return this.vehiclesService.findAll({
      provinceId,
      villeId,
      type,
      availability: availability === 'true',
    });
  }

  @Get('owner/my-vehicles')
  @UseGuards(JwtAuthGuard)
  getMyVehicles(@Request() req) {
    return this.vehiclesService.findByOwner(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.vehiclesService.remove(id, req.user.userId);
  }
}
