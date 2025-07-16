'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { UserIngredientsRepository, UserIngredient } from '@/domain/repositories/UserIngredientsRepository';

export default function FridgePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  
  const userIngredientsRepo = new UserIngredientsRepository();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session) {
      fetchUserIngredients();
    }
  }, [session, status, router]);

  const fetchUserIngredients = async () => {
    try {
      setIsLoading(true);
      const data = await userIngredientsRepo.getUserIngredients();
      setUserIngredients(data);
    } catch (error) {
      console.error('재료 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = async () => {
    if (!newIngredient.trim()) return;

    try {
      setIsAddingIngredient(true);
      await userIngredientsRepo.addUserIngredients([{ name: newIngredient.trim() }]);
      setNewIngredient('');
      await fetchUserIngredients();
    } catch (error) {
      console.error('재료 추가 실패:', error);
    } finally {
      setIsAddingIngredient(false);
    }
  };

  const removeIngredient = async (ingredientId: string) => {
    try {
      await userIngredientsRepo.removeUserIngredient(ingredientId);
      await fetchUserIngredients();
    } catch (error) {
      console.error('재료 삭제 실패:', error);
    }
  };

  const navigateToRecipes = () => {
    router.push('/recipes');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍳</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🧊</div>
              <h1 className="text-xl font-bold text-gray-800">내 냉장고</h1>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              설정
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 재료 추가 섹션 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">재료 추가하기</h2>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="재료명을 입력하세요 (예: 양파, 당근)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              disabled={isAddingIngredient}
            />
            <button
              onClick={addIngredient}
              disabled={isAddingIngredient || !newIngredient.trim()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
            >
              {isAddingIngredient ? '...' : '추가'}
            </button>
          </div>
        </div>

        {/* 현재 재료 목록 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              보유 재료 ({userIngredients.length}개)
            </h2>
            {userIngredients.length > 0 && (
              <button
                onClick={navigateToRecipes}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                레시피 찾기 →
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-gray-500">재료 목록을 불러오는 중...</p>
            </div>
          ) : userIngredients.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🥕</div>
              <p className="text-gray-500 mb-2">아직 재료가 없어요</p>
              <p className="text-sm text-gray-400">냉장고에 있는 재료를 추가해보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userIngredients.map((userIngredient, index) => (
                <div
                  key={userIngredient.id || `${userIngredient.ingredientId}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">🥗</div>
                    <span className="font-medium text-gray-800">
                      {userIngredient.ingredient.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeIngredient(userIngredient.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 레시피 찾기 버튼 */}
        {userIngredients.length > 0 && (
          <button
            onClick={navigateToRecipes}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-xl transition-colors shadow-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🔍</span>
              <span>레시피 찾기 ({userIngredients.length}개 재료)</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
