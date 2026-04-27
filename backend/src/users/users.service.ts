import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, ApproveRequest } from '@prisma/client';
import { UpdateUserStatusDto, ApproveRequestDto } from './dto/admin.dto';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { ModuleStatusService } from '../apikey/module-status.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private moduleStatus: ModuleStatusService,
  ) {}

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        cni: true,
        siret: true,
        licenseNumber: true,
        isActive: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    }) as any;
  }

  async findAllAdmin(): Promise<User[]> {
    return this.prisma.user.findMany({ include: { requests: true } });
  }

  async findStaff(page = 1, limit = 10, role?: string, status?: string): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {
      role: role ? (role as any) : undefined,
      status: (status as any) || undefined,
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async createStaff(dto: CreateStaffDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: dto.role as any,
        password: 'hashed_default',
        status: 'PENDING',
        isActive: false,
      },
    });
  }

  async updateStaff(id: string, dto: UpdateStaffDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Staff not found');
    return this.prisma.user.update({ where: { id }, data: dto as any });
  }

  async deleteStaff(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Staff not found');
    return this.prisma.user.delete({ where: { id } });
  }

  async toggleRolePermission(role: string, module: string): Promise<{ role: string; module: string; allowed: boolean }> {
    const existing = await this.prisma.rolePermission.findUnique({
      where: { role_permissionId: { role: role as any, permissionId: module } },
    });

    let allowed: boolean;
    if (existing) {
      await this.prisma.rolePermission.delete({
        where: { role_permissionId: { role: role as any, permissionId: module } },
      });
      allowed = false;
    } else {
      await this.prisma.permission.upsert({
        where: { id: module },
        update: {},
        create: { id: module, name: module, module },
      });
      await this.prisma.rolePermission.create({ data: { role: role as any, permissionId: module } });
      allowed = true;
    }

    // Broadcast realtime
    this.moduleStatus.broadcast({ role, module, enabled: allowed });
    return { role, module, allowed };
  }

  async getRolePermissions(role: string): Promise<string[]> {
    const perms = await this.prisma.rolePermission.findMany({
      where: { role: role as any },
      select: { permissionId: true },
    });
    return perms.map((p) => p.permissionId);
  }

  async findOneAdmin(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where, include: { requests: true } });
  }

  async updateUserStatus(id: string, data: UpdateUserStatusDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: data as any });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async getPendingRequests(type?: string): Promise<ApproveRequest[]> {
    return this.prisma.approveRequest.findMany({
      where: { status: 'PENDING', ...(type && { type: type as any }) },
      include: { user: true },
    });
  }

  async approveRequest(id: string, data: ApproveRequestDto): Promise<ApproveRequest> {
    return this.prisma.approveRequest.update({
      where: { id },
      data: { status: 'APPROVED', adminNote: data.adminNote },
      include: { user: true },
    });
  }

  async getDeptAdmins(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      where: { role: 'DEPT_ADMIN' as any },
      select: {
        id: true, email: true, name: true, role: true,
        phone: true, department: true, isActive: true,
        status: true, createdAt: true, updatedAt: true,
        password: false, address: false, cni: false,
        siret: false, licenseNumber: false, lastLogin: false,
      },
    }) as any;
  }

  async createDeptAdmin(data: { name: string; email: string; password: string; department: string }): Promise<User> {
    const bcrypt = await import('bcrypt');
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: 'DEPT_ADMIN' as any,
        department: data.department as any,
        isActive: true,
        status: 'APPROVED',
      },
    });
  }

  async getDeptStats(department: string) {
    const deptMap: Record<string, any> = {
      IMMOBILIER: async () => ({
        total: await this.prisma.property.count(),
        available: await this.prisma.property.count({ where: { status: 'AVAILABLE' } }),
        rented: await this.prisma.property.count({ where: { status: 'RENTED' } }),
        sold: await this.prisma.property.count({ where: { status: 'SOLD' } }),
      }),
      VEHICULES: async () => ({
        total: await this.prisma.vehicle.count(),
        available: await this.prisma.vehicle.count({ where: { availability: true } }),
        rented: await this.prisma.vehicle.count({ where: { availability: false } }),
      }),
      HOTEL: async () => ({
        total: await this.prisma.roomHotel.count(),
        available: await this.prisma.roomHotel.count({ where: { status: 'AVAILABLE' } }),
        occupied: await this.prisma.roomHotel.count({ where: { status: 'OCCUPIED' } }),
      }),
      FINANCE: async () => ({
        contracts: await this.prisma.contract.count(),
        active: await this.prisma.contract.count({ where: { status: 'ACTIVE' } }),
        pending: await this.prisma.contract.count({ where: { status: 'PENDING' } }),
      }),
      SUPPORT: async () => ({
        dossiers: await this.prisma.dossier.count(),
        enAttente: await this.prisma.dossier.count({ where: { status: 'EN_ATTENTE' } }),
        enCours: await this.prisma.dossier.count({ where: { status: 'EN_COURS' } }),
        finalise: await this.prisma.dossier.count({ where: { status: 'FINALISE' } }),
      }),
    };
    const fn = deptMap[department];
    if (!fn) return {};
    return fn();
  }

  async rejectRequest(id: string, data: ApproveRequestDto): Promise<ApproveRequest> {
    return this.prisma.approveRequest.update({
      where: { id },
      data: { status: 'REJECTED', adminNote: data.adminNote },
      include: { user: true },
    });
  }
}
