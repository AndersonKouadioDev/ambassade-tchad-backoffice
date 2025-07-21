# Claude - État d'avancement du projet Ambassade Tchad

## Vue d'ensemble du projet

**Projet:** Système de back-office pour l'Ambassade du Tchad  
**Stack:** Next.js 14 + NestJS + Prisma + PostgreSQL (Neon)  
**Frontend:** Next.js 14 avec App Router, TypeScript, TailwindCSS, shadcn/ui  
**Backend:** NestJS avec Prisma ORM, authentification JWT + OTP  
**État:** Authentification complètement implémentée ✅

## Architecture technique

### Backend (NestJS)
- **URL:** http://localhost:8081
- **Base API:** `/api/v1`
- **Database:** PostgreSQL sur Neon
- **Authentification:** JWT + OTP SMS (Twilio)
- **Endpoints principaux:**
  - `POST /auth/signin` - Connexion (étape 1)
  - `POST /auth/complete-login` - Validation OTP (étape 2)
  - `POST /auth/register-client` - Inscription client
  - `GET /auth/profile` - Profil utilisateur
  - `POST /auth/signout` - Déconnexion

### Frontend (Next.js)
- **URL:** http://localhost:3000
- **Pages obligatoirement en server-side**
- **TanStack Query:** Gestion d'état réseau
- **NextAuth.js v5:** Gestion de session
- **Middleware:** Protection des routes

## État actuel de l'implémentation

### ✅ TERMINÉ - Authentification complète

#### 1. Configuration de base
- **`config/index.ts`**: Configuration backend URL
- **`.env.local`**: Variables d'environnement configurées
- **`middleware.ts`**: Protection routes + internationalisation

#### 2. Services d'authentification
- **`lib/api/auth.service.ts`**: Service API complet avec toutes les méthodes
- **`lib/api-http.ts`**: Client Axios avec intercepteurs et refresh automatique
- **`hooks/use-auth.ts`**: Hooks TanStack Query pour toutes les opérations auth

#### 3. Interface utilisateur
- **`components/partials/auth/login-form.tsx`**: 
  - ✅ Toggle login/register avec design propre
  - ✅ Formulaire de connexion avec validation Zod
  - ✅ Formulaire d'inscription complet (prénom, nom, email, téléphone, mot de passe)
  - ✅ Workflow OTP avec InputOTP component
  - ✅ Gestion d'erreurs et états de chargement
  - ✅ Design cohérent avec le système existant

- **`components/partials/header/profile-info.tsx`**: 
  - ✅ Profil utilisateur dynamique avec TanStack Query
  - ✅ Badges de rôles et statut
  - ✅ Menu déroulant avec déconnexion

#### 4. Schémas de validation
```typescript
// Connexion
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

// Inscription
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phoneNumber: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword);

// OTP
const otpSchema = z.object({
  otpCode: z.string().min(6)
});
```

#### 5. Hooks TanStack Query implémentés
- `useSignIn()` - Connexion (envoie OTP)
- `useCompleteLogin()` - Validation OTP + redirection
- `useRegisterClient()` - Inscription nouvelle
- `useUserProfile()` - Profil utilisateur en temps réel
- `useSignOut()` - Déconnexion sécurisée

## 🔄 PROCHAINES ÉTAPES

### 1. Tests et validation
- [ ] Tester le workflow complet d'inscription
- [ ] Tester le workflow de connexion avec OTP
- [ ] Valider la persistence de session
- [ ] Tester la déconnexion automatique

### 2. Suppression temporaire de l'inscription
> **Note utilisateur:** "après on supprimer" - L'inscription est pour test uniquement
- [ ] Retirer le bouton d'inscription après validation
- [ ] Garder uniquement la connexion pour la production

### 3. Modules suivants à implémenter

#### A. Gestion des utilisateurs (`/users`)
- [ ] Liste des utilisateurs avec DataTable
- [ ] Création/édition utilisateur
- [ ] Gestion des rôles et permissions
- [ ] Filtres et recherche avancée

