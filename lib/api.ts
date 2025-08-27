import { Api } from "ak-api-http";
import { baseURL } from "@/config";
import { logout } from "@/features/auth/actions/auth.action";
import { auth } from "./auth";
import { User } from "next-auth";

export const api = new Api({
  baseUrl: baseURL, // Base URL de l'API
  timeout: 10000, // Timeout de la requête
  headers: {
    "Content-Type": "application/json", // En-têtes par défaut
  },
  maxRetries: 3, // Nombre de tentatives de re tentative
  retryDelay: 1000, // Delais entre les tentatives
  enableAuth: true, // Authentification activée
  getSession: async () => {
    const session = await auth();
    const user = session?.user as User;
    if (user) {
      return {
        accessToken: user.accessToken ?? "",
        // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTY0OTM5NS0xODEwLTRiM2YtYWU2Ni02N2I3Mzc5NGNmMGMiLCJ0eXBlIjoiUEVSU09OTkVMIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzU2MzE0MjE4LCJleHAiOjE3NTY0MDA2MTh9.a4MztE0rKXhRpxb4AYeSqk0RSXi2FOhdZu3idFY1ygo",
      }
    }
    return {
      accessToken: "",
    }
  },// Récupération du token
  signOut: async () => {
    // await logout()
  }, // Déconnexion automatique si la requête échoue avec un code 401
  debug: true, // Debug activé en mode développement
});