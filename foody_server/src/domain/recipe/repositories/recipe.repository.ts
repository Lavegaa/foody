import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@infra/services/prisma/prisma.service';
import { Recipe } from '@prisma/client';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { extractYouTubeVideoId } from '../utils/youtube-utils';
@Injectable()
export default class RecipeRepository {
  private readonly logger = new Logger(RecipeRepository.name);
  
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(): Promise<Recipe[]> {
    return await this.prisma.recipe.findMany();
  }

  async getRecipesWithIngredients(): Promise<Recipe[]> {
    return await this.prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async getRecipeById(id: string): Promise<Recipe> {
    return await this.prisma.recipe.findUnique({
      where: { id },
    });
  }

  async createRecipe(recipe: Recipe): Promise<Recipe> {
    return await this.prisma.recipe.create({
      data: recipe,
    });
  }

  async checkRecipeExists(youtubeUrl: string): Promise<boolean> {
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) return false;

    const existingRecipe = await this.prisma.recipe.findFirst({
      where: {
        link: {
          contains: videoId
        }
      }
    });

    return existingRecipe !== null;
  }

  async createRecipeFromAgent(agentRecipe: CreateRecipeDto, userId: string): Promise<Recipe> {
    this.logger.log(`Creating recipe from agent data for user: ${userId}`);

    // 1. 중복 체크
    const videoId = extractYouTubeVideoId(agentRecipe.youtube_url);
    if (videoId) {
      const existingRecipe = await this.prisma.recipe.findFirst({
        where: {
          link: {
            contains: videoId
          }
        }
      });

      if (existingRecipe) {
        this.logger.warn(`Recipe already exists for video ID: ${videoId}`);
        throw new Error(`이미 존재하는 YouTube 영상입니다. (Video ID: ${videoId})`);
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Author 생성 또는 조회
      let author;
      if (agentRecipe.metadata?.author_name) {
        author = await tx.author.upsert({
          where: { authorName: agentRecipe.metadata.author_name },
          update: {
            authorUrl: agentRecipe.metadata.author_url,
          },
          create: {
            authorName: agentRecipe.metadata.author_name,
            authorUrl: agentRecipe.metadata.author_url,
          },
        });
      } else {
        // 기본 작성자 생성
        author = await tx.author.upsert({
          where: { authorName: 'Unknown' },
          update: {},
          create: {
            authorName: 'Unknown',
            authorUrl: null,
          },
        });
      }

      // 2. Category 조회
      let categoryId = null;
      if (agentRecipe.cuisine_info?.cuisine_type) {
        const category = await tx.category.findUnique({
          where: { name: agentRecipe.cuisine_info.cuisine_type },
        });
        categoryId = category?.id || null;
      }

      // 3. Recipe 생성
      const createdRecipe = await tx.recipe.create({
        data: {
          title: agentRecipe.title || agentRecipe.metadata?.title || 'Untitled Recipe',
          thumbnail: agentRecipe.metadata?.thumbnail_url,
          link: agentRecipe.youtube_url,
          userId,
          authorId: author.id,
          categoryId,
          categoryConfidence: agentRecipe.cuisine_info?.confidence,
          categoryReasoning: agentRecipe.cuisine_info?.reasoning,
        },
      });

      // 4. Ingredients 처리
      for (const agentIngredient of agentRecipe.ingredients) {
        // 재료 생성 또는 조회
        const ingredient = await tx.ingredient.upsert({
          where: { name: agentIngredient.name },
          update: {},
          create: { name: agentIngredient.name },
        });

        // 레시피-재료 연결
        await tx.recipeIngredient.create({
          data: {
            recipeId: createdRecipe.id,
            ingredientId: ingredient.id,
          },
        });
      }

      this.logger.log(`Successfully created recipe: ${createdRecipe.id}`);
      return createdRecipe;
    });
  }
}
