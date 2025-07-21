import { api } from '@/lib/api-http';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    type: 'DEMANDEUR' | 'PERSONNEL';
    role?: 'AGENT' | 'CHEF_SERVICE' | 'CONSUL' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE';
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  type: 'DEMANDEUR' | 'PERSONNEL';
  role?: 'AGENT' | 'CHEF_SERVICE' | 'CONSUL' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface RegisterClientData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// Interface CreateUserData déplacée vers users.service.ts pour éviter la duplication

export interface CompleteLoginData {
  email: string;
  otpCode: string;
}

export interface ResetPasswordData {
  email: string;
  otpCode: string;
  newPassword: string;
}

// Service d'authentification
export class AuthService {
  // Connexion directe avec email/password (sans OTP)
  static async signIn(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post('/auth/signin', credentials);
    return data;
  }

  // Méthode obsolète - gardée pour compatibilité
  static async completeLogin(loginData: CompleteLoginData): Promise<LoginResponse> {
    const { data } = await api.post('/auth/complete-login', loginData);
    return data;
  }

  // Inscription d'un nouveau client
  static async registerClient(clientData: RegisterClientData): Promise<{ message: string }> {
    const { data } = await api.post('/auth/register', clientData);
    return data;
  }

  // Méthode createUser déplacée vers UsersService pour éviter la duplication

  // Demande de reset de mot de passe (envoie OTP)
  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    const { data } = await api.post('/auth/request-password-reset-otp', { email });
    return data;
  }

  // Reset du mot de passe avec OTP
  static async resetPassword(resetData: ResetPasswordData): Promise<{ message: string }> {
    const { data } = await api.post('/auth/reset-password', resetData);
    return data;
  }

  // Rafraîchir le token
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const { data } = await api.post('/auth/refresh');
    return data;
  }

  // Obtenir le profil utilisateur depuis la session NextAuth
  static async getProfile(): Promise<UserProfile> {
    // Les informations utilisateur sont maintenant dans la session NextAuth
    // Cette méthode est conservée pour la compatibilité mais pourrait être supprimée
    const { data } = await api.get('/auth/profile');
    return data;
  }

  // Déconnexion (gérée par NextAuth.js)
  static async signOut(): Promise<void> {
    // La déconnexion est maintenant gérée par NextAuth.js
    // Cette méthode est conservée pour la compatibilité
    return Promise.resolve();
  }
}