import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './services/jwt.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: JwtService,
      useFactory: (configService: ConfigService) => {
        return new JwtService(configService);
      },
      inject: [ConfigService]
    },
    JwtAuthGuard
  ],
  exports: [JwtService, JwtAuthGuard]
})
export class JwtModule {}
