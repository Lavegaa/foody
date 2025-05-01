'use client';

import React from 'react';

interface Ingredient {
  id: string;
  name: string;
}

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  // onAddIngredient: () => void;
  // onDeleteIngredient: (id: string) => void;
}

export default function IngredientModal({
  isOpen,
  onClose,
  ingredients = [],
  // onAddIngredient,
  // onDeleteIngredient,
}: IngredientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-[345px]">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center px-4 py-2.5 h-[56px]">
          <h2 className="font-semibold text-black text-lg">내 재료 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base"
          >
            닫기
          </button>
        </div>

        {/* 재료 리스트 */}
        <div className="flex flex-col gap-3 px-4 py-4 h-[344px] overflow-y-auto">
          {/* 재료 추가 버튼 */}
          <button
            // onClick={onAddIngredient}
            className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-lg w-[313px] h-[48px] text-gray-600 text-base"
          >
            + 재료 추가하기
          </button>

          {/* 재료 목록 */}
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex justify-between items-center px-4 py-2.5 w-[313px] h-[48px]"
            >
              <span className="text-base">{ingredient.name}</span>
              <button
                // onClick={() => onDeleteIngredient(ingredient.id)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
