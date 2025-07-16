import React from 'react';

interface RecipeFilterProps {
  sortBy: 'match' | 'title';
  onSortChange: (sortBy: 'match' | 'title') => void;
}

export default function RecipeFilter({ sortBy, onSortChange }: RecipeFilterProps) {
  return (
    <div className='bg-white rounded-xl shadow-sm p-4 mb-6'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-gray-700'>정렬</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'match' | 'title')}
          className='text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
        >
          <option value='match'>매칭율 순</option>
          <option value='title'>제목 순</option>
        </select>
      </div>
    </div>
  );
}
