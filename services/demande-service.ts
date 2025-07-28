"use server";

import { auth } from "@/lib/auth";
import { API_CONFIG } from "@/lib/api-http";
import {
  ServiceType,
  RequestStatus,
  CreateRequestData,
  Demande,
  RequestStats,
} from "@/types/demande.types";
import { PaginatedResponse } from "@/types";

// Service sécurisé pour les demandes - Server-side uniquement

// Fonctions utilitaires internes
async function getAuthHeaders() {
  try {
    const session = await auth();
    if (!session?.user?.accessToken) {
      console.log("❌ Aucune session ou token trouvé");
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    // Vérifier que l'utilisateur est du personnel
    if (session?.user?.userType !== "PERSONNEL") {
      console.log("❌ Type d'utilisateur incorrect:", session?.user?.userType);
      throw new Error("Accès réservé au personnel de l'ambassade");
    }

    console.log("✅ Token obtenu depuis la session NextAuth");
    console.log(
      "📝 Token preview:",
      session.user.accessToken.substring(0, 20) + "..."
    );

    return {
      Authorization: `Bearer ${session.user.accessToken}`,
      "Content-Type": "application/json",
    };
  } catch (error: any) {
    console.log("❌ Erreur d'authentification:", error.message);
    throw error;
  }
}

async function getMultipartHeaders() {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("Authentification requise - Veuillez vous reconnecter");
  }

  return {
    Authorization: `Bearer ${session.user.accessToken}`,
    // Pas de Content-Type pour multipart/form-data
  };
}

// Récupérer les statistiques des demandes
export async function getStats(): Promise<RequestStats> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseURL}/demandes/stats`, {
      method: "GET",
      headers,
      cache: "no-store", // Toujours récupérer les données fraîches
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    throw new Error("Impossible de récupérer les statistiques");
  }
}

// Récupérer la liste des demandes avec pagination et filtres
export async function getRequests(
  params: {
    page?: number;
    limit?: number;
    status?: RequestStatus;
    serviceType?: ServiceType;
    search?: string;
  } = {}
): Promise<PaginatedResponse<Demande>> {
  try {
    const headers = await getAuthHeaders();
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.serviceType)
      searchParams.append("serviceType", params.serviceType);
    if (params.search) searchParams.append("search", params.search);

    const url = `${API_CONFIG.baseURL}/demandes`;
    console.log("🔗 Fetching requests from:", url);
    console.log("📋 Headers:", headers);

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("📨 Response status:", response.status);
    console.log("📨 Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ API Response data:", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des demandes:", error);
    throw error;
  }
}

// Récupérer une demande par ID
export async function getRequestById(id: string): Promise<Demande> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseURL}/demandes/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Demande non trouvée");
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error);
    throw error;
  }
}

// Changer le statut d'une demande (personnel uniquement)
export async function updateRequestStatus(
  id: string,
  newStatus: RequestStatus,
  reason?: string
): Promise<Demande> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_CONFIG.baseURL}/demandes/${id}/status`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ newStatus, reason }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
}

// Supprimer une demande (admin uniquement)
export async function deleteRequest(id: string): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseURL}/demandes/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    throw error;
  }
}

// Actions serveur pour les demandes
export async function getDemandeStats() {
  return await getStats();
}

export async function getDemandesList(
  params: {
    page?: number;
    limit?: number;
    status?: RequestStatus;
    serviceType?: ServiceType;
    search?: string;
  } = {}
) {
  return await getRequests(params);
}

export async function getDemandeById(id: string) {
  return await getRequestById(id);
}

export async function updateDemandeStatus(
  id: string,
  newStatus: RequestStatus,
  reason?: string
) {
  return await updateRequestStatus(id, newStatus, reason);
}

export async function deleteDemande(id: string) {
  return await deleteRequest(id);
}
