import React from 'react';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  emoji,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
      <div className='text-4xl mb-4'>{emoji}</div>
      <p className='text-gray-600 mb-2'>{title}</p>
      <p className='text-sm text-gray-600 mb-4'>{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className='text-orange-600 hover:text-orange-700 font-medium'
        >
          {actionText} →
        </button>
      )}
    </div>
  );
}
