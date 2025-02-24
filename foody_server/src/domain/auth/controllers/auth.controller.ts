import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SignInUc from '../usecases/signin.usecase';
import RefreshTokenUc from '../usecases/refresh-token.usecase';
import { Response } from 'express';
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
    @Body() body: { refreshToken: string },
  ): Promise<{ accessToken: string }> {
    const newAccessToken = await this.refreshTokenUc.execute(body.refreshToken);
    return { accessToken: newAccessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user) {
    return user;
  }
}
