'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { OverlayProvider } from 'overlay-kit';

import AuthProvider from './AuthProvider';

export default function Providers({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: any;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
        retry: 1,
      },
    },
  });
  return (
    <SessionProvider>
      <AuthProvider initialData={userData} />
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>{children}</OverlayProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
