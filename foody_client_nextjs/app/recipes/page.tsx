import React, { Suspense } from 'react';

import Header from '@/components/Header/Header';
import RecipeList from '@/views/RecipeList/RecipeList';

export default function RecipesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <RecipeList />
    </Suspense>
  );
}
