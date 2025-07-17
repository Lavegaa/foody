import React, { useState, useEffect } from 'react';

import { IngredientsRepository, Ingredient } from '@/domain/repositories/IngredientsRepository';

interface IngredientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIngredient: (ingredient: string) => void;
}

export default function IngredientSearchModal({ 
  isOpen, 
  onClose, 
  onSelectIngredient, 
}: IngredientSearchModalProps) {
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customIngredient, setCustomIngredient] = useState('');

  const ingredientsRepo = new IngredientsRepository();

  useEffect(() => {
    if (isOpen) {
      fetchAllIngredients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredIngredients(allIngredients.slice(0, 20)); // 처음에는 20개만 표시
    } else {
      const filtered = allIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredIngredients(filtered);
    }
  }, [searchTerm, allIngredients]);

  const fetchAllIngredients = async () => {
    try {
      setIsLoading(true);
      const ingredients = await ingredientsRepo.getAllIngredients();
      setAllIngredients(ingredients);
      setFilteredIngredients(ingredients.slice(0, 20));
    } catch (error) {
      console.error('재료 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIngredient = (ingredientName: string) => {
    onSelectIngredient(ingredientName);
    onClose();
    setSearchTerm('');
    setCustomIngredient('');
  };

  const handleAddCustomIngredient = () => {
    const ingredientToAdd = customIngredient.trim() || searchTerm.trim();
    console.log('Adding custom ingredient:', { customIngredient, searchTerm, ingredientToAdd });
    if (ingredientToAdd) {
      onSelectIngredient(ingredientToAdd);
      onClose();
      setSearchTerm('');
      setCustomIngredient('');
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hasExactMatch = filteredIngredients.some(
    ingredient => ingredient.name.toLowerCase() === searchTerm.toLowerCase(),
  );

  return (
    <div 
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden'>
        {/* Header */}
        <div className='border-b px-6 py-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-800'>재료 선택</h2>
            <button 
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 text-2xl'
            >
              ×
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className='p-6 border-b'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='재료명을 검색하세요...'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900'
            autoFocus
          />
        </div>

        {/* Content */}
        <div className='max-h-60 overflow-y-auto'>
          {isLoading ? (
            <div className='text-center py-8'>
              <div className='text-2xl mb-2'>⏳</div>
              <p className='text-gray-600'>재료 목록을 불러오는 중...</p>
            </div>
          ) : (
            <div className='p-4'>
              {filteredIngredients.length > 0 ? (
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-gray-600 mb-3'>기존 재료</h3>
                  {filteredIngredients.map((ingredient) => (
                    <button
                      key={ingredient.id}
                      onClick={() => handleSelectIngredient(ingredient.name)}
                      className='w-full text-left p-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors flex items-center space-x-3'
                    >
                      <div className='text-lg'>🥗</div>
                      <span className='font-medium text-gray-800'>{ingredient.name}</span>
                    </button>
                  ))}
                </div>
              ) : searchTerm.trim() && (
                <div className='text-center py-4'>
                  <p className='text-gray-600 mb-4'>검색 결과가 없습니다</p>
                </div>
              )}
              
              {/* Custom ingredient section */}
              {searchTerm.trim() && !hasExactMatch && (
                <div className='mt-6 pt-4 border-t'>
                  <h3 className='text-sm font-medium text-gray-600 mb-3'>새 재료 추가</h3>
                  <div className='space-y-2'>
                    <input
                      type='text'
                      value={customIngredient || searchTerm}
                      onChange={(e) => setCustomIngredient(e.target.value)}
                      placeholder='새 재료명을 입력하세요'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900'
                    />
                    <button
                      onClick={handleAddCustomIngredient}
                      className='w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
                    >
                      새 재료 추가하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