#### B. Gestion des demandes (`/demande`)
- [ ] Dashboard des demandes par statut
- [ ] Workflow de traitement des demandes
- [ ] Système de commentaires et historique
- [ ] Génération de documents PDF

#### C. Gestion du contenu (`/contenu`)
- [ ] Éditeur WYSIWYG pour les pages
- [ ] Gestion des médias et uploads
- [ ] Menu et navigation dynamique
- [ ] Prévisualisation en temps réel

#### D. Module financier (`/finance`)
- [ ] Suivi des paiements et factures
- [ ] Rapports financiers avec graphiques
- [ ] Export des données comptables
- [ ] Tableau de bord financier

## Structure des fichiers clés

```
ambassade-tchad-backoffice/
├── app/
│   ├── [locale]/
│   │   ├── auth/login/page.tsx          # Page de connexion
│   │   ├── dashboard/                   # Dashboard principal
│   │   ├── users/                       # 🔄 À implémenter
│   │   ├── demande/                     # 🔄 À implémenter
│   │   ├── contenu/                     # 🔄 À implémenter
│   │   └── finance/                     # 🔄 À implémenter
├── components/
│   ├── partials/
│   │   ├── auth/login-form.tsx          # ✅ Terminé
│   │   └── header/profile-info.tsx      # ✅ Terminé
│   └── ui/                              # Components shadcn/ui
├── hooks/
│   └── use-auth.ts                      # ✅ Terminé
├── lib/
│   ├── api/
│   │   └── auth.service.ts              # ✅ Terminé
│   ├── api-http.ts                      # ✅ Terminé
│   └── auth.ts                          # NextAuth config
├── middleware.ts                        # ✅ Terminé
└── .env.local                           # ✅ Configuré
```

## Commandes utiles

```bash
# Démarrer le frontend
npm run dev

# Installer les dépendances (si erreur module not found)
npm install

# Linter et vérification TypeScript
npm run lint

# Build production
npm run build
```

## Notes techniques importantes

### Authentification workflow
1. **Connexion:** Email/password → Envoi OTP SMS
2. **Validation:** Code OTP → Tokens JWT + session NextAuth
3. **Refresh:** Automatic token refresh via interceptors
4. **Déconnexion:** Clear tokens + session + redirection

### Gestion d'état
- **TanStack Query:** Cache intelligent des données utilisateur
- **NextAuth:** Session persistante côté serveur
- **Axios interceptors:** Gestion automatique des tokens

### Sécurité
- Routes protégées via middleware
- Validation Zod sur tous les formulaires
- Tokens JWT avec expiration
- Headers CORS configurés

### Design system
- **TailwindCSS:** Utility-first styling
- **shadcn/ui:** Components cohérents
- **Couleurs ambassade:** Variables CSS custom
- **Responsive:** Mobile-first approach

## Problèmes résolus

1. **Module not found error** → Résolu par `npm install`
2. **goBackToLogin undefined** → Corrigé en `goBackToForm`
3. **Path resolution Windows** → Utilisé chemins absolus
4. **Token refresh loops** → Implémenté retry logic propre

## 🗄️ STRUCTURE BACKEND COMPLÈTE

### Base de données (Modèles Prisma)

