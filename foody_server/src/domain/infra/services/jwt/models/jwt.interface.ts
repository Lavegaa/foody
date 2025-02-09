import { TokenPayload } from 'google-auth-library';

export interface ITokenPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}


export interface Token {
  generate(payload: TokenPayload): IToken;
  verify(token: string): TokenPayload;
}
