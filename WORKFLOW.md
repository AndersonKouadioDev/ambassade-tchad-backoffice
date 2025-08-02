
Ce guide détaille le processus de création d'une nouvelle fonctionnalité (module) dans l'architecture Next-LB. Il s'appuie sur les principes des **Tranches Verticales** et du **MVVM**, garantissant cohérence, maintenabilité et scalabilité.

### Étape 1 : Créer le Dossier Racine du Module

* **Emplacement** : `src/features/[nom-du-module]/`
* **Description** : Conteneur principal de votre fonctionnalité.

### Étape 2 : Définir le Modèle (Données & Logique Métier)

Le Modèle gère les données, leur structure, validation et interaction avec le backend.

#### 2.1 Ajouter les Types

* **Emplacement** : `src/features/[nom-du-module]/types/`
* **Description** : Définitions TypeScript (interfaces, énumérations) spécifiques au module, non générées par Zod.
* **Exemple** : `utilisateur.type.ts`.

#### 2.2 Ajouter les Schémas et DTOs

* **Emplacement** : `src/features/[nom-du-module]/schemas/`
* **Description** : Schémas de validation **Zod** pour les données. Les types TypeScript dérivés (`z.infer<typeof MonSchema>`) sont nos **DTOs (Data Transfer Objects)**.
* **Exemple** : `utilisateur.schema.ts`.

#### 2.3 Ajouter les Fonctions API Brutes

* **Emplacement** : `src/features/[nom-du-module]/api/`
* **Description** : Fonctions encapsulant les appels HTTP bruts vers le backend via **ak-api-http**.
* **Rôle MVVM** : Couche **Modèle**.
* **Important** : Les exceptions sont gérées automatiquement par `lib/api.ts`. Ne connaissent **PAS** TanStack Query ni les Server Actions.
* **Exemple** : `utilisateur.api.ts`.

#### 2.4 Ajouter les Server Actions (Requêtes de Mutations)

* **Emplacement** : `src/features/[nom-du-module]/actions/`
* **Description** : Fonctions **Server Actions Next.js** ("use server"). Point d'entrée sécurisé client-backend. Appellent les fonctions API brutes.
* **Rôle MVVM** : Couche **Modèle**.
* **Sécurité** : Évite l'exposition d'informations sensibles et permet des validations avec **ak-zod-form-kit**.
* **Convention** : Utilisez ces actions dans vos hooks TanStack Query.
* **Exemple** : `utilisateur.action.ts`.

### Étape 3 : Définir le ViewModel (Présentation & État UI)

Le ViewModel prépare les données pour la Vue et gère la logique de présentation et les états de l'UI.

#### 3.1 Ajouter les Queries et Mutations TanStack Query

* **Emplacement** : `src/features/[nom-du-module]/queries/`
* **Description** : Hooks `useQuery` et `useMutation` de **TanStack Query**. Gèrent le cache, les re-fetches, les états.
* **Rôle MVVM** : Couche **ViewModel**.
* **Convention** : Doivent impérativement appeler les **Server Actions**, pas les fonctions API brutes.
* **Exemple** : `utilisateur-list.query.ts`, `utilisateur.mutation.ts`, `index.query.ts`.

#### 3.2 Ajouter les Hooks Personnalisés (ViewModels)

* **Emplacement** : `src/features/[nom-du-module]/hooks/`
* **Description** : Hooks personnalisés encapsulant la logique de présentation complexe et les états UI spécifiques au module. C'est le ViewModel pur.
* **Rôle MVVM** : Couche **ViewModel**.
* **Quand l'utiliser** : Pour isoler la logique UI complexe du composant Vue. Appellent les hooks de `queries/`.
* **Exemple** : `useUtilisateurListTable.ts`.

#### 3.3 Ajouter les Définitions de Filtres URL

* **Emplacement** : `src/features/[nom-du-module]/filters/`
* **Description** : Schémas de parsing pour les paramètres d'URL (filtres, pagination) via **nuqs**.
* **Rôle MVVM** : Couche **ViewModel** (gestion de l'état de présentation via l'URL).
* **Exemple** : `utilisateur.filters.ts`.

### Étape 4 : Définir la Vue (Interface Utilisateur)

La Vue est la couche responsable de l'affichage de l'interface utilisateur.

#### 4.1 Ajouter les Pages

* **Emplacement** : `src/app/[locale]/[module]/`
* **Description** : Pages Next.js, points d'entrée UI. Préférer les **Server Components** pour le préchargement de données.
* **Rôle MVVM** : Couche **Vue**.
* **Convention** : Préchargement avec TanStack Query (`prefetchQuery`).
* **Exemple** : `src/app/[locale]/(protected)/users/page.tsx`.

#### 4.2 Ajouter les Composants Spécifiques au Module

* **Emplacement** : `src/features/[nom-du-module]/components/`
* **Description** : Composants React spécifiques à cette fonctionnalité.
* **Rôle MVVM** : Couche **Vue**.
* **Convention de nommage des fichiers/dossiers** : Minuscule. Nom du composant : `[nom-du-module]-[traitement]-[type-de-composant].tsx`.
* **Exemples** : `utilisateur-add-form.tsx`, `utilisateur-list/index.tsx`.
* **Nommage des fonctions/composants** : `PascalCase` (ex: `UtilisateurAddForm`, `UserList`).
* **Gestion des données** : Affiche l'UI et interagit avec les ViewModels (hooks).

### Étape 5 : Ajouter les Utilitaires et Helpers

* **Emplacement** : `src/features/[nom-du-module]/utils/` ou `src/features/[nom-du-module]/helpers/`
* **Description** : Fonctions utilitaires pures, spécifiques au module.
* **Exemple** : `getUtilisateurRole.ts`.

### Étape 6 : Ajouter les Tests

* **Emplacement** : `src/features/[nom-du-module]/tests/`
* **Description** : Tests unitaires et d'intégration du module.