'use client';

import Link from 'next/link';
import React from 'react';

import { overlay } from 'overlay-kit';

import IngredientModal from '../IngredientModal/IngredientModal';

interface HeaderProps {
  onManageIngredients?: () => void;
}

export default function Header({ onManageIngredients }: HeaderProps) {
  const handleManageIngredients = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <IngredientModal isOpen={isOpen} onClose={close} ingredients={[]} />
    ));
  };
  return (
    <header className="flex justify-between items-center bg-gray-50 px-4 py-2.5">
      <Link href="/" className="font-bold text-black text-xl">
        Foody
      </Link>
      
      <button
        onClick={handleManageIngredients}
        className="bg-blue-500 hover:bg-blue-600 px-2.5 py-2.5 rounded-[20px] w-[80px] h-[40px] font-medium text-white text-sm transition-colors"
      >
        재료관리
      </button>
    </header>
  );
}
