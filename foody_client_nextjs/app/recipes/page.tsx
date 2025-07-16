'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RecipeCard from '@/components/recipes/RecipeCard';
import RecipeFilter from '@/components/recipes/RecipeFilter';
import RecipeHeader from '@/components/recipes/RecipeHeader';
import RecipeModal from '@/components/recipes/RecipeModal';
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
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);
  
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

  const openRecipeModal = (recipe: RecipeWithMatch) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const toggleRecipeExpansion = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 충돌 방지
    setExpandedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner message='레시피를 찾고 있어요...' />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <RecipeHeader userIngredientsCount={userIngredients.length} />

      <div className='max-w-md mx-auto px-4 py-6'>
        <RecipeFilter sortBy={sortBy} onSortChange={setSortBy} />

        {sortedRecipes.length === 0 ? (
          <EmptyState
            emoji='🤔'
            title='추천할 레시피가 없어요'
            description='냉장고에 재료를 더 추가해보세요'
            actionText='재료 추가하기'
            onAction={() => router.push('/fridge')}
          />
        ) : (
          <div className='space-y-4'>
            {sortedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                expandedRecipes={expandedRecipes}
                onRecipeClick={openRecipeModal}
                onToggleExpansion={toggleRecipeExpansion}
              />
            ))}
          </div>
        )}
      </div>

      {/* 레시피 모달 */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={closeRecipeModal}
          matchingIngredients={selectedRecipe.matchingIngredients}
          missingIngredients={selectedRecipe.missingIngredients}
        />
      )}
    </div>
  );
}
