import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from '../apikey/apikey.service';
import { ApiRole } from '@prisma/client';

interface ApiKeyRequest extends Request {
  apiKeyUser: { role: ApiRole };
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ApiKeyRequest>();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key required');
    }

    const validKey = await this.apiKeyService.validate(apiKey);
    if (!validKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    request.apiKeyUser = validKey;
    return true;
  }
}

