import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from '@/server/db/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from '../../../env/server.mjs';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      console.log('User', user);
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.isRegistered = user.isRegistered;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);

