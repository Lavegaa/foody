import { Injectable, NotFoundException } from '@nestjs/common';
import RecipeRepository from '../repositories/recipe.repository';

@Injectable()
export default class RecipeWithIngredientListUc {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async execute() {
    const recipes = await this.recipeRepository.getRecipesWithIngredients();
    if (!recipes) {
      throw new NotFoundException('Recipes not found');
    }
    return recipes;
  }
}
