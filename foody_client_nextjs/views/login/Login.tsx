'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()
  
  if (session) {
    return (
      <>
        {session.user?.name}님 환영합니다 <br />
        <button onClick={() => signOut()}>로그아웃</button>
      </>
    )
  }
  
  return (
    <>
      <button onClick={() => signIn('google', { callbackUrl: '/' })}>
        Google로 로그인
      </button>
    </>
  )
}

