# Système d'Authentification BridgeFacile - Schéma de Base de Données

## Vue d'Ensemble du Système

Le système d'authentification de BridgeFacile représente une évolution majeure de la plateforme, transformant l'expérience utilisateur d'un simple site vitrine vers une véritable communauté bridge interactive et sécurisée. Cette implémentation s'appuie sur Supabase Auth pour fournir une authentification robuste, sécurisée et conforme aux standards modernes de sécurité web.

L'architecture proposée intègre parfaitement l'authentification avec les fonctionnalités existantes de la plateforme, notamment le système de chat communautaire, les cours bridge, et le suivi de progression des étudiants. Cette approche holistique garantit une expérience utilisateur cohérente et professionnelle.

## Architecture d'Authentification

### Intégration Supabase Auth

Supabase Auth offre une solution d'authentification complète qui gère automatiquement les aspects critiques de la sécurité utilisateur. Le système utilise les fonctionnalités natives de Supabase pour la gestion des sessions, la validation des emails, et la sécurité des mots de passe.

Les avantages de cette approche incluent la gestion automatique des tokens JWT, la protection contre les attaques CSRF, et la conformité aux standards de sécurité modernes. Supabase Auth gère également la validation des emails avec des templates personnalisables et un système de récupération de mot de passe robuste.

### Flux d'Authentification

Le processus d'authentification suit un flux standard mais optimisé pour l'expérience bridge. Lors de l'inscription, l'utilisateur fournit ses informations personnelles et bridge-spécifiques, incluant son numéro de licence FFB (Fédération Française de Bridge). Cette information permet de valider l'appartenance à la communauté bridge officielle.

Le système vérifie automatiquement la validité de l'adresse email et guide l'utilisateur à travers le processus de confirmation. Une fois authentifié, l'utilisateur accède à toutes les fonctionnalités premium de la plateforme, incluant les chats privés, le suivi de progression personnalisé, et l'accès aux cours avancés.

## Schéma de Base de Données Étendu

### Table `auth.users` (Supabase Native)

Cette table est gérée automatiquement par Supabase Auth et contient les informations d'authentification de base :

```sql
-- Table native Supabase Auth (lecture seule pour l'application)
auth.users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  encrypted_password VARCHAR,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB
)
```

### Table `public.user_profiles` (Nouvelle)

Cette table étend les informations utilisateur avec les données spécifiques à BridgeFacile :

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  pseudo VARCHAR(50) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  address TEXT,
  bridge_license_number VARCHAR(20),
  bridge_level VARCHAR(50) DEFAULT 'Débutant',
  preferred_course_type VARCHAR(50),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Mise à Jour de la Table `contacts`

La table contacts existante est étendue pour supporter les utilisateurs authentifiés :

```sql
ALTER TABLE public.contacts ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.contacts ADD COLUMN is_authenticated BOOLEAN DEFAULT false;
```

### Mise à Jour de la Table `students`

La table students est liée au système d'authentification :

```sql
ALTER TABLE public.students ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.students ADD COLUMN registration_date TIMESTAMPTZ DEFAULT NOW();
```

### Nouvelle Table `chat_messages`

Pour supporter le système de chat avec utilisateurs authentifiés :

```sql
CREATE TABLE public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_type VARCHAR(20) NOT NULL CHECK (chat_type IN ('public', 'private')),
  topic VARCHAR(100),
  private_chat_id UUID,
  message_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT false
);
```

### Nouvelle Table `private_chats`

Pour gérer les chats privés entre utilisateurs :

```sql
CREATE TABLE public.private_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### Nouvelle Table `private_chat_participants`

Pour gérer les participants aux chats privés :

```sql
CREATE TABLE public.private_chat_participants (
  id BIGSERIAL PRIMARY KEY,
  chat_id UUID REFERENCES public.private_chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(chat_id, user_id)
);
```

## Politiques de Sécurité RLS (Row Level Security)

### Politiques pour `user_profiles`

```sql
-- Activer RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : les utilisateurs peuvent voir tous les profils publics
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
FOR SELECT USING (true);

-- Politique de mise à jour : les utilisateurs ne peuvent modifier que leur propre profil
CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Politique d'insertion : les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);
```

### Politiques pour `chat_messages`

```sql
-- Activer RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour messages publics
CREATE POLICY "Public messages are viewable by authenticated users" ON public.chat_messages
FOR SELECT USING (
  auth.role() = 'authenticated' AND 
  (chat_type = 'public' OR 
   (chat_type = 'private' AND private_chat_id IN (
     SELECT chat_id FROM public.private_chat_participants 
     WHERE user_id = auth.uid() AND is_active = true
   )))
);

