import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ModuleStatusService } from './module-status.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/modules')
@UseGuards(JwtAuthGuard)
export class ModuleStatusController {
  constructor(
    private readonly moduleStatus: ModuleStatusService,
    private readonly prisma: PrismaService,
  ) {}

  /** GET /admin/modules/status — état courant de tous les modules par rôle */
  @Get('status')
  async getStatus() {
    const perms = await this.prisma.rolePermission.findMany({
      select: { role: true, permissionId: true },
    });
    const result: Record<string, string[]> = {};
    for (const p of perms) {
      if (!result[p.role]) result[p.role] = [];
      result[p.role].push(p.permissionId);
    }
    return result;
  }

  /** GET /admin/modules/stream — SSE realtime */
  @Get('stream')
  stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sub = this.moduleStatus.stream$.subscribe((event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    // Heartbeat every 30s
    const hb = setInterval(() => res.write(': ping\n\n'), 30_000);

    res.on('close', () => {
      sub.unsubscribe();
      clearInterval(hb);
    });
  }
}
