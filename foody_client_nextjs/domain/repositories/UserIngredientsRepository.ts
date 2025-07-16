import { get, post, del } from '@/utils/fetch';

export interface Ingredient {
  id: string;
  name: string;
}

export interface UserIngredient {
  id: string;
  ingredientId: string;
  ingredient: Ingredient;
}

export interface UserIngredientDto {
  name: string;
}

export class UserIngredientsRepository {
  async getUserIngredients(): Promise<UserIngredient[]> {
    return await get<UserIngredient[]>('/v1/recipes/ingredients');
  }

  async addUserIngredients(ingredients: UserIngredientDto[]): Promise<void> {
    await post<void>('/v1/recipes/ingredients', ingredients);
  }

  async removeUserIngredient(id: string): Promise<void> {
    await del<void>(`/v1/recipes/ingredients/${id}`);
  }
}
