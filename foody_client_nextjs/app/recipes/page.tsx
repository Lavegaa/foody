import React, { Suspense } from 'react';

import RecipeList from '@/views/RecipeList/RecipeList';

export default function RecipesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipeList />
    </Suspense>
  );
}
