import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';


@Injectable()
export default class SignInUc {
  constructor(private readonly authService: AuthService) {}

  async execute(idToken: string) {
    const jwtToken = await this.authService.authenticateWithGoogle(idToken);
    const user = await this.authService.createOrGetUser(jwtToken.user);
    return {
      accessToken: jwtToken.accessToken,
      refreshToken: jwtToken.refreshToken,
    };
  }
}
