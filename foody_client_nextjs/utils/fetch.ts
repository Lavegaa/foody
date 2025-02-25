import { signOut } from 'next-auth/react';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// API 호출 함수
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const url = `${API_URL}${endpoint}`;

  try {
    let response = await fetch(url, {
      ...fetchOptions,
      credentials: 'include', // 항상 쿠키 포함
    });

    // 401 에러 처리 (토큰 만료)
    if (response.status === 401 && !skipAuth) {
      // 리프레시 토큰 요청
      const refreshResponse = await fetch(`${API_URL}/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      });

      if (refreshResponse.ok) {
        // 리프레시 성공 - 원래 요청 재시도
        response = await fetch(url, {
          ...fetchOptions,
          credentials: 'include',
        });
      } else {
        // 리프레시 실패 시 로그아웃
        signOut({ callbackUrl: '/login' });
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
    }

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    // 응답이 JSON이 아닐 경우 처리
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
}

// GET 요청 헬퍼 함수
export function get<T>(endpoint: string, options: FetchOptions = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'GET' });
}

// POST 요청 헬퍼 함수
export function post<T>(endpoint: string, data: any, options: FetchOptions = {}) {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}

// PUT 요청 헬퍼 함수
export function put<T>(endpoint: string, data: any, options: FetchOptions = {}) {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}

// DELETE 요청 헬퍼 함수
export function del<T>(endpoint: string, options: FetchOptions = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
}
