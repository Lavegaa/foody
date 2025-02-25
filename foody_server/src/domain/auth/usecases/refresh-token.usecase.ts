import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@infra/services/jwt/services/jwt.service';
import { CookieService } from '../services/cookie.service';

@Injectable()
export default class RefreshTokenUc {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  async execute(refreshToken: string, response: Response): Promise<string> {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken);
      
      if (!payload.sub) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
      // 새로운 액세스 토큰 발급
      const accessToken = this.jwtService.refreshAccessToken(payload.sub);
      
      // 쿠키 설정
      this.cookieService.setAuthCookies(response, {
        accessToken: accessToken,
      });

      return accessToken;
    } catch (error) {
      this.cookieService.clearAuthCookies(response);
      throw new UnauthorizedException('토큰 갱신에 실패했습니다.', error);
    }
  }
}
