import type { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

import { Geist, Geist_Mono } from 'next/font/google';

import AuthProvider from '@/components/providers/AuthProvider';
import Providers from '@/components/providers/Providers';
import './globals.css';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Foody',
  description: 'Foody',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let userData = null;
  try {
    const response = await fetch('http://localhost:4000/v1/auth/me', {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        Cookie: (await headers()).get('cookie') ?? '',
      },
    });

    if (response.ok) {
      userData = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider initialData={userData} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
