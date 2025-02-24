import { useAuthStore } from '@/stores/useAuthStore';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function useLogin() {
  const { data: session, status } = useSession();
  const { user } = useAuthStore();

  const signinCallback = async () => {
    if (status === 'authenticated' && session.id_token && !user) {
      try {
        const response = await fetch('http://localhost:4000/v1/auth/google/signin', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: session.id_token }),
        });

        if (!response.ok) {
          console.error('Server auth failed');
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