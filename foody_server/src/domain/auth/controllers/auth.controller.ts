import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SignInUc from '../usecases/signin.usecase';
import RefreshTokenUc from '../usecases/refresh-token.usecase';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '@infra/services/jwt/guards/jwt-auth.guard';
import { CurrentUser } from '@infra/services/jwt/decorators/user.decorator';

@Controller('v1/auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(
    private readonly signInUc: SignInUc,
    private readonly refreshTokenUc: RefreshTokenUc,
  ) {}

  @Post('google/signin')
  async signIn(
    @Body() body: { idToken: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.signInUc.execute(body.idToken, response);

    // 응답 헤더 설정
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    return { message: 'Login successful', user };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    // 쿠키에서 리프레시 토큰 가져오기
    const refreshToken = request.cookies['refresh_token'];
    
    if (!refreshToken) {
      response.status(401).json({ message: 'Refresh token not found' });
      return;
    }
    
    const newAccessToken = await this.refreshTokenUc.execute(refreshToken, response);
    return { accessToken: newAccessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user) {
    return user;
  }
}
