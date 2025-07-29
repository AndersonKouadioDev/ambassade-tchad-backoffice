import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      type: UserType;
      status: UserStatus;
      isPasswordChangeRequired: boolean;
    } & DefaultSession["user"];
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    type: UserType;
    status: UserStatus;
    isPasswordChangeRequired: boolean;
    accessToken: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    type: UserType;
    status: UserStatus;
    isPasswordChangeRequired: boolean;
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}