import { JwtModule } from '@infra/services/jwt/jwt.module';
import { PrismaModule } from '@infra/services/prisma/prisma.module';
import { Module } from '@nestjs/common';
import SignInUc from './usecases/signin.usecase';
import { AuthService } from './services/auth.service';
import UserRepository from './repositories/user.repository';
import GetUserInfoByGoogleCodeRepository from './repositories/google-oauth.repository';
import AuthController from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import RefreshTokenUc from './usecases/refresh-token.usecase';

const providers = [
  // uc
  SignInUc,
  RefreshTokenUc,
  // repository
  UserRepository,
  GetUserInfoByGoogleCodeRepository,
  // service
  AuthService,
];

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers,
  exports: providers,
})
export default class AuthModule {}
