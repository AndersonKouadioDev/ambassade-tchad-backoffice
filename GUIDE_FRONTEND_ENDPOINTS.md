# Guide d'Implémentation Frontend - Ambassade du Tchad

## Vue d'ensemble du Projet

Ce guide détaille l'implémentation du frontend pour l'application de l'Ambassade du Tchad. Le backend NestJS est déjà fonctionnel avec l'authentification implémentée. Il reste à implémenter les fonctionnalités suivantes :

- 📝 Gestion des demandes consulaires
- 📰 Actualités et événements
- 🖼️ Galerie photos et vidéos
- 🔔 Système de notifications
- 👥 Gestion des utilisateurs (administration)

## Architecture Backend Disponible

### URL de Base
```
http://localhost:8083/api
```

### Types d'Utilisateurs

1. **DEMANDEUR** - Utilisateurs publics qui soumettent des demandes
2. **PERSONNEL** - Staff de l'ambassade avec rôles :
   - `AGENT` - Vérification des documents
   - `CHEF_SERVICE` - Approbation niveau service
   - `CONSUL` - Décision finale
   - `ADMIN` - Administration complète

### Authentification

Le système utilise deux types d'authentification JWT séparés :

#### Pour les Demandeurs
```typescript
// Headers requis
Authorization: Bearer <demandeur_access_token>

// Endpoints de base
POST /auth/signin
POST /auth/complete-login (avec OTP)
POST /auth/register-client
GET /auth/demandeur/refresh
GET /auth/demandeur/profile
```

#### Pour le Personnel
```typescript
// Headers requis
Authorization: Bearer <personnel_access_token>

// Endpoints de base
GET /auth/refresh
GET /auth/profile
```

## Modules à Implémenter

### 1. 📝 Module Demandes Consulaires

#### Types de Services Disponibles
- `VISA` - Demandes de visa
- `BIRTH_ACT_APPLICATION` - Actes de naissance
- `CONSULAR_CARD` - Cartes consulaires
- `LAISSEZ_PASSER` - Laissez-passer
- `MARRIAGE_CAPACITY_ACT` - Actes de capacité de mariage
- `DEATH_ACT_APPLICATION` - Actes de décès
- `POWER_OF_ATTORNEY` - Procurations
- `NATIONALITY_CERTIFICATE` - Certificats de nationalité

#### Statuts de Demande
```typescript
enum RequestStatus {
  NEW = "NEW",
  IN_REVIEW_DOCS = "IN_REVIEW_DOCS",
  PENDING_ADDITIONAL_INFO = "PENDING_ADDITIONAL_INFO",
  APPROVED_BY_AGENT = "APPROVED_BY_AGENT",
  APPROVED_BY_CHEF = "APPROVED_BY_CHEF",
  APPROVED_BY_CONSUL = "APPROVED_BY_CONSUL",
  REJECTED = "REJECTED",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  DELIVERED = "DELIVERED",
  ARCHIVED = "ARCHIVED"
}
```

#### Endpoints Principaux

**Pour les Demandeurs :**
```typescript
// Créer une nouvelle demande
POST /demandes
Content-Type: multipart/form-data
Headers: Authorization: Bearer <demandeur_token>

Body: {
  serviceType: ServiceType,
  amount: number,
  contactPhoneNumber?: string,
  // + champs spécifiques selon le type de service
  // + files[] pour les documents
}

// Suivre une demande par ticket
GET /demandes/track/{ticket}
Headers: Authorization: Bearer <demandeur_token>
```

**Pour le Personnel :**
```typescript
// Liste des demandes avec filtres
GET /demandes?page=1&limit=10&status=NEW&serviceType=VISA
Headers: Authorization: Bearer <personnel_token>

// Statistiques
GET /demandes/stats
Headers: Authorization: Bearer <personnel_token>

// Détails d'une demande
GET /demandes/{id}
Headers: Authorization: Bearer <personnel_token>

// Changer le statut d'une demande
PUT /demandes/{id}/status
Headers: Authorization: Bearer <personnel_token>
Body: {
  newStatus: RequestStatus,
  reason?: string
}
```

#### Formulaires Dynamiques par Type de Service

**Exemple - Demande de Visa :**
```typescript
interface VisaRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: "MALE" | "FEMALE";
  personNationality: string;
  personBirthDate: Date;
  personBirthPlace: string;
  personMaritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  
  passportType: "ORDINARY" | "SERVICE" | "DIPLOMATIC";
  passportNumber: string;
  passportIssuedBy: string;
  passportIssueDate: Date;
  passportExpirationDate: Date;
  
  profession?: string;
  employerAddress?: string;
  employerPhoneNumber?: string;
  
  visaType: "SHORT_STAY" | "LONG_STAY";
  durationMonths: number;
  destinationState?: string;
}
```

