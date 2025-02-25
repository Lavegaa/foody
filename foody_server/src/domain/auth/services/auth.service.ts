import { Injectable, UnauthorizedException } from '@nestjs/common';
import GoogleOAuthRepository from '../repositories/google-oauth.repository';
import UserRepository from '../repositories/user.repository';
import { CreateUserDto } from '../models/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleOAuthRepository: GoogleOAuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async verifyGoogleIdToken(idToken: string) {
    try {
      return await this.googleOAuthRepository.getUserInfoByGoogleIdToken(idToken);
    } catch (error) {
      throw new UnauthorizedException('유효하지않은 토큰입니다.', error);
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
}