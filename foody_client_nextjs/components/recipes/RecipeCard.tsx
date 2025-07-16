import React from 'react';

import { Recipe } from '@/domain/repositories/RecipesRepository';

interface RecipeWithMatch extends Recipe {
  matchingIngredients: string[];
  missingIngredients: string[];
  matchRate: number;
}

interface RecipeCardProps {
  recipe: RecipeWithMatch;
  expandedRecipes: Set<string>;
  onRecipeClick: (recipe: RecipeWithMatch) => void;
  onToggleExpansion: (recipeId: string, e: React.MouseEvent) => void;
}

export default function RecipeCard({
  recipe,
  expandedRecipes,
  onRecipeClick,
  onToggleExpansion,
}: RecipeCardProps) {
  return (
    <div
      className='bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
      onClick={() => onRecipeClick(recipe)}
    >
      <div>
        {/* 썸네일 */}
        <div className='w-full h-40 bg-gray-200 rounded-t-xl overflow-hidden'>
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

        {/* 레시피 정보 */}
        <div className='p-4'>
          <div className='flex items-start justify-between mb-2'>
            <h3 className='font-medium text-gray-800 text-sm line-clamp-2'>
              {recipe.title}
            </h3>
            <div className='flex items-center space-x-1 ml-2'>
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
          <div className='space-y-2'>
            {recipe.matchingIngredients.length > 0 && (
              <div className='flex items-start space-x-2'>
                <span className='text-xs text-green-600 mt-1'>보유:</span>
                <div className='flex flex-wrap gap-1 flex-1'>
                  {(expandedRecipes.has(recipe.id) 
                    ? recipe.matchingIngredients 
                    : recipe.matchingIngredients.slice(0, 3)
                  ).map((ingredient, idx) => (
                    <span
                      key={idx}
                      className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded'
                    >
                      {ingredient}
                    </span>
                  ))}
                  {recipe.matchingIngredients.length > 3 && (
                    <button
                      onClick={(e) => onToggleExpansion(recipe.id, e)}
                      className='text-xs text-green-600 hover:text-green-700 font-medium'
                    >
                      {expandedRecipes.has(recipe.id) 
                        ? '접기' 
                        : `+${recipe.matchingIngredients.length - 3}`
                      }
                    </button>
                  )}
                </div>
              </div>
            )}

            {recipe.missingIngredients.length > 0 && (
              <div className='flex items-start space-x-2'>
                <span className='text-xs text-red-600 mt-1'>필요:</span>
                <div className='flex flex-wrap gap-1 flex-1'>
                  {(expandedRecipes.has(recipe.id) 
                    ? recipe.missingIngredients 
                    : recipe.missingIngredients.slice(0, 3)
                  ).map((ingredient, idx) => (
                    <span
                      key={idx}
                      className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded'
                    >
                      {ingredient}
                    </span>
                  ))}
                  {recipe.missingIngredients.length > 3 && (
                    <button
                      onClick={(e) => onToggleExpansion(recipe.id, e)}
                      className='text-xs text-red-600 hover:text-red-700 font-medium'
                    >
                      {expandedRecipes.has(recipe.id) 
                        ? '접기' 
                        : `+${recipe.missingIngredients.length - 3}`
                      }
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
