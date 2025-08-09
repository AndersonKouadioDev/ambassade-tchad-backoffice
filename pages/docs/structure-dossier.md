# Structure des dossiers

Découvrez la structure des dossiers du modèle et son contenu.

```
|
├─ app                          // Contient les principales pages et la logique de l'application
│  ├─ (dashboard)              // Dossiers des pages spécifiques au tableau de bord
│  │  ├─ (apps)                // Applications diverses
│  │  ├─ (chart)               // Pages liées aux graphiques
│  │  ├─ (diagrams)            // Pages de diagrammes
│  │  ├─ (forms)               // Pages de formulaires
|  |  ├─ (home)                // Page d'accueil du tableau de bord
│  │  ├─ (icons)               // Icônes
│  │  ├─ (invoice)             // Pages de facturation
|  |  ├─ (map)                 // Pages de cartes
│  │  ├─ (tables)              // Pages de tableaux
│  │  ├─ blank                 // Page vide
|  |  ├─ diagram               // Pages de diagrammes
│  │  |- layout.jsx            // Composant de mise en page spécifique au tableau de bord
│  │  |- main-layout.jsx       // Composant de mise en page principale du tableau de bord
│  │  
│  ├─ api                      // Points de terminaison API
│  ├─ assets                   // Fichiers d'actifs statiques (images, etc.)
│  ├─ auth                     // Pages d'authentification (connexion, inscription, etc.)
│  ├─ error-page               // Pages d'erreur personnalisées
│  ├─ utility                  // Fonctions utilitaires
│  |- favicon.ico              // Icône du site
│  |- layout.jsx               // Mise en page globale de l'application
│  |- not-found.js             // Page d'erreur 404 personnalisée
│  |- page.jsx                 // Page d'accueil principale
│  
├─ components                 // Composants réutilisables de l'interface utilisateur
│  ├─ auth                     // Composants d'authentification
│  ├─ landing-page             // Composants pour la page de destination
│  ├─ partials                 // Composants de mise en page (en-tête, pied de page, barre latérale)
│  ├─ svg                      // Composants SVG
│  ├─ task-board               // Composants pour le tableau de tâches
│  ├─ ui                       // Composants d'interface utilisateur génériques
|  |- blank.jsx                // Composant de page vide
│  |- dashboard-select.jsx     // Composant de sélection pour le tableau de bord
│  |- dashboard-dropdown.jsx   // Composant de menu déroulant pour le tableau de bord
│  |- date-picker-with-range.jsx // Composant de sélecteur de dates
│  |- delete-confirmation-dialog.jsx // Composant de dialogue de confirmation de suppression
│  |- error-block.jsx          // Composant de bloc d'erreur
│  |- header-search.jsx        // Composant de barre de recherche d'en-tête
│  |- layout-order.jsx         // Composant de commande de mise en page
│  |- ripple.jsx               // Composant d'effet de "ripple"
|
├─ config                     // Fichiers de configuration de l'application
├─ hooks                      // Hooks React personnalisés
├─ lib                        // Bibliothèques et utilitaires
│  ├─ docs                    // Fichiers de documentation
│  |- appex-chat-options.jsx   // Options de configuration pour Appex Chat
│  |- auth.js                  // Fonctions liées à l'authentification
│  |- utils.js                 // Fonctions utilitaires génériques
│  
├─ pages                      // (Peut être une structure Next.js plus ancienne) Pages de l'application
│  ├─ docs                    // Pages de documentation
│  |-_app.jsx                 // Composant d'application principal
│  |-_meta.json               // Métadonnées
│  
├─ provider                   // Fournisseurs de contexte (ex: AuthProvider)
├─ public                     // Fichiers publics (accessibles directement par l'URL)
├─ store                      // Gestion de l'état de l'application (ex: Redux, Zustand)
|- .env.local                 // Variables d'environnement locales
|- .gitignore                 // Fichiers et dossiers à ignorer par Git
|- jsconfig.json              // Configuration pour JavaScript (similaire à tsconfig.json)
|- middleware.js              // Middleware Next.js
|- next.env.d.ts              // Types pour les variables d'environnement Next.js
|- next.config.js             // Configuration Next.js
|- package-lock.json          // Verrouillage des dépendances npm
|- package.json               // Informations sur le projet et ses dépendances
|- README.md                  // Fichier d'informations sur le projet
|- postcss.config.js          // Configuration de PostCSS
|- tailwind.config.js         // Configuration de Tailwind CSS
|- theme.config.js            // Configuration du thème
|- yarn.lock                  // Verrouillage des dépendances yarn
```