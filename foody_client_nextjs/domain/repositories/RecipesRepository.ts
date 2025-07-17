import { get } from '@/utils/fetch';

export interface Ingredient {
  id: string;
  name: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientId: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: string;
  title: string;
  thumbnail: string | null;
  link: string;
  categoryId: string | null;
  categoryConfidence: number | null;
  ingredients: RecipeIngredient[];
}

export class RecipesRepository {
  async getRecipesWithIngredients(): Promise<Recipe[]> {
    return await get<Recipe[]>('/v1/recipes/recipes-with-ingredients');
  }
}
