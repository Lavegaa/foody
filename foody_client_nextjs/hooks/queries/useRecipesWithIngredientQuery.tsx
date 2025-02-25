import { useQuery } from '@tanstack/react-query';

import { RecipeRepository } from '@/domain/repositories/RecipeRepository';

export interface RecipeWithIngredient {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  userId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  ingredients: {
    ingredient: {
      id: string;
      name: string;
    };
  }[];
}

export default function useRecipesQuery() {
  const recipeRepository = new RecipeRepository();
  return useQuery({
    queryKey: ['recipes-with-ingredients'],
    queryFn: () => recipeRepository.getRecipes(),
  });
}
