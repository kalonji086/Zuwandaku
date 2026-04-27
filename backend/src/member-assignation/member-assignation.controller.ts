import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { MemberAssignationService } from './member-assignation.service';

@Controller('member-assignation')
@UseGuards(RoleGuard)
export class MemberAssignationController {
  constructor(private service: MemberAssignationService) {}

  @Get('dossiers')
  @Roles('MemberAssignation')
  getDossiers(
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('type') type: string,
  ) {
    return this.service.getDossiers(search, status, type);
  }

  @Get('users')
  @Roles('MemberAssignation')
  getUsers(
    @Query('search') search: string,
    @Query('role') role: string,
    @Query('exclude') exclude: string,
  ) {
    const excludeIds = exclude ? exclude.split(',') : [];
    return this.service.getAvailableUsers(search, role, excludeIds);
  }

  @Post('assign/dossier/:id')
  @Roles('MemberAssignation')
  assignToDossier(
    @Param('id') dossierId: string,
    @Body() body: { userId: string; type: 'responsable' | 'member' },
  ) {
    return this.service.assignToDossier(dossierId, body.userId, body.type);
  }

  @Post('responsable/dossier/:id')
  @Roles('MemberAssignation')
  setResponsable(
    @Param('id') dossierId: string,
    @Body() body: { userId: string | null },
  ) {
    return this.service.setResponsable(dossierId, body.userId);
  }

  @Delete('member/dossier/:id/:userId')
  @Roles('MemberAssignation')
  removeMember(@Param('id') dossierId: string, @Param('userId') userId: string) {
    return this.service.removeMember(dossierId, userId);
  }

  @Get('dossier/:id/members')
  @Roles('MemberAssignation')
  getDossierMembers(@Param('id') dossierId: string) {
    return this.service.getDossierMembers(dossierId);
  }
}
