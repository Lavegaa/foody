import React, { useState } from 'react';

interface RecipeFilterProps {
  sortBy: 'match' | 'title';
  onSortChange: (sortBy: 'match' | 'title') => void;
}

export default function RecipeFilter({ sortBy, onSortChange }: RecipeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'match', label: '매칭율 순' },
    { value: 'title', label: '제목 순' },
  ];

  const currentOption = sortOptions.find(option => option.value === sortBy);

  const handleOptionClick = (value: 'match' | 'title') => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className='bg-white rounded-xl shadow-sm p-4 mb-6'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-gray-700'>정렬</span>
        <div className='relative'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-sm border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white cursor-pointer min-w-[100px] text-left'
          >
            {currentOption?.label}
          </button>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
          
          {isOpen && (
            <div className='absolute top-full right-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value as 'match' | 'title')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    sortBy === option.value 
                      ? 'bg-orange-50 text-orange-600 font-medium' 
                      : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 드롭다운이 열렸을 때 배경 클릭으로 닫기 */}
      {isOpen && (
        <div 
          className='fixed inset-0 z-40' 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
