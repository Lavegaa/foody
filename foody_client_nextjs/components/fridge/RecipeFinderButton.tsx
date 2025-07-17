import { useRouter } from 'next/navigation';
import React from 'react';

interface RecipeFinderButtonProps {
  ingredientCount: number;
}

export default function RecipeFinderButton({ ingredientCount }: RecipeFinderButtonProps) {
  const router = useRouter();

  if (ingredientCount === 0) return null;

  return (
    <button
      onClick={() => router.push('/recipes')}
      className='w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-xl transition-colors shadow-sm'
    >
      <div className='flex items-center justify-center space-x-2'>
        <span>🔍</span>
        <span>레시피 찾기 ({ingredientCount}개 재료)</span>
      </div>
    </button>
  );
}
