import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiRole } from '@prisma/client';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async generate(role: ApiRole) {
    const key = `api_${role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return this.prisma.apiKey.create({
      data: {
        key,
        role,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      }
    });
  }

  async findAll() {
    return this.prisma.apiKey.findMany({
      select: {
        id: true,
        role: true,
        expires: true,
        lastUsed: true,
        createdAt: true,
      }
    });
  }

  async delete(id: string) {
    return this.prisma.apiKey.delete({ where: { id } });
  }

  async validate(key: string): Promise<{ role: ApiRole } | null> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key },
      select: { role: true, expires: true }
    });

    if (!apiKey || (apiKey.expires && apiKey.expires < new Date())) {
      return null;
    }

    // Update last used
    await this.prisma.apiKey.updateMany({
      where: { key },
      data: { lastUsed: new Date() }
    });

    return { role: apiKey.role };
  }
}

