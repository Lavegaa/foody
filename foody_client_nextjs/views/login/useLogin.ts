import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { signOut, useSession } from 'next-auth/react';

import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { useAuthStore } from '@/stores/useAuthStore';

export default function useLogin() {
  const { data: session, status } = useSession();
  const { user } = useAuthStore();

  const signinCallback = async () => {
    if (status === 'authenticated' && session.id_token && !user) {
      try {
        const authRepository = new AuthRepository();
        const response = await authRepository.signIn(session.id_token);

        if (!response) {
          throw new Error('Server auth failed');
        }
      } catch (error) {
        console.error('Server auth error:', error);
        signOut();
      }
      redirect('/');
    }
  };

  useEffect(() => {
    signinCallback();
  }, [session, status]);
}
