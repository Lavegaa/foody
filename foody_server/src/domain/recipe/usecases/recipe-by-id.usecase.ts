import { Injectable, NotFoundException } from '@nestjs/common';
import RecipeRepository from '../repositories/recipe.repository';

@Injectable()
export default class RecipeByIdUc {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async execute(id: string) {
    const recipe = await this.recipeRepository.getRecipeById(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }
}
