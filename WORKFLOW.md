# 1. Tester l'API sur postman, lire les interfaces (fournir des devs backend) : Afin de mieux comprendre les données du système et bien organiser les modules pour une meilleure lisibilité et intégration.

# 2. Créer le module dans features/[module]/ : Créer le dossier du module dans le dossier features. C'est le dossier principal du module.

# 3. Ajouter les types de l'API dans /features/[module]/types/ : Créer le dossier types dans le dossier du module. C'est le dossier des types de l'API.

# 4. Ajouter les schemas et DTO dans /features/[module]/schemas/ : Créer le dossier schemas dans le dossier du module. C'est le dossier des schemas et DTO.

# 5. Ajouter les API routes dans /features/[module]/api/ : Créer le dossier api dans le dossier du module. C'est le dossier des API routes (on crée les requêtes et on retourne les données, en cas d'echec une exception est levée automatiquement).

# 6. Ajouter les actions (les requêtes de mutations) dans /features/[module]/actions/ : Créer le dossier actions dans le dossier du module. C'est le dossier des actions serveurs (server action). On utilise les API routes pour les requêtes de mutations.

# 7. Ajouter les queries (les requêtes de lecture) dans /features/[module]/queries/ : Créer le dossier queries dans le dossier du module. C'est le dossier des queries tanstack. On utilise les API routes pour les requêtes de lecture.

# 8. Ajouter les pages dans /app/[locale]/[module]/ : Créer les pages dans le dossier app/local pour le module. C'est le dossier des pages. Préférer les pages server components avec un preloader avec tanstack.

# 9. Ajouter les composants dans /components/[module]/ : Créer le dossier components dans le dossier du module. C'est le dossier des composants. Faites suivre du nom des composants, le nom du traitement (-view, -add, -edit, -delete) et le nom du type de composant (-form, -modal, -table, -list). Exemple: utilisateur-add-form.tsx, utilisateur-edit-modal.tsx, utilisateur-view-table.tsx, utilisateur-view-list.tsx. Ecrire le nom du fichier ou du dossier (si le composant a des sous-composants) en minuscule. Par contre le nom de la fonction ou du composant est en camelCase.

# 10. Ajouter les ViewModels (les hooks) dans /features/[module]/[hooks, utils, helpers]/ : Créer le dossier hooks, utils, helpers dans le dossier du module. C'est le dossier des ViewModels. Il sont responsables de la logique métier et de la gestion des états de l'interface utilisateur.

# 11. Ajouter les utilitaires (helpers, utils) dans /features/[module]/[utils, helpers]/ : Créer le dossier utils, helpers dans le dossier du module. C'est le dossier des utilitaires. On peut tester les utilitaires, les API routes, les actions et les queries dans le dossier tests.

# 12. Ajouter les tests dans /features/[module]/tests/ : Créer le dossier tests dans le dossier du module.

# 13. Ajouter les styles dans /styles/[module]/ : Créer le dossier styles dans le dossier du module.

# Remarque 01: MVVM (Model-View-ViewModel)
- Le model : l'ensemble des dossiers types, schemas, api, actions, queries.
- Le view :l'ensemble des dossiers components et pages.
- Le view-model: le dossier hooks.

# Remarque 02: Vertical Slice Architecture
- la création du dossier features où on va organiser les fichiers selon le module.

# Remarque 03: Les mêmes éléments dans des dossiers à la racine du dossier
- lorsqu'il y a des types globaux, des utils, des helpers, des styles... globaux, on les met dans des dossiers à la racine du dossier. components/(ui, partials, layout, navigation, blocks), utils/ , helpers/, styles/,...
