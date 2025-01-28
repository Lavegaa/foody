import { Injectable } from '@nestjs/common';
import RecipeRepository from '../repositories/recipe.repository';
@Injectable()
export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async getRecipeById(id: string) {
    return await this.recipeRepository.getRecipeById(id);
  }
}
