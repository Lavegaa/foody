import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/services/prisma/prisma.service';
import { Recipe } from '@prisma/client';
@Injectable()
export default class RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(): Promise<Recipe[]> {
    return await this.prisma.recipe.findMany();
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
}
