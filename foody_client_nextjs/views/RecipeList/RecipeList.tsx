'use client';

import React from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import RecipeItem from './RecipeItem/RecipeItem';
import useRecipeList from './useRecipeList';

dayjs.locale('ko');

export default function RecipeList() {
  const { recipes, isLoading, error } = useRecipeList();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!recipes) return <div>레시피가 없습니다.</div>;

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
