import { IngredientResponseDto } from './ingredient.dto';

export class CreateRecipeDto {
  title: string;
  authorId: string;
  ingredients: {
    ingredientId: number;
  }[];
  steps: {
    stepNumber: number;
    action: string;
    ingredients: number[]; // ingredient IDs
  }[];
}

export class RecipeStepDto {
  stepNumber: number;
  action: string;
  ingredients: IngredientResponseDto[];
}

export class RecipeResponseDto {
  id: number;
  title: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
  };
  ingredients: IngredientResponseDto[];
  steps: RecipeStepDto[];
}

export class RecipeSearchDto {
  title?: string;
  authorId?: string;
  ingredientIds?: number[];
  page?: number;
  limit?: number;
}
