import React, { useState } from 'react';

interface IngredientAdderProps {
  onAddIngredient: (ingredient: string) => Promise<void>;
}

export default function IngredientAdder({ onAddIngredient }: IngredientAdderProps) {
  const [newIngredient, setNewIngredient] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newIngredient.trim()) return;

    try {
      setIsAdding(true);
      await onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>재료 추가하기</h2>
      <div className='flex space-x-2'>
        <input
          type='text'
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder='재료명을 입력하세요 (예: 양파, 당근)'
          className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900'
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
  );
}
