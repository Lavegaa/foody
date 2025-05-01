'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import dayjs from 'dayjs';

import { RecipeWithIngredient } from '@/domain/models/recipeModel';

interface RecipeItemProps {
  recipe: RecipeWithIngredient;
}

export default function RecipeItem({ recipe }: RecipeItemProps) {
  // 재료 목록을 쉼표로 구분된 문자열로 변환
  const ingredientsList = recipe.ingredients
    ?.map((item) => item.ingredient.name)
    .join(', ');

  return (
    <Link
      href={recipe.link}
      target="_blank"
      className="flex flex-col bg-white border border-[#E6E6E6] rounded-xl overflow-hidden"
    >
      {/* 썸네일 영역 */}
      <div className="relative p-2.5 w-full aspect-video">
        <Image
          src={recipe.thumbnail}
          alt={recipe.title}
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* 레시피 정보 영역 */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <h2 className="font-semibold text-black text-base line-clamp-1">
          {recipe.title}
        </h2>
        <p className="text-gray-500 text-sm">
          재료: {ingredientsList}
        </p>
      </div>
    </Link>
  );
}
