import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

@Injectable()
export default class SignInUc {
  constructor(private readonly authService: AuthService) {}

  async execute(idToken: string, response: Response) {
    try {
      const result = await this.authService.authenticateWithGoogle(
        idToken,
        response,
      );
      const user = await this.authService.createOrGetUser(result.user);
      return user;
    } catch (e: any) {
      throw new UnauthorizedException(e.message);
    }
  }
}
