'use client';

import React, { useState } from 'react';

import { Recipe } from '@/domain/repositories/RecipesRepository';

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  matchingIngredients?: string[];
  missingIngredients?: string[];
}

export default function RecipeModal({ 
  recipe, 
  isOpen, 
  onClose,
  matchingIngredients = [],
  missingIngredients = [],
}: RecipeModalProps) {
  const [selectedMealTime, setSelectedMealTime] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSaveCookingRecord = async () => {
    if (!selectedMealTime) {
      alert('식사 시간을 선택해주세요.');
      return;
    }

    try {
      // TODO: 요리 기록 저장 API 호출
      console.log('요리 기록 저장:', {
        recipeId: recipe.id,
        mealTime: selectedMealTime,
        date: selectedDate,
      });
      
      alert('요리 기록이 저장되었습니다!');
      onClose();
    } catch (error) {
      console.error('요리 기록 저장 실패:', error);
      alert('요리 기록 저장에 실패했습니다.');
    }
  };

  const openYouTubeVideo = () => {
    window.open(recipe.link, '_blank');
  };

  const getMealTimeLabel = (mealTime: string) => {
    switch (mealTime) {
    case 'breakfast': return '아침';
    case 'lunch': return '점심';
    case 'dinner': return '저녁';
    default: return mealTime;
    }
  };

  return (
    <div 
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-800'>레시피 상세</h2>
            <button 
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 text-2xl'
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* 썸네일 및 제목 */}
          <div className='mb-6'>
            <div className='w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4'>
              {recipe.thumbnail ? (
                <img 
                  src={recipe.thumbnail} 
                  alt={recipe.title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-4xl'>
                  🍳
                </div>
              )}
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>{recipe.title}</h3>
          </div>

          {/* 전체 재료 목록 */}
          <div className='mb-6'>
            <h4 className='text-md font-semibold text-gray-800 mb-3'>필요한 재료</h4>
            
            {/* 보유 재료 */}
            {matchingIngredients.length > 0 && (
              <div className='mb-4'>
                <span className='text-sm text-green-600 font-medium mb-2 block'>보유 재료:</span>
                <div className='flex flex-wrap gap-2'>
                  {matchingIngredients.map((ingredient, idx) => (
                    <span 
                      key={idx}
                      className='text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full'
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 부족한 재료 */}
            {missingIngredients.length > 0 && (
              <div className='mb-4'>
                <span className='text-sm text-red-600 font-medium mb-2 block'>구매 필요:</span>
                <div className='flex flex-wrap gap-2'>
                  {missingIngredients.map((ingredient, idx) => (
                    <span 
                      key={idx}
                      className='text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full'
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 식사 시간 선택 */}
          <div className='mb-6'>
            <h4 className='text-md font-semibold text-gray-800 mb-3'>식사 시간</h4>
            <div className='grid grid-cols-3 gap-2'>
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealTime) => (
                <button
                  key={mealTime}
                  onClick={() => setSelectedMealTime(mealTime)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedMealTime === mealTime
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getMealTimeLabel(mealTime)}
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 선택 */}
          <div className='mb-6'>
            <h4 className='text-md font-semibold text-gray-800 mb-3'>날짜</h4>
            <input
              type='date'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            />
          </div>

          {/* 액션 버튼들 */}
          <div className='space-y-3'>
            <button
              onClick={openYouTubeVideo}
              className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2'
            >
              <span>🎥</span>
              <span>유튜브에서 레시피 보기</span>
            </button>
            
            <button
              onClick={handleSaveCookingRecord}
              disabled={!selectedMealTime}
              className={`w-full font-medium py-3 px-6 rounded-lg transition-colors ${
                selectedMealTime
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              요리 기록 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
