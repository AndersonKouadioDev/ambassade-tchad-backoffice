import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { baseURL } from '@/config';
import axios from 'axios';

// Fonction pour décoder un JWT et vérifier s'il expire bientôt
function isTokenExpiring(token: string, thresholdMinutes: number = 5): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return timeUntilExpiration <= thresholdMs;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return true;
  }
}

// Fonction pour refresh le token avec l'endpoint GET
async function refreshAccessToken(refreshToken: string) {
  try {
    console.log('🔄 Tentative de refresh du token...');
    
    const response = await fetch(`${baseURL}/auth/refresh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Erreur lors du refresh:', response.status);
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Token refreshé avec succès');
    
    return {
      accessToken: data.accessToken,
      refreshToken: refreshToken, // Le backend ne renvoie pas de nouveau refresh token
    };
  } catch (error) {
    console.error('❌ Erreur lors du refresh:', error);
    throw error;
  }
}

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
      // Connexion initiale - stocker les tokens
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userType = user.userType
        token.role = user.role
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        console.log('🎫 JWT Token created:', {
          id: token.id,
          email: token.email,
          userType: token.userType,
          role: token.role
        });
        return token;
      }

      // Token pas encore expiré
      if (token.accessToken && !isTokenExpiring(token.accessToken as string)) {
        console.log('✅ Token encore valide');
        return token;
      }

      // Token expirant, tenter le refresh
      console.log('⚠️ Token expirant, tentative de refresh...');
      
      try {
        const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
        
        return {
          ...token,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
      } catch (error) {
        console.error('❌ Erreur lors du refresh automatique:', error);
        
        // En cas d'échec, retourner un token marqué comme expiré
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      if (token) {
        // Si il y a une erreur de refresh, la session est invalid
        if (token.error) {
          console.log('❌ Session invalidée à cause d\'une erreur de refresh');
          throw new Error('RefreshAccessTokenError');
        }
        
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
        session.user.userType = token.userType as string
        session.user.role = token.role as string
        console.log('📋 Session created:', {
          id: session.user.id,
          email: session.user.email,
          userType: session.user.userType,
          role: session.user.role
        });
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const response = await axios.post(`${baseURL}/api/v1/auth/signin`, {
            email: credentials.email,
            password: credentials.password,
          });
          
          console.log('🔐 Backend response:', JSON.stringify(response.data, null, 2));
          
          if (response.data && response.data.user) {
            const { user, accessToken, refreshToken } = response.data;
            console.log('👤 User data:', {
              id: user.id,
              email: user.email,
              type: user.type,
              userType: user.userType,
              role: user.role
            });
            
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.firstName + ' ' + user.lastName,
              image: user.avatar || null,
              accessToken,
              refreshToken,
              userType: user.type || user.userType, // Essayer les deux
              role: user.role,
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
