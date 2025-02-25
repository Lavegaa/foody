import { useQuery } from '@tanstack/react-query';

import { RecipeRepository } from '@/domain/repositories/RecipeRepository';

export default function useRecipesWithIngredientQuery() {
  const recipeRepository = new RecipeRepository();
  return useQuery({
    queryKey: ['recipes-with-ingredients'],
    queryFn: () => recipeRepository.getRecipes(),
  });
}
