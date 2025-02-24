import { Injectable, UnauthorizedException } from '@nestjs/common';
import GoogleOAuthRepository from '../repositories/google-oauth.repository';
import UserRepository from '../repositories/user.repository';
import { JwtService } from '@infra/services/jwt/services/jwt.service';
import { CreateUserDto } from '../models/user.dto';
import { CookieService } from './cookie.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleOAuthRepository: GoogleOAuthRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) { }

  async authenticateWithGoogle(idToken: string, response: Response) {
    try {
      const user =
        await this.googleOAuthRepository.getUserInfoByGoogleIdToken(idToken);
      const jwtToken = this.jwtService.generate(user);

      this.cookieService.setAuthCookies(response, {
        accessToken: jwtToken.accessToken,
        refreshToken: jwtToken.refreshToken,
      });

      return {
        user: {
          id: user.sub,
          email: user.email,
          name: user.name,
          profileImage: user.picture,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.cookieService.clearAuthCookies(response);
        throw new UnauthorizedException('유효하지않은 토큰입니다.');
      }
      throw new Error(error);
    }
  }

  async createOrGetUser(user: CreateUserDto) {
    const existingUser = await this.userRepository.getUserByEmail(user.email);

    if (existingUser) {
      await this.userRepository.updateLastLogin(existingUser.id);
      return existingUser;
    }

    return this.userRepository.createUser(user);
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken);

      if (!payload.sub) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      // 새로운 액세스 토큰 발급
      return this.jwtService.refreshAccessToken(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('토큰 갱신에 실패했습니다.', error);
    }
  }
}
