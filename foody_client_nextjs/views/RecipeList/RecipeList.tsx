"use client";

import useRecipeList from "./useRecipeList";
import dayjs from "dayjs";
import Image from 'next/image';
import Link from 'next/link';

// 한국어 로케일 적용
import "dayjs/locale/ko";
dayjs.locale("ko");

export default function RecipeList() {
  const { recipes, isLoading, error } = useRecipeList();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!recipes) return <div>레시피가 없습니다.</div>;

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {recipes.map((recipe) => (
        <Link 
          href={recipe.link} 
          key={recipe.id}
          target="_blank"
          className="group block bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all hover:-translate-y-1 duration-200"
        >
          <div className="relative aspect-video">
            <Image
              src={recipe.thumbnail}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="p-4">
            <h2 className="group-hover:text-blue-600 mb-2 font-medium text-lg line-clamp-2 transition-colors">
              {recipe.title}
            </h2>
            
            <div className="text-gray-500 text-sm">
              {dayjs(recipe.createdAt).format('YYYY.MM.DD')}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}