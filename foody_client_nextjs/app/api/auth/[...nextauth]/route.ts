import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      // Google이 인증 후 authorization code를 제공
      console.log('account', account);
      const idToken = account?.id_token;
      const token = 'test';
      // 이 코드를 우리 서버로 전달
      const response = await fetch('http://localhost:4000/v1/auth/google/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idToken: idToken }),
      });
      console.log('response', response);
      return true;
    },
  },
}

// GET과 POST 핸들러를 export
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 