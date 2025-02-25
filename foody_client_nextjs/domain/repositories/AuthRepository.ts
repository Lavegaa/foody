import { SignInResponse } from '../models/authModel';
import { post } from '@/utils/fetch';
export class AuthRepository {
  async signIn(idToken: string) {
    const response = await post<SignInResponse>('/v1/auth/google/signin', {
      idToken,
    });
    return response;
  }
}