**Composants Frontend Recommandés :**
- `DemandForm` - Formulaire dynamique selon le type de service
- `DocumentUpload` - Upload multiple avec prévisualisation
- `RequestTracker` - Suivi de demande par ticket
- `RequestList` - Liste des demandes (personnel)
- `StatusUpdater` - Changement de statut (personnel)

### 2. 📰 Module Actualités et Événements

#### Actualités (`/news`)

```typescript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  published: boolean;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

// Endpoints publics
GET /news?page=1&limit=10&published=true
GET /news/{id}

// Endpoints personnel (création/modification)
POST /news
Content-Type: multipart/form-data
Body: {
  title: string,
  content: string,
  published: boolean,
  images?: File[]
}

PATCH /news/{id}
DELETE /news/{id} // ADMIN/CONSUL seulement
```

#### Événements (`/events`)

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  location?: string;
  imageUrl: string[];
  published: boolean;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

// Structure similaire aux actualités
GET /events?page=1&limit=10&fromDate=2024-01-01&toDate=2024-12-31
POST /events
PUT /events/{id}
DELETE /events/{id}
```

**Composants Frontend Recommandés :**
- `NewsList` - Liste d'actualités avec pagination
- `NewsCard` - Carte d'actualité
- `NewsEditor` - Éditeur WYSIWYG avec upload d'images
- `EventCalendar` - Calendrier des événements
- `EventForm` - Formulaire de création/modification

### 3. 🖼️ Module Galerie

#### Photos (`/photos`)

```typescript
interface Photo {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string[];
  createdAt: Date;
  updatedAt: Date;
}

POST /photos
Content-Type: multipart/form-data
Body: {
  title?: string,
  description?: string,
  images: File[] // Max 10 fichiers
}
```

#### Vidéos (`/videos`)

```typescript
interface Video {
  id: string;
  title?: string;
  description?: string;
  youtubeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

POST /videos
Body: {
  title?: string,
  description?: string,
  youtubeUrl: string // URL YouTube
}
```

**Composants Frontend Recommandés :**
- `PhotoGallery` - Grille de photos avec lightbox
- `VideoGallery` - Galerie de vidéos YouTube
- `MediaUpload` - Upload avec compression automatique
- `MediaManager` - Interface d'administration des médias

### 4. 🔔 Module Notifications

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SYSTEM" | "PROMOTION" | "REQUEST_UPDATE" | "ACCOUNT_UPDATE";
  isRead: boolean;
  userId: string;
  target: "INDIVIDUAL" | "ALL_CLIENTS" | "ALL_PERSONNEL" | "ROLE_ADMIN" | "ROLE_AGENT" | "ROLE_CHEF_SERVICE" | "ROLE_CONSUL";
  icon: string;
  iconBgColor: string;
  showChevron: boolean;
  data?: any;
  createdAt: Date;
}

// Notifications d'un utilisateur
GET /notifications/user/{userId}/{target}?page=1&limit=10

// Marquer comme lue
PATCH /notifications/{id}/read

// Marquer toutes comme lues
PATCH /notifications/user/{userId}/{target}/read-all

// Statistiques
GET /notifications/stats/{userId}/{target}
```

**Composants Frontend Recommandés :**
- `NotificationCenter` - Centre de notifications
- `NotificationItem` - Item de notification
- `NotificationBadge` - Badge avec compteur
- `NotificationSettings` - Paramètres utilisateur

### 5. 👥 Module Utilisateurs (Administration)

```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: "AGENT" | "CHEF_SERVICE" | "CONSUL" | "ADMIN";
  type: "DEMANDEUR" | "PERSONNEL";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

// Gestion des utilisateurs (ADMIN/CHEF_SERVICE/CONSUL)
GET /users?page=1&limit=10&type=PERSONNEL&status=ACTIVE
POST /users // Créer utilisateur personnel
PATCH /users/activate/{id}
PATCH /users/deactivate/{id}
DELETE /users/{id}
```

**Composants Frontend Recommandés :**
- `UserList` - Liste des utilisateurs avec filtres
- `UserForm` - Formulaire création/modification
- `RoleManager` - Gestion des rôles
- `UserProfile` - Profil utilisateur

## Fonctionnalités Transversales

### Upload de Fichiers

Le backend supporte l'upload de fichiers avec compression automatique :

```typescript
// Configuration standard
Content-Type: multipart/form-data

// Limites
- Images: compression automatique
- Taille max par fichier: configurable
- Extensions autorisées: jpg, jpeg, png, pdf, doc, docx
```

### Pagination Standard

```typescript
interface PaginationQuery {
  page?: number; // défaut: 1
  limit?: number; // défaut: 10
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Gestion des Erreurs

```typescript
interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
```

 