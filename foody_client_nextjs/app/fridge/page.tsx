'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import FridgeHeader from '@/components/fridge/FridgeHeader';
import IngredientAdder from '@/components/fridge/IngredientAdder';
import IngredientList from '@/components/fridge/IngredientList';
import RecipeFinderButton from '@/components/fridge/RecipeFinderButton';
import { UserIngredientsRepository, UserIngredient } from '@/domain/repositories/UserIngredientsRepository';

export default function FridgePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const addIngredient = async (ingredient: string) => {
    try {
      await userIngredientsRepo.addUserIngredients([{ name: ingredient }]);
      await fetchUserIngredients();
    } catch (error) {
      console.error('재료 추가 실패:', error);
    }
  };

  const removeIngredient = async (ingredientId: string) => {
    try {
      console.log('Deleting ingredient with ID:', ingredientId);
      await userIngredientsRepo.removeUserIngredient(ingredientId);
      console.log('Ingredient deleted successfully');
      await fetchUserIngredients();
    } catch (error) {
      console.error('재료 삭제 실패:', error);
      // TODO: Add user-visible error feedback
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <FridgeHeader />

      <div className='max-w-md mx-auto px-4 py-6'>
        <IngredientAdder onAddIngredient={addIngredient} />
        <IngredientList
          userIngredients={userIngredients}
          isLoading={isLoading}
          onRemoveIngredient={removeIngredient}
        />
        <RecipeFinderButton ingredientCount={userIngredients.length} />
      </div>
    </div>
  );
}
