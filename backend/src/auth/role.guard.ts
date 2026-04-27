import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
      ?? this.reflector.get<string[]>('roles', context.getClass());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Non authentifié');

    // SUPER_ADMIN a accès à tout
    if (user.role === 'SUPER_ADMIN') return true;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Permissions insuffisantes');
    }
    return true;
  }
}
