import { useQuery } from "@tanstack/react-query";

export interface Recipe {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  userId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export default function useRecipesQuery() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${apiUrl}/v1/recipes`;

  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => fetch(endpoint).then(res => res.json()) as Promise<Recipe[]>,
  })
}
