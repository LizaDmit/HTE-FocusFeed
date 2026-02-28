import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        if (process.env.USE_MOCK_DATA === "true") {
          const mockUsers = [
            { id: "user-1", username: "alice", password: "password123" },
            { id: "user-2", username: "bob", password: "password123" },
            { id: "user-3", username: "charlie", password: "password123" },
          ];
          const user = mockUsers.find(
            (u) => u.username === credentials.username && u.password === credentials.password
          );
          if (user) return { id: user.id, name: user.username };
          return null;
        }

        try {
          const { prisma } = await import("@/lib/prisma");
          const { compare } = await import("bcryptjs");
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });
          if (!user) return null;
          const valid = await compare(credentials.password, user.passwordHash);
          if (!valid) return null;
          return { id: user.id, name: user.username };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        session.user.name = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