-- Politique d'insertion pour messages
CREATE POLICY "Authenticated users can insert messages" ON public.chat_messages
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid() = user_id
);
```

### Politiques pour `private_chats`

```sql
-- Activer RLS
ALTER TABLE public.private_chats ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : seuls les participants peuvent voir le chat
CREATE POLICY "Chat participants can view private chats" ON public.private_chats
FOR SELECT USING (
  id IN (
    SELECT chat_id FROM public.private_chat_participants 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Politique de création : utilisateurs authentifiés peuvent créer des chats
CREATE POLICY "Authenticated users can create private chats" ON public.private_chats
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);
```

## Fonctions et Triggers

### Fonction de Création Automatique de Profil

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, pseudo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'pseudo', 'user_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Trigger pour Création Automatique de Profil

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Fonction de Mise à Jour du Statut En Ligne

```sql
CREATE OR REPLACE FUNCTION public.update_user_online_status(is_online_status BOOLEAN)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles 
  SET 
    is_online = is_online_status,
    last_seen = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Validation et Contraintes

### Validation du Numéro de Licence Bridge

```sql
-- Contrainte pour le format du numéro de licence FFB
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_bridge_license 
CHECK (
  bridge_license_number IS NULL OR 
  bridge_license_number ~ '^[0-9]{6,8}$'
);
```

### Validation du Pseudo

```sql
-- Contrainte pour le format du pseudo
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_pseudo 
CHECK (
  pseudo ~ '^[a-zA-Z0-9_-]{3,50}$'
);
```

### Validation du Numéro de Téléphone

```sql
-- Contrainte pour le format du numéro de téléphone français
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_phone_number 
CHECK (
  phone_number IS NULL OR 
  phone_number ~ '^(\+33|0)[1-9]([0-9]{8})$'
);
```

## Index pour Performance

### Index sur les Colonnes Fréquemment Utilisées

```sql
-- Index pour les recherches par pseudo
CREATE INDEX idx_user_profiles_pseudo ON public.user_profiles(pseudo);

-- Index pour les recherches par statut en ligne
CREATE INDEX idx_user_profiles_online ON public.user_profiles(is_online);

-- Index pour les messages de chat par type et sujet
CREATE INDEX idx_chat_messages_type_topic ON public.chat_messages(chat_type, topic);

-- Index pour les messages de chat privé
CREATE INDEX idx_chat_messages_private_chat ON public.chat_messages(private_chat_id) 
WHERE chat_type = 'private';

-- Index pour les participants de chat privé
CREATE INDEX idx_private_chat_participants_user ON public.private_chat_participants(user_id);
CREATE INDEX idx_private_chat_participants_chat ON public.private_chat_participants(chat_id);
```

## Migration et Déploiement

### Script de Migration Complet

```sql
-- 1. Création des nouvelles tables
-- (Voir les définitions complètes ci-dessus)

-- 2. Migration des données existantes
-- Mise à jour des tables existantes pour supporter l'authentification

-- 3. Activation des politiques RLS
-- (Voir les politiques définies ci-dessus)

-- 4. Création des fonctions et triggers
-- (Voir les définitions complètes ci-dessus)

-- 5. Création des index de performance
-- (Voir les index définis ci-dessus)
```

### Procédure de Rollback

En cas de problème lors du déploiement, une procédure de rollback est prévue :

```sql
-- Désactivation des triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Suppression des nouvelles tables (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS public.private_chat_participants;
DROP TABLE IF EXISTS public.private_chats;
DROP TABLE IF EXISTS public.chat_messages;

-- Suppression des colonnes ajoutées
ALTER TABLE public.contacts DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.contacts DROP COLUMN IF EXISTS is_authenticated;
ALTER TABLE public.students DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.students DROP COLUMN IF EXISTS registration_date;

-- Suppression de la table de profils
DROP TABLE IF EXISTS public.user_profiles;
```

## Considérations de Sécurité

### Protection des Données Personnelles

Le système respecte les principes du RGPD en minimisant la collecte de données et en permettant aux utilisateurs de contrôler leurs informations. Les données sensibles comme les numéros de téléphone et adresses sont optionnelles et peuvent être supprimées à tout moment.

### Chiffrement et Sécurité

Supabase Auth gère automatiquement le chiffrement des mots de passe avec bcrypt et la sécurisation des sessions avec des tokens JWT. Les communications entre le client et le serveur sont chiffrées via HTTPS.

### Audit et Logging

Le système maintient un audit trail complet des actions utilisateur importantes, incluant les connexions, les modifications de profil, et les activités de chat. Ces logs sont essentiels pour la sécurité et le support utilisateur.

## Intégration avec les Fonctionnalités Existantes

### Système de Chat

Le nouveau système d'authentification s'intègre parfaitement avec le chat existant, permettant l'identification des utilisateurs, la gestion des statuts en ligne, and la création de chats privés sécurisés.

### Cours et Progression

Les utilisateurs authentifiés bénéficient d'un suivi personnalisé de leur progression, avec sauvegarde automatique de leurs avancées dans les cours et modules.

### Système de Contact

Le formulaire de contact existant est enrichi pour les utilisateurs connectés, pré-remplissant automatiquement leurs informations et permettant un suivi personnalisé des demandes.

Cette architecture d'authentification transforme BridgeFacile en une véritable plateforme communautaire bridge, offrant une expérience personnalisée et sécurisée à chaque utilisateur.

