import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserStatusDto, ApproveRequestDto } from './dto/admin.dto';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('ADMIN', 'SUPER_ADMIN', 'DEPT_ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  findAllAdmin() {
    return this.usersService.findAllAdmin();
  }

  @Get(':id')
  findOneAdmin(@Param('id') id: string) {
    return this.usersService.findOneAdmin({ id });
  }

  @Patch(':id/approve')
  approveUser(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.usersService.updateUserStatus(id, { ...dto, status: 'APPROVED' });
  }

  @Patch(':id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.usersService.updateUserStatus(id, { isActive: false, status: 'SUSPENDED' });
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('staff')
  findStaff(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findStaff(parseInt(page), parseInt(limit), role, status);
  }

  @Post('staff')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.createStaff(createStaffDto);
  }

  @Patch('staff/:id')
  updateStaff(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.usersService.updateStaff(id, updateStaffDto);
  }

  @Delete('staff/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  deleteStaff(@Param('id') id: string) {
    return this.usersService.deleteStaff(id);
  }

  // Dept Admin management — SUPER_ADMIN only
  @Get('dept-admins')
  @Roles('SUPER_ADMIN')
  getDeptAdmins() {
    return this.usersService.getDeptAdmins();
  }

  @Post('dept-admins')
  @Roles('SUPER_ADMIN')
  createDeptAdmin(@Body() body: { name: string; email: string; password: string; department: string }) {
    return this.usersService.createDeptAdmin(body);
  }

  @Get('dept-stats/:department')
  getDeptStats(@Param('department') department: string, @Request() req: any) {
    // DEPT_ADMIN ne peut voir que son département
    if (req.user.role === 'DEPT_ADMIN' && req.user.department !== department) {
      return { error: 'Accès refusé' };
    }
    return this.usersService.getDeptStats(department);
  }

  @Get('pending-requests')
  getPendingRequests(@Query('type') type?: string) {
    return this.usersService.getPendingRequests(type);
  }

  @Patch('requests/:id/approve')
  approveRequest(@Param('id') id: string, @Body() dto: ApproveRequestDto) {
    return this.usersService.approveRequest(id, dto);
  }

  @Patch('requests/:id/reject')
  rejectRequest(@Param('id') id: string, @Body() dto: ApproveRequestDto) {
    return this.usersService.rejectRequest(id, dto);
  }

  @Get('role-permissions/:role')
  getRolePermissions(@Param('role') role: string) {
    return this.usersService.getRolePermissions(role);
  }

  @Post('toggle-role-permission')
  @Roles('SUPER_ADMIN', 'ADMIN')
  toggleRolePermission(@Body() body: { role: string; module: string }) {
    return this.usersService.toggleRolePermission(body.role, body.module);
  }
}
