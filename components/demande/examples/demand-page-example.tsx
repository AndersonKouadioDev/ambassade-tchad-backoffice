// Exemple d'utilisation dans une page Server Component
// Cette page montre comment intégrer les nouveaux composants de demandes
// tout en respectant les règles de Next.js pour les Server Components

import React from 'react';
import { DemandListWrapper } from './demand-list-wrapper';
import { ServiceType } from '@/types/demande.types';

// Server Component - Cette page peut être rendue côté serveur
export default function DemandsPage() {
  // Dans un vrai cas, vous récupéreriez les données depuis votre API backend
  // const demands = await fetchDemands();
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Gestion des Demandes Consulaires
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez toutes les demandes consulaires soumises
        </p>
      </div>

      {/* Le wrapper contient la logique client */}
      <DemandListWrapper />
    </div>
  );
}

// Remarques importantes pour le développement :
// 
// 1. SÉPARATION SERVER/CLIENT COMPONENTS :
//    - Cette page est un Server Component (pas de "use client")
//    - Elle peut faire des appels API directs, des queries de DB, etc.
//    - DemandListWrapper est un Client Component qui gère l'interactivité
//
// 2. PATTERN WRAPPER :
//    - Server Component (cette page) → Client Component (wrapper) → Server Component enfant si besoin
//    - Permet de garder les bénéfices des Server Components tout en ayant de l'interactivité
//
// 3. GESTION DES DONNÉES :
//    - Récupérez les données dans le Server Component
//    - Passez-les en props au Client Component
//    - Le Client Component gère les mutations et l'état local
//
// 4. EXEMPLE D'INTÉGRATION AVEC BACKEND :
//    
//    async function DemandsPage() {
//      // Appel direct au backend (Server Component)
//      const initialDemands = await fetch(`${process.env.API_URL}/demandes`, {
//        headers: { Authorization: `Bearer ${await getServerToken()}` }
//      }).then(res => res.json());
//    
//      const stats = await fetch(`${process.env.API_URL}/demandes/stats`).then(res => res.json());
//    
//      return (
//        <div>
//          <DemandStatsCards stats={stats} />
//          <DemandListWrapper initialDemands={initialDemands} />
//        </div>
//      );
//    }