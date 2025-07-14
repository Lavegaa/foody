import { Injectable, Logger } from '@nestjs/common';
import RecipeRepository from '../repositories/recipe.repository';
import { Recipe } from '@prisma/client';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';

@Injectable()
export default class CreateRecipeFromAgentUc {
  private readonly logger = new Logger(CreateRecipeFromAgentUc.name);

  constructor(
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(createRecipeDto: CreateRecipeDto, userId: string): Promise<Recipe> {
    this.logger.log(`Creating recipe from Agent data for user: ${userId}`);

    try {
      // Agent에서 전달받은 데이터를 Repository 형태로 변환
      const agentRecipeData = {
        youtube_url: createRecipeDto.youtube_url,
        title: createRecipeDto.title,
        metadata: createRecipeDto.metadata,
        ingredients: createRecipeDto.ingredients,
        cuisine_info: createRecipeDto.cuisine_info,
        transcript: createRecipeDto.transcript,
        processing_status: createRecipeDto.processing_status,
      };

      // Repository를 통해 데이터베이스에 저장
      const recipe = await this.recipeRepository.createRecipeFromAgent(
        agentRecipeData,
        userId
      );

      this.logger.log(`Successfully created recipe: ${recipe.id}`);
      return recipe;

    } catch (error) {
      this.logger.error(`Failed to create recipe from Agent data: ${error.message}`);
      throw error;
    }
  }
}