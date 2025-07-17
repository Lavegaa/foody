import React, { useState, useEffect } from 'react';

import IngredientSearchModal from './IngredientSearchModal';
import { UserIngredientsRepository, UserIngredient } from '@/domain/repositories/UserIngredientsRepository';

interface FridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngredientUpdate?: () => void;
}

export default function FridgeModal({ isOpen, onClose, onIngredientUpdate }: FridgeModalProps) {
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const userIngredientsRepo = new UserIngredientsRepository();

  const fetchUserIngredients = async () => {
    try {
      setIsLoading(true);
      const ingredients = await userIngredientsRepo.getUserIngredients();
      setUserIngredients(ingredients);
    } catch (error) {
      console.error('재료 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = async (ingredient: string) => {
    try {
      setIsAdding(true);
      await userIngredientsRepo.addUserIngredients([{ name: ingredient }]);
      await fetchUserIngredients();
      onIngredientUpdate?.();
    } catch (error) {
      console.error('재료 추가 실패:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const removeIngredient = async (ingredientId: string) => {
    try {
      console.log('Deleting ingredient with ID:', ingredientId);
      await userIngredientsRepo.removeUserIngredient(ingredientId);
      console.log('Ingredient deleted successfully');
      await fetchUserIngredients();
      onIngredientUpdate?.();
    } catch (error) {
      console.error('재료 삭제 실패:', error);
      // TODO: Add user-visible error feedback
    }
  };

  const handleAdd = async () => {
    if (!newIngredient.trim()) return;
    await addIngredient(newIngredient.trim());
    setNewIngredient('');
  };

  const handleSelectFromSearch = async (ingredientName: string) => {
    await addIngredient(ingredientName);
    setIsSearchModalOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserIngredients();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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
            <div className='flex items-center space-x-3'>
              <div className='text-2xl'>🧊</div>
              <h2 className='text-lg font-semibold text-gray-800'>내 냉장고</h2>
            </div>
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
          {/* 재료 추가 섹션 */}
          <div className='mb-6'>
            <h3 className='text-md font-semibold text-gray-800 mb-3'>재료 추가하기</h3>
            
            {/* 검색 버튼 */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className='w-full mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center'
            >
              <div className='flex items-center justify-center space-x-2'>
                <span className='text-2xl'>🔍</span>
                <span className='text-gray-600 font-medium'>재료 검색하여 추가하기</span>
              </div>
            </button>

            {/* 직접 입력 */}
            <div className='flex space-x-2'>
              <input
                type='text'
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder='또는 직접 입력하세요'
                className='flex-1 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                disabled={isAdding}
              />
              <button
                onClick={handleAdd}
                disabled={isAdding || !newIngredient.trim()}
                className='px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:text-gray-200 text-white font-medium rounded-lg transition-colors'
              >
                {isAdding ? '...' : '추가'}
              </button>
            </div>
          </div>

          {/* 보유 재료 목록 */}
          <div className='mb-6'>
            <h3 className='text-md font-semibold text-gray-800 mb-3'>
              보유 재료 ({userIngredients.length}개)
            </h3>

            {isLoading ? (
              <div className='text-center py-8'>
                <div className='text-2xl mb-2'>⏳</div>
                <p className='text-gray-600'>재료 목록을 불러오는 중...</p>
              </div>
            ) : userIngredients.length === 0 ? (
              <div className='text-center py-8'>
                <div className='text-4xl mb-4'>🥕</div>
                <p className='text-gray-600 mb-2'>아직 재료가 없어요</p>
                <p className='text-sm text-gray-600'>냉장고에 있는 재료를 추가해보세요!</p>
              </div>
            ) : (
              <div className='space-y-2 max-h-60 overflow-y-auto'>
                {userIngredients.map((userIngredient, index) => (
                  <div
                    key={userIngredient.id || `${userIngredient.ingredientId}-${index}`}
                    className='flex items-center justify-between p-3 bg-gray-100 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='text-lg'>🥗</div>
                      <span className='font-medium text-gray-800'>
                        {userIngredient.ingredient.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeIngredient(userIngredient.ingredientId)}
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

          {/* 완료 버튼 */}
          <button
            onClick={onClose}
            className='w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
          >
            완료
          </button>
        </div>
      </div>

      {/* 재료 검색 모달 */}
      <IngredientSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectIngredient={handleSelectFromSearch}
      />
    </div>
  );
}
