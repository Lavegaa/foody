import { JwtModule } from '@infra/services/jwt/jwt.module';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import AuthModule from './domain/auth/auth.module';
import RecipeModule from './domain/recipe/recipe.module';

@Module({
  imports: [RecipeModule, AuthModule, JwtModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }, // https://docs.nestjs.com/techniques/serialization
  ],
})
export class AppModule {}
