'use client';

import { useEffect, useState } from 'react';

import { RecipeWithIngredient } from '@/domain/models/recipeModel';
import useRecipesWithIngredientQuery from '@/hooks/queries/useRecipesWithIngredientQuery';

export default function useRecipeList() {
  const [recipes, setRecipes] = useState<RecipeWithIngredient[]>([]);
  const { data, isLoading, error } = useRecipesWithIngredientQuery();

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
