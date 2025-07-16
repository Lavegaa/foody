import { useRouter } from 'next/navigation';
import React from 'react';

interface RecipeHeaderProps {
  userIngredientsCount: number;
}

export default function RecipeHeader({ userIngredientsCount }: RecipeHeaderProps) {
  const router = useRouter();

  return (
    <div className='bg-white shadow-sm border-b'>
      <div className='max-w-md mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => router.push('/fridge')}
              className='text-gray-600 hover:text-gray-800'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <div className='text-2xl'>🔍</div>
            <h1 className='text-xl font-bold text-gray-800'>레시피 추천</h1>
          </div>
          <div className='text-sm text-gray-500'>재료 {userIngredientsCount}개</div>
        </div>
      </div>
    </div>
  );
}
