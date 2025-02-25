import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';
import { CreateUserDto } from '../models/user.dto';
import { JwtService } from '@infra/services/jwt/services/jwt.service';

@Injectable()
export default class SignInUc {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(idToken: string, response: Response) {
    try {
      // Google ID 토큰 검증
      const googleUser = await this.authService.verifyGoogleIdToken(idToken);
      
      // 사용자 생성 또는 조회
      const user = await this.authService.createOrGetUser({
        id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        profileImage: googleUser.picture,
      } as CreateUserDto);
      
      // JWT 토큰 생성
      const tokens = this.jwtService.generate(googleUser);
      
      // 쿠키 설정
      this.cookieService.setAuthCookies(response, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
        },
      };
    } catch (error) {
      this.cookieService.clearAuthCookies(response);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
