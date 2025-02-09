export class IngredientDto {
  name: string;
}

export class IngredientResponseDto {
  id: number;
  name: string;
}

export class UserIngredientDto {
  ingredientId: number;
  quantity?: number;
  unit?: string;
}

export class UserIngredientResponseDto {
  ingredient: IngredientResponseDto;
  quantity: number | null;
  unit: string | null;
}
