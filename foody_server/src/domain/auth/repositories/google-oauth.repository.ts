import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export default class GoogleOAuthRepository {
  constructor() {}

  async getUserInfoByGoogleIdToken(idToken: string) {  
    try {
      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID
      );

      const ticket = await oAuth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      if (!ticket) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다');
      }

      const payload = ticket.getPayload();
      return payload;

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('구글 인증에 실패했습니다');
    }
  }
}
