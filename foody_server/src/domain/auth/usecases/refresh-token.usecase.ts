import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';


@Injectable()
export default class RefreshTokenUc {
  constructor(private readonly authService: AuthService) {}

  async execute(refreshToken: string) {
    const jwtToken = await this.authService.refreshToken(refreshToken);
    return jwtToken;
  }
}
