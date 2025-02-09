import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SignInUc from '../usecases/signin.usecase';
import { IToken } from '@infra/services/jwt/models/jwt.interface';
import RefreshTokenUc from '../usecases/refresh-token.usecase';
@Controller('v1/auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(
    private readonly signInUc: SignInUc,
    private readonly refreshTokenUc: RefreshTokenUc,
  ) {}

  @Post('google/signin')
  async signIn(@Body() body: { idToken: string }, @Headers() headers: Record<string, string>): Promise<IToken> {
    const token = headers['authorization'];
    console.log('token', token);
    console.log('body', body);
    
    // const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    // if (decodedToken !== 'test') {
    //   throw new UnauthorizedException('Invalid token');
    // }
    const jwtToken = await this.signInUc.execute(body.idToken);
    console.log('jwtToken', jwtToken);
    return jwtToken;
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }): Promise<{ accessToken: string }> {
    const newAccessToken = await this.refreshTokenUc.execute(body.refreshToken);
    return { accessToken: newAccessToken };
  }
}


