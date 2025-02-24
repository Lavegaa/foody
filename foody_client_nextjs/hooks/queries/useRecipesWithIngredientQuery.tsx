import { useQuery } from "@tanstack/react-query";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${apiUrl}/v1/recipes/recipes-with-ingredients`;

  return useQuery({
    queryKey: ['recipes-with-ingredients'],
    queryFn: () =>
      fetch(endpoint, {
        credentials: 'include',
      }).then(res => res.json()) as Promise<RecipeWithIngredient[]>,
  });
}