#### 👤 **Modèle User**
```typescript
enum UserType { DEMANDEUR, PERSONNEL }
enum Role { AGENT, CHEF_SERVICE, CONSUL, ADMIN }
enum UserStatus { ACTIVE, INACTIVE }

{
  id: string (UUID)
  email: string (unique)
  password: string
  firstName?: string
  lastName?: string
  phoneNumber?: string (unique)
  role?: Role
  type: UserType (défaut: DEMANDEUR)
  status: UserStatus (défaut: ACTIVE)
  isPasswordChangeRequired: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 📋 **Types de Demandes Consulaires (8 services)**

1. **VISA** - Visa de séjour
2. **BIRTH_ACT_APPLICATION** - Acte de naissance
3. **CONSULAR_CARD** - Carte consulaire
4. **LAISSEZ_PASSER** - Laissez-passer
5. **MARRIAGE_CAPACITY_ACT** - Acte de capacité de mariage
6. **DEATH_ACT_APPLICATION** - Acte de décès
7. **POWER_OF_ATTORNEY** - Procuration
8. **NATIONALITY_CERTIFICATE** - Certificat de nationalité

#### 🔄 **Workflow Statuts Demandes**
```typescript
enum RequestStatus {
  NEW,                        // Nouvelle demande
  IN_REVIEW_DOCS,            // En révision des documents
  PENDING_ADDITIONAL_INFO,    // En attente d'infos complémentaires
  APPROVED_BY_AGENT,         // Approuvé par l'agent
  APPROVED_BY_CHEF,          // Approuvé par le chef de service
  APPROVED_BY_CONSUL,        // Approuvé par le consul
  REJECTED,                  // Rejeté
  READY_FOR_PICKUP,          // Prêt pour retrait
  DELIVERED,                 // Délivré
  ARCHIVED,                  // Archivé
  EXPIRED,                   // Expiré
  RENEWAL_REQUESTED          // Renouvellement demandé
}
```

### 📝 **Formulaires Détaillés par Service**

#### 1. **VISA** - Champs du formulaire
```typescript
// Informations personnelles
personFirstName: string
personLastName: string
personGender: Gender (MALE, FEMALE)
personNationality: string
personBirthDate: DateTime
personBirthPlace: string
personMaritalStatus: MaritalStatus

// Informations passeport
passportType: PassportType (ORDINARY, SERVICE, DIPLOMATIC)
passportNumber: string
passportIssuedBy: string
passportIssueDate: DateTime
passportExpirationDate: DateTime

// Informations professionnelles
profession?: string
employerAddress?: string
employerPhoneNumber?: string

// Informations visa
visaType: VisaType (SHORT_STAY, LONG_STAY, TRANSIT, OTHER)
durationMonths: int
destinationState?: string
visaExpirationDate?: DateTime
```

#### 2. **BIRTH_ACT_APPLICATION** - Acte de naissance
```typescript
personFirstName: string
personLastName: string
personBirthDate: DateTime
personBirthPlace: string
personNationality: string
personDomicile?: string
fatherFullName: string
motherFullName: string
requestType: BirthActRequestType (NEWBORN, RENEWAL)
```

#### 3. **CONSULAR_CARD** - Carte consulaire
```typescript
personFirstName: string
personLastName: string
personBirthDate: DateTime
personBirthPlace: string
personProfession?: string
personNationality: string
personDomicile?: string
personAddressInOriginCountry?: string
fatherFullName?: string
motherFullName?: string
justificationDocumentType?: JustificationDocumentType
justificationDocumentNumber?: string
cardExpirationDate?: DateTime
```

#### 4. **LAISSEZ_PASSER** - Laissez-passer
```typescript
personFirstName: string
personLastName: string
personBirthDate: DateTime
personBirthPlace: string
personProfession?: string
personNationality: string
personDomicile?: string
fatherFullName?: string
motherFullName?: string
destination?: string
travelReason?: string
accompanied: boolean
accompaniers: Accompanier[] // Accompagnants
justificationDocumentType?: JustificationDocumentType
justificationDocumentNumber?: string
laissezPasserExpirationDate: DateTime
```

#### 5-8. **Autres Services** (structure similaire)
- **MARRIAGE_CAPACITY_ACT**: Informations époux
- **DEATH_ACT_APPLICATION**: Informations défunt  
- **POWER_OF_ATTORNEY**: Agent/mandant
- **NATIONALITY_CERTIFICATE**: Demandeur/parent

### 🔔 **Système Notifications**
```typescript
enum NotificationType { SYSTEM, PROMOTION, REQUEST_UPDATE, ACCOUNT_UPDATE }
enum NotificationTarget { 
  INDIVIDUAL, ALL_CLIENTS, ALL_PERSONNEL, 
  ROLE_ADMIN, ROLE_AGENT, ROLE_CHEF_SERVICE, ROLE_CONSUL 
}

