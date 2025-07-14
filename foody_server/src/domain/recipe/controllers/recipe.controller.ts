import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infra/services/jwt/guards/jwt-auth.guard';
import { CurrentUser } from '@infra/services/jwt/decorators/user.decorator';
import SimpleResponseDto from 'src/domain/common/dtos/SimpleResponseDto';
import RecipeListUc from '../usecases/recipe-list.usecase';
import { Recipe, UserIngredient } from '@prisma/client';
import RecipeByIdUc from '../usecases/recipe-by-id.usecase';
import UserIngredientListUc from '../usecases/user-ingredient-list.usecase';
import CreateUserIngredientsUc from '../usecases/create-user-ingredients.usecase';
import { UserIngredientDto } from '../dtos/ingredient.dto';
import RecipeWithIngredientListUc from '../usecases/recipe-with-ingredient-list.usecase';
import CreateRecipeFromAgentUc from '../usecases/create-recipe-from-youtube.usecase';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';

@Controller('v1/recipes')
@ApiTags('recipes')
export default class RecipeController {
  constructor(
    private readonly recipeListUc: RecipeListUc,
    private readonly recipeByIdUc: RecipeByIdUc,
    private readonly userIngredientListUc: UserIngredientListUc,
    private readonly recipeWithIngredientListUc: RecipeWithIngredientListUc,
    private readonly createUserIngredientsUc: CreateUserIngredientsUc,
    private readonly createRecipeFromAgentUc: CreateRecipeFromAgentUc,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRecipes(): Promise<Recipe[]> {
    return await this.recipeListUc.execute();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/recipes-with-ingredients')
  async getRecipesWithIngredients(): Promise<Recipe[]> {
    return await this.recipeWithIngredientListUc.execute();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRecipeById(@Param('id') id: string): Promise<Recipe> {
    return await this.recipeByIdUc.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ingredients')
  async getUserIngredients(@CurrentUser() user): Promise<UserIngredient[]> {
    return await this.userIngredientListUc.execute(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/ingredients')
  async postUserIngredients(
    @Body() ingredients: UserIngredientDto[],
    @CurrentUser() user,
  ): Promise<SimpleResponseDto> {
    await this.createUserIngredientsUc.execute(ingredients, user.sub);
    return new SimpleResponseDto();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecipeFromUser(
    @Body() createRecipeDto: CreateRecipeDto,
    @CurrentUser() user,
  ): Promise<Recipe> {
    return await this.createRecipeFromAgentUc.execute(createRecipeDto, user.sub);
  }

  @Post('/from-agent')
  async createRecipeFromAgent(
    @Body() createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    // Agent용 - 기본 admin 사용자 사용
    const defaultUserId = "0"; // admin 사용자 ID
    return await this.createRecipeFromAgentUc.execute(createRecipeDto, defaultUserId);
  }
}

