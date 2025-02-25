'use client';

import { useEffect, useState } from 'react';

import useRecipesQuery, {
  RecipeWithIngredient,
} from '@/hooks/queries/useRecipesWithIngredientQuery';

export default function useRecipeList() {
  const [recipes, setRecipes] = useState<RecipeWithIngredient[]>([]);
  const { data, isLoading, error } = useRecipesQuery();

  useEffect(() => {
    if (data) {
      setRecipes(data);
    }
  }, [data]);

  return {
    recipes,
    isLoading,
    error,
  };
}
