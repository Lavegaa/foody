import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AUTH_CONSTANTS } from '@infra/services/jwt/models/jwt.constants';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookies(
    response: Response,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
  ) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      // TODO: 추후 변경 필요
      domain: process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost',
    };

    response.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: AUTH_CONSTANTS.ACCESS_TOKEN.expiresInMs,
    });

    response.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: AUTH_CONSTANTS.REFRESH_TOKEN.expiresInMs,
    });
  }

  clearAuthCookies(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  }
}
