import RecipeList from "@/views/RecipeList/RecipeList";
import { Suspense } from "react";

export default function RecipesPage() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <RecipeList />
  </Suspense>
  )
}