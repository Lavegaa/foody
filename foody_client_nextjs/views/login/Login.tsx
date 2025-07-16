'use client';

import React from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';

import useLogin from './useLogin';

export default function Login() {
  const { data: session } = useSession();
  useLogin();

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🍳</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Foody</h1>
            <p className="text-gray-600">냉장고 재료로 레시피 찾기</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              {session.user?.name}님 환영합니다!
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/fridge'}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              냉장고 관리하기
            </button>
            
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🍳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Foody</h1>
          <p className="text-gray-600 mb-6">냉장고 재료로 레시피 찾기</p>
          
          <div className="text-left space-y-2 text-sm text-gray-500 mb-8">
            <p>✨ 냉장고 속 재료 입력</p>
            <p>🔍 맞춤 레시피 추천</p>
            <p>📱 모바일 최적화</p>
          </div>
        </div>
        
        <button 
          onClick={() => signIn('google')}
          className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Google로 시작하기</span>
        </button>
      </div>
    </div>
  );
}