{
  title: string
  message: string
  type: NotificationType
  userId: string
  target: NotificationTarget
  icon: string
  iconBgColor: string
  isRead: boolean
  data?: Json
}
```

### 📊 **CMS et Gestion Contenu**

#### **News** (Actualités)
```typescript
{
  title: string
  content: string
  imageUrl?: string
  published: boolean
  authorId: string
}
```

#### **Event** (Événements)
```typescript
{
  title: string
  description: string
  eventDate: DateTime
  location?: string
  imageUrl?: string
  published: boolean
  authorId: string
}
```

#### **Médiathèque**
```typescript
// Photo
{
  title?: string
  description?: string
  imageUrl: string
}

// Video  
{
  title?: string
  description?: string
  youtubeUrl: string
}
```

### 💰 **Système Financier**

#### **Payment** (Paiements)
```typescript
enum PaymentMethod { 
  CASH, MOBILE_MONEY, BANK_TRANSFER, CREDIT_CARD, OTHER 
}

{
  requestId: string (unique)
  amount: float
  paymentDate: DateTime
  method: PaymentMethod
  transactionRef?: string
  recordedById: string
}
```

#### **Expense** (Dépenses)
```typescript
enum ExpenseCategory { 
  SALARIES,         // Salaires
  GENERAL_OVERHEAD, // Moyens Généraux
  RENT,            // Loyers
  INTERNET_COMM,   // Canal et Internet
  UTILITIES,       // CIE et SODECI
  OTHER           // Autre
}

{
  amount: float
  description?: string
  category: ExpenseCategory
  recordedById: string
  expenseDate: DateTime
}
```

### 🌐 **Endpoints API Principaux**

#### **Authentification** (`/auth`)
- `POST /signin` → Connexion étape 1 (envoi OTP)
- `POST /complete-login` → Validation OTP + tokens
- `POST /register-client` → Inscription demandeur
- `GET /profile` → Profil utilisateur connecté
- `POST /reset-password` → Réinitialisation mot de passe

#### **Utilisateurs** (`/users`)
- `GET /users` → Liste avec filtres (type, rôle, statut)
- `POST /users` → Créer personnel (ADMIN/CHEF/CONSUL)
- `PATCH /users/:id` → Mise à jour profil
- `PATCH /activate/:id` → Activer/désactiver compte

#### **Notifications** (`/notifications`)
- `POST /notifications` → Créer notification
- `GET /user/:userId/:target` → Notifications utilisateur
- `PATCH /:id/read` → Marquer comme lue
- `DELETE /user/:userId/:target` → Supprimer toutes

### 🔐 **DTOs de Formulaires**

#### **Inscription Demandeur**
```typescript
{
  firstName: string (max 100)
  lastName: string (max 100)
  email: string (unique, max 100)
  phoneNumber: string (+225XXXXXXXXX)
  password: string (8-15 chars, 1 maj, 1 chiffre, 1 spécial)
}
```

#### **Création Personnel**
```typescript
{
  firstName: string (max 100)
  lastName: string (max 100)
  email: string (unique, max 100)
  phoneNumber?: string (max 20)
  role: Role (AGENT, CHEF_SERVICE, CONSUL, ADMIN)
}
```

#### **Recherche Utilisateurs**
```typescript
{
  type?: UserType (DEMANDEUR, PERSONNEL)
  status?: UserStatus (ACTIVE, INACTIVE)
  role?: Role
  firstName?: string (min 2 chars)
  lastName?: string (min 2 chars)
  email?: string
  phoneNumber?: string
  page?: number (défaut: 1)
  limit?: number (défaut: 10, max: 100)
}
```

---

**Dernière mise à jour:** 19 Juillet 2025  
**Prochaine session:** Continuer avec les modules utilisateurs ou demandes selon priorité utilisateur