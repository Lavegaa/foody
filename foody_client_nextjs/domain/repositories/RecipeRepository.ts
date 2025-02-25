import { RecipeWithIngredient } from '@/domain/models/recipeModel';
import { get } from '@/utils/fetch';
export class RecipeRepository {
  async getRecipes() {
    const response = await get<RecipeWithIngredient[]>('/v1/recipes/recipes-with-ingredients');
    return response;
  }
}
