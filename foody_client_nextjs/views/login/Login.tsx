'use client';

import React from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';

import useLogin from './useLogin';

export default function Login() {
  const { data: session } = useSession();
  useLogin();

  if (session) {
    return (
      <div className="flex flex-col justify-center items-center bg-white p-4 min-h-screen">
        <p className="text-gray-500 text-base">{session.user?.name}님 환영합니다</p>
        <button 
          onClick={() => signOut()}
          className="flex justify-center items-center gap-3 hover:bg-gray-50 mt-5 border border-gray-200 rounded-xl w-[300px] h-[56px]"
        >
          <span className="font-medium text-base">로그아웃</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-white p-4 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-5">
        <div className="bg-blue-500 rounded-3xl w-[200px] h-[200px]" />
        <h1 className="font-bold text-4xl">Foody</h1>
      </div>
      
      <button 
        onClick={() => signIn('google')}
        className="flex justify-center items-center gap-3 hover:bg-gray-50 border border-gray-200 rounded-xl w-[300px] h-[56px]"
      >
        <div className="bg-gray-300 w-6 h-6" />
        <span className="font-medium text-base">Google로 시작하기</span>
      </button>
      
      <p className="mt-5 text-gray-500 text-base">
        냉장고 속 재료로 만드는 맛있는 한 끼
      </p>
    </div>
  );
}
