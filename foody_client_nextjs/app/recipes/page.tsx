'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { RecipesRepository, Recipe } from '@/domain/repositories/RecipesRepository';
import { UserIngredientsRepository, UserIngredient } from '@/domain/repositories/UserIngredientsRepository';

interface RecipeWithMatch extends Recipe {
  matchingIngredients: string[];
  missingIngredients: string[];
  matchRate: number;
}

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeWithMatch[]>([]);
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'match' | 'title'>('match');
  
  const userIngredientsRepo = new UserIngredientsRepository();
  const recipesRepo = new RecipesRepository();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session) {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // 사용자 재료와 레시피 데이터 병렬 로딩
      const [userIngredientsData, recipesData] = await Promise.all([
        userIngredientsRepo.getUserIngredients(),
        recipesRepo.getRecipesWithIngredients(),
      ]);

      setUserIngredients(userIngredientsData);

      // 레시피 매칭 로직
      const recipesWithMatch = calculateRecipeMatches(recipesData, userIngredientsData);
      setRecipes(recipesWithMatch);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRecipeMatches = (
    recipes: Recipe[],
    userIngredients: UserIngredient[],
  ): RecipeWithMatch[] => {
    const userIngredientNames = userIngredients.map((ui) => ui.ingredient.name.toLowerCase());

    return recipes.map((recipe) => {
      const recipeIngredientNames = recipe.ingredients.map((ri) =>
        ri.ingredient.name.toLowerCase(),
      );

      const matchingIngredients = recipeIngredientNames.filter((name) =>
        userIngredientNames.includes(name),
      );

      const missingIngredients = recipeIngredientNames.filter(
        (name) => !userIngredientNames.includes(name),
      );

      const matchRate =
        recipeIngredientNames.length > 0
          ? (matchingIngredients.length / recipeIngredientNames.length) * 100
          : 0;

      return {
        ...recipe,
        matchingIngredients,
        missingIngredients,
        matchRate,
      };
    });
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === 'match') {
      return b.matchRate - a.matchRate;
    }
    return a.title.localeCompare(b.title);
  });

  const openYouTubeVideo = (link: string) => {
    window.open(link, '_blank');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍳</div>
          <p className="text-gray-600">레시피를 찾고 있어요...</p>
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
              <button
                onClick={() => router.push('/fridge')}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-2xl">🔍</div>
              <h1 className="text-xl font-bold text-gray-800">레시피 추천</h1>
            </div>
            <div className="text-sm text-gray-500">재료 {userIngredients.length}개</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">정렬</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'match' | 'title')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="match">매칭율 순</option>
              <option value="title">제목 순</option>
            </select>
          </div>
        </div>

        {/* 레시피 목록 */}
        {sortedRecipes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">🤔</div>
            <p className="text-gray-600 mb-2">추천할 레시피가 없어요</p>
            <p className="text-sm text-gray-400 mb-4">냉장고에 재료를 더 추가해보세요</p>
            <button
              onClick={() => router.push('/fridge')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              재료 추가하기 →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openYouTubeVideo(recipe.link)}
              >
                <div>
                  {/* 썸네일 */}
                  <div className="w-full h-40 bg-gray-200 rounded-t-xl overflow-hidden">
                    {recipe.thumbnail ? (
                      <img
                        src={recipe.thumbnail}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍳
                      </div>
                    )}
                  </div>

                  {/* 레시피 정보 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            recipe.matchRate >= 80
                              ? 'bg-green-100 text-green-800'
                              : recipe.matchRate >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {recipe.matchRate.toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* 재료 정보 */}
                    <div className="space-y-2">
                      {recipe.matchingIngredients.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600">보유:</span>
                          <div className="flex flex-wrap gap-1">
                            {recipe.matchingIngredients.slice(0, 3).map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                              >
                                {ingredient}
                              </span>
                            ))}
                            {recipe.matchingIngredients.length > 3 && (
                              <span className="text-xs text-green-600">
                                +{recipe.matchingIngredients.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {recipe.missingIngredients.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-red-600">필요:</span>
                          <div className="flex flex-wrap gap-1">
                            {recipe.missingIngredients.slice(0, 3).map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                              >
                                {ingredient}
                              </span>
                            ))}
                            {recipe.missingIngredients.length > 3 && (
                              <span className="text-xs text-red-600">
                                +{recipe.missingIngredients.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
