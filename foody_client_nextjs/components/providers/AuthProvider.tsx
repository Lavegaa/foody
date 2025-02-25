'use client';

import { useEffect } from 'react';

import { signOut } from 'next-auth/react';

import { useAuthStore } from '@/stores/useAuthStore';
export default function AuthProvider({ initialData }: { initialData: any }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!initialData) {
      signOut();
      return;
    }
    setUser(initialData); // 서버에서 prefetch한 데이터로 초기화
  }, [initialData, setUser]);

  return null;
}
