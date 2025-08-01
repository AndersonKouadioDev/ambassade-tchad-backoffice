# Module Actualités

Ce module gère la gestion des actualités avec une structure organisée similaire au module événements.

## Structure des fichiers

```
features/actualites/
├── components/
│   ├── actualite-list/
│   │   ├── actualite-card.tsx          # Carte d'actualité avec design professionnel
│   │   ├── actualite-filters.tsx       # Filtres de recherche
│   │   └── actualite-pagination.tsx    # Pagination
│   ├── actualite-modal/
│   │   ├── actualite-view-modal.tsx    # Modal de visualisation des détails
│   │   └── actualite-image-gallery-modal.tsx # Modal de galerie d'images
│   ├── actualite-form/
│   │   └── actualite-form.tsx          # Formulaire de création/édition
│   ├── actualite-stats/
│   │   └── actualite-stats.tsx         # Composant de statistiques
│   ├── actualite-list.tsx              # Composant principal de liste
│   └── index.ts                        # Exports des composants
├── actions/
│   └── actualites.action.ts            # Actions CRUD
├── queries/
│   ├── actualite-stats.query.ts        # Query pour les statistiques
│   └── actualite-details.query.ts      # Query pour les détails
├── hooks/
│   └── useActaliteCard.ts              # Hook principal pour la gestion
├── schemas/
│   └── actualites.schema.ts            # Schémas de validation
└── types/
    └── actualites.type.ts              # Types TypeScript
```

## Composants principaux

### ActualiteList
Composant principal qui orchestre l'affichage de la liste des actualités avec :
- Filtres de recherche
- Grille de cartes d'actualités
- Pagination
- Modals de visualisation

### ActualiteCard
Carte d'actualité avec :
- Design professionnel avec gradient
- Affichage de la première image
- Boutons d'action (modifier/supprimer)
- Modal de confirmation de suppression
- Informations sur l'auteur et les dates

### ActualiteFilters
Filtres de recherche avec :
- Recherche par titre
- Filtre par état de publication
- Filtre par statut
- Bouton de création

### ActualitePagination
Pagination avec :
- Navigation par pages
- Sélecteur d'éléments par page
- Affichage des informations de pagination

### ActualiteViewModal
Modal de visualisation avec :
- Détails complets de l'actualité
- Aperçu des images
- Bouton pour ouvrir la galerie d'images

### ActualiteStats
Composant de statistiques avec :
- Total d'actualités
- Actualités publiées/non publiées
- Statistiques par auteur
- Design avec cartes

## Fonctionnalités

- ✅ Design harmonisé avec le module événements
- ✅ Modal de suppression professionnelle
- ✅ Gestion des images multiples
- ✅ Filtres de recherche avancés
- ✅ Pagination complète
- ✅ Statistiques dynamiques
- ✅ Navigation vers création/édition
- ✅ Gestion des états de chargement
- ✅ Gestion des erreurs

## Utilisation

```tsx
import { ActualiteList, ActualiteStats } from "@/features/actualites/components";

// Dans une page
<ActualiteList />
<ActualiteStats stats={statsData} />
``` 