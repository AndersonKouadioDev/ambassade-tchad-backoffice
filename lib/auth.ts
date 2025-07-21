import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.userType = user.userType
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.userType = token.userType as string
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
      }
      return session
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          otpCode: { label: "OTP Code", type: "text" },
          step: { label: "Step", type: "text" },
          userProfile: { label: "User Profile", type: "text" },
          accessToken: { label: "Access Token", type: "text" },
          refreshToken: { label: "Refresh Token", type: "text" },
        },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          // Si le mot de passe est 'authenticated', cela signifie que l'utilisateur
          // a déjà été authentifié via TanStack Query et on synchronise avec NextAuth
          if (credentials.password === 'authenticated') {
            // Utiliser les informations passées via les credentials
            if (credentials.userProfile && credentials.accessToken) {
              const user = JSON.parse(credentials.userProfile);
              return {
                id: user.id?.toString() || '1',
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
                userType: user.type || 'PERSONNEL',
                role: user.role || 'USER',
                accessToken: credentials.accessToken,
                refreshToken: credentials.refreshToken || '',
              };
            }
            
            // Fallback si pas d'informations complètes
            return {
              id: '1',
              email: credentials.email,
              name: credentials.email,
              userType: 'PERSONNEL',
              role: 'USER',
              accessToken: 'synced-token',
              refreshToken: 'synced-refresh-token',
            };
          }
          
          // Authentification de test pour le développement
          if (credentials.email === "ambassade@tchad.ci" && credentials.password === "password") {
            return {
              id: "1",
              email: credentials.email,
              name: "Ambassade du Tchad",
              userType: "PERSONNEL",
              role: "ADMIN",
              accessToken: "temp-token",
              refreshToken: "temp-refresh-token",
            };
          }
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
