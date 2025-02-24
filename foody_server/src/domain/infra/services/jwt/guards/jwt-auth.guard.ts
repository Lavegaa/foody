import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { CanActivate } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

// auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다');
    }
  }
}
