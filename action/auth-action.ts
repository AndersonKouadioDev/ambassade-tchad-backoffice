'use server'

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

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