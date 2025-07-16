import { useRouter } from 'next/navigation';
import React from 'react';

import { UserIngredient } from '@/domain/repositories/UserIngredientsRepository';

interface IngredientListProps {
  userIngredients: UserIngredient[];
  isLoading: boolean;
  onRemoveIngredient: (id: string) => Promise<void>;
}

export default function IngredientList({
  userIngredients,
  isLoading,
  onRemoveIngredient,
}: IngredientListProps) {
  const router = useRouter();

  return (
    <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-gray-800'>
          보유 재료 ({userIngredients.length}개)
        </h2>
        {userIngredients.length > 0 && (
          <button
            onClick={() => router.push('/recipes')}
            className='text-sm text-orange-600 hover:text-orange-700 font-medium'
          >
            레시피 찾기 →
          </button>
        )}
      </div>

      {isLoading ? (
        <div className='text-center py-8'>
          <div className='text-2xl mb-2'>⏳</div>
          <p className='text-gray-500'>재료 목록을 불러오는 중...</p>
        </div>
      ) : userIngredients.length === 0 ? (
        <div className='text-center py-8'>
          <div className='text-4xl mb-4'>🥕</div>
          <p className='text-gray-500 mb-2'>아직 재료가 없어요</p>
          <p className='text-sm text-gray-400'>냉장고에 있는 재료를 추가해보세요!</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {userIngredients.map((userIngredient, index) => (
            <div
              key={userIngredient.id || `${userIngredient.ingredientId}-${index}`}
              className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center space-x-3'>
                <div className='text-lg'>🥗</div>
                <span className='font-medium text-gray-800'>
                  {userIngredient.ingredient.name}
                </span>
              </div>
              <button
                onClick={() => onRemoveIngredient(userIngredient.id)}
                className='text-red-500 hover:text-red-700 p-1'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
