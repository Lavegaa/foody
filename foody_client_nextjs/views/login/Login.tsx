'use client';

import React from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';

import useLogin from './useLogin';

export default function Login() {
  const { data: session } = useSession();
  useLogin();

  if (session) {
    return (
      <>
        {session.user?.name}님 환영합니다 <br />
        <button onClick={() => signOut()}>로그아웃</button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => signIn('google')}>구글 로그인</button>
    </>
  );
}
