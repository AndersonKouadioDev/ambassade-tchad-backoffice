'use server'

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

// Cette action servira pour la compatibilité NextAuth temporaire
// En production, l'authentification se fera principalement via les hooks TanStack Query côté client
export const loginUser = async (data: any) => {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    
    if (result) {
      redirect("/dashboard/analytics");
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants invalides" };
        default:
          return { error: "Erreur d'authentification" };
      }
    }
    
    // Si c'est une redirection, on la laisse passer
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    
    console.error("Login error:", error);
    return { error: "Erreur lors de la connexion" };
  }
};

// Action pour la première étape de connexion (envoi OTP)
export const initiateLogin = async (email: string, password: string) => {
  try {
    // Cette action appellerait AuthService.signIn côté serveur si nécessaire
    // Pour l'instant, on retourne juste un succès car la logique est côté client
    return { success: true, message: "Code OTP envoyé" };
  } catch (error) {
    console.error("Initiate login error:", error);
    return { error: "Erreur lors de l'envoi du code OTP" };
  }
};

// Action pour compléter la connexion avec OTP
export const completeLoginAction = async (email: string, otpCode: string) => {
  try {
    // Cette action appellerait AuthService.completeLogin côté serveur si nécessaire
    // Pour l'instant, on retourne juste un succès car la logique est côté client
    return { success: true, message: "Connexion réussie" };
  } catch (error) {
    console.error("Complete login error:", error);
    return { error: "Code OTP invalide" };
  }
};