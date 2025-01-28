import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import RecipeModule from './domain/recipe/recipe.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import AuthModule from './domain/auth/auth.module';
import { JwtModule } from '@infra/services/jwt/jwt.module';

@Module({
  imports: [RecipeModule, AuthModule, JwtModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }, // https://docs.nestjs.com/techniques/serialization
  ],
})
export class AppModule {}
