import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  emoji?: string;
}

export default function LoadingSpinner({ 
  message = '로딩 중...', 
  emoji = '🍳', 
}: LoadingSpinnerProps) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-4xl mb-4'>{emoji}</div>
        <p className='text-gray-600'>{message}</p>
      </div>
    </div>
  );
}
