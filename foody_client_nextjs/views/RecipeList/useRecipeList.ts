"use client";

import useRecipesQuery, { Recipe } from "@/hooks/queries/useRecipesQuery";
import { useEffect, useState } from "react";

export default function useRecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const {data, isLoading, error} = useRecipesQuery();

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
