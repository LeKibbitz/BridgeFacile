# BridgeFacile 🃏

**Plateforme d'apprentissage du Bridge avec cours en ligne et chat communautaire**

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.7-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)

## 🌟 Fonctionnalités

### 🎓 **Système de Cours Complet**
- **3 formules de cours** : Live Visio, Autonome, Particuliers
- **Présentation interactive** avec 10 modules progressifs
- **Navigation intuitive** entre les diapos
- **Suivi de progression** avec barre de progression
- **Intégration Trustpilot** pour les avis

### 🔐 **Authentification Complète**
- **Inscription/Connexion** avec vérification email
- **Profils utilisateurs** avec informations bridge spécifiques
- **Validation des données** (email, téléphone, licence FFB)
- **Gestion de session** persistante
- **Sécurité RLS** avec Supabase

### 💬 **Chat Communautaire Avancé**
- **Chat flottant** positionné au bord de l'écran
- **8 sujets spécialisés** : Discussion générale, Enchères, Jeu de la carte, etc.
- **Chats privés** de 2-4 personnes avec invitations
- **Statut en ligne** en temps réel
- **Autocomplétion** pour la sélection de joueurs

### 📱 **Design Responsive**
- **Interface moderne** avec Tailwind CSS
- **Compatible mobile** et desktop
- **Animations fluides** et transitions smooth
- **Thème cohérent** vert professionnel
- **Icônes Lucide** pour une UX optimale

## 🚀 Déploiement

**Site en production :** https://yaznpfjd.manus.space

## 🛠️ Technologies

- **Frontend :** React 19.1.0 + Vite
- **Styling :** Tailwind CSS 4.1.7
- **UI Components :** Radix UI + shadcn/ui
- **Icons :** Lucide React
- **Backend :** Supabase (Auth + Database)
- **Deployment :** Manus Platform

## 📋 Installation

```bash
# Cloner le repository
git clone https://github.com/LeKibbitz/BridgeFacile.git
cd BridgeFacile

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm run dev

# Build pour production
pnpm run build
```

## 🗄️ Base de Données

### Tables Principales

1. **`user_profiles`** - Profils utilisateurs avec informations bridge
2. **`contacts`** - Formulaire de contact du site
3. **`students`** - Gestion des étudiants inscrits
4. **`lessons`** - Catalogue des cours par modules
5. **`student_progress`** - Suivi individuel des progrès
6. **`subscriptions`** - Gestion des abonnements
7. **`group_sessions`** - Sessions de groupe en direct
8. **`session_participants`** - Participants aux sessions
9. **`reminders`** - Système de rappels automatisés
10. **`trustpilot_reviews`** - Intégration des avis
11. **`chat_messages`** - Messages du chat communautaire
12. **`private_chats`** - Chats privés entre utilisateurs
13. **`private_chat_participants`** - Participants aux chats privés

### Scripts SQL

- `authentication_schema.sql` - Schéma complet d'authentification
- `individual_courses_schema.sql` - Extension pour cours particuliers
- `add_columns.sql` - Migrations et ajouts de colonnes

## 📚 Documentation

- [`Authentication_System_Database_Schema.md`](./Authentication_System_Database_Schema.md) - Documentation système d'authentification
- [`Individual_Courses_Database_Schema.md`](./Individual_Courses_Database_Schema.md) - Documentation cours particuliers
- [`BridgeFacile_Database_Schema.md`](./BridgeFacile_Database_Schema.md) - Schéma de base de données principal

## 🔧 Configuration

### Variables d'environnement Supabase

```javascript
const supabaseUrl = 'https://wfctinichbyfuwmxkebl.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'
```

### Fonctionnalités Supabase

- **Authentication** avec vérification email
- **Row Level Security (RLS)** pour la sécurité
- **Real-time subscriptions** pour le chat
- **Triggers automatiques** pour la gestion des profils

## 🎯 Fonctionnalités Clés

### Authentification
- Inscription avec validation complète
- Connexion sécurisée
- Profils utilisateurs détaillés
- Gestion des sessions

### Chat Communautaire
- Discussions par sujets bridge
- Chats privés multi-utilisateurs
- Statut en ligne temps réel
- Interface moderne et intuitive

### Cours Bridge
- 3 formules adaptées à tous les besoins
- Présentation interactive progressive
- Suivi de progression personnalisé
- Intégration avis clients

### Design & UX
- Interface responsive et moderne
- Navigation intuitive
- Animations fluides
- Thème professionnel cohérent

## 👨‍💻 Développement

### Structure du projet

```
src/
├── App.jsx              # Composant principal
├── App.css              # Styles personnalisés
├── components/
│   └── ui/              # Composants UI réutilisables
├── main.jsx             # Point d'entrée React
└── index.css            # Styles globaux
```

### Composants principaux

- `AuthModal` - Modal d'authentification
- `AuthWidget` - Widget de connexion/inscription
- `FloatingChat` - Chat communautaire flottant
- `ContactModal` - Formulaire de contact
- `ProgressBar` - Barre de progression des cours

## 🚀 Déploiement

Le projet est configuré pour être déployé sur la plateforme Manus avec build automatique via Vite.

```bash
# Build de production
pnpm run build

# Prévisualisation locale
pnpm run preview
```

## 📞 Contact

**Thomas Joannès**
- Email: thomas.joannes@bridgefacile.fr
- Téléphone: +33 6 58 51 58 34
- WhatsApp/SMS disponibles

## 📄 Licence

© 2025 BridgeFacile. Tous droits réservés.

---

**Développé avec ❤️ pour la communauté Bridge française** 🇫🇷

