import { useRouter } from 'next/navigation';
import React from 'react';

export default function FridgeHeader() {
  const router = useRouter();

  return (
    <div className='bg-white shadow-sm border-b'>
      <div className='max-w-md mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='text-2xl'>🧊</div>
            <h1 className='text-xl font-bold text-gray-800'>내 냉장고</h1>
          </div>
          <button
            onClick={() => router.push('/login')}
            className='text-sm text-gray-500 hover:text-gray-700'
          >
            설정
          </button>
        </div>
      </div>
    </div>
  );
}
