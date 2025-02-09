import { Module } from '@nestjs/common';
import { PrismaModule } from '@infra/services/prisma/prisma.module';
import { JwtModule } from '@infra/services/jwt/jwt.module';
import RecipeController from './controllers/recipe.controller';
import RecipeRepository from './repositories/recipe.repository';
import RecipeByIdUc from './usecases/recipe-by-id.usecase';
import RecipeListUc from './usecases/recipe-list.usecase';
import { RecipeService } from './services/recipe.service';
import CreateUserIngredientsUc from './usecases/create-user-ingredients.usecase';
import UserIngredientListUc from './usecases/user-ingredient-list.usecase';
import IngredientRepository from './repositories/ingredient.repository';

const providers = [
  // uc
  RecipeListUc,
  RecipeByIdUc,
  UserIngredientListUc,
  CreateUserIngredientsUc,
  // repository
  RecipeRepository,
  IngredientRepository,
  // service
  RecipeService,
];

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [RecipeController],
  providers,
  exports: providers,
})
export default class RecipeModule {}
