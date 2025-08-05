import { Api } from "ak-api-http";
import { baseURL } from "@/config";
import { getTokenInfo, logout } from "@/features/auth/actions/auth.action";

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
    const jwt = await getTokenInfo()
    return {
      accessToken: jwt?.accessToken ?? "",
    }
  },// Récupération du token
  signOut: logout, // Déconnexion automatique si la requête échoue avec un code 401
  onRequestError: (error) => {
    console.log({ error: error })
  },
  debug: true, // Debug activé en mode développement
});