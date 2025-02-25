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
