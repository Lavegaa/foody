import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'google-auth-library';
import * as jsonwebtoken from 'jsonwebtoken';
import { IToken, Token } from '../models/jwt.interface';

@Injectable()
export class JwtService implements Token {
  private readonly secret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET');
    this.accessTokenExpiresIn = '1h';  // 액세스 토큰 만료 시간
    this.refreshTokenExpiresIn = '14d'; // 리프레시 토큰 만료 시간
    
    if (!this.secret) {
      throw new Error('JWT_SECRET이 설정되지 않았습니다.');
    }
  }

  generate(payload: TokenPayload): IToken {
    const tokenPayload = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };

    const accessToken = jsonwebtoken.sign(tokenPayload, this.secret, {
      expiresIn: this.accessTokenExpiresIn
    });

    const refreshToken = jsonwebtoken.sign({ sub: payload.sub }, this.secret, {
      expiresIn: this.refreshTokenExpiresIn
    });

    return {
      accessToken,
      refreshToken
    };
  }

  verify(token: string): TokenPayload {
    return jsonwebtoken.verify(token, this.secret) as TokenPayload;
  }

  refreshAccessToken(sub: string): string {
    return jsonwebtoken.sign({ sub }, this.secret, {
      expiresIn: this.accessTokenExpiresIn
    });
  }
}