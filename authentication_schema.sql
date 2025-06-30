-- BridgeFacile Authentication System Database Schema
-- Complete SQL implementation for Supabase

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================

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

-- =====================================================
-- 2. CHAT MESSAGES TABLE
-- =====================================================

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

-- =====================================================
-- 3. PRIVATE CHATS TABLE
-- =====================================================

CREATE TABLE public.private_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 4. PRIVATE CHAT PARTICIPANTS TABLE
-- =====================================================

CREATE TABLE public.private_chat_participants (
  id BIGSERIAL PRIMARY KEY,
  chat_id UUID REFERENCES public.private_chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(chat_id, user_id)
);

-- =====================================================
-- 5. UPDATE EXISTING TABLES
-- =====================================================

-- Update contacts table
ALTER TABLE public.contacts ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.contacts ADD COLUMN is_authenticated BOOLEAN DEFAULT false;

-- Update students table
ALTER TABLE public.students ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.students ADD COLUMN registration_date TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.students ADD COLUMN last_login_date TIMESTAMPTZ;

-- =====================================================
-- 6. CONSTRAINTS AND VALIDATIONS
-- =====================================================

-- Validation du numéro de licence FFB (6-8 chiffres)
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_bridge_license 
CHECK (
  bridge_license_number IS NULL OR 
  bridge_license_number ~ '^[0-9]{6,8}$'
);

-- Validation du pseudo (3-50 caractères alphanumériques, tirets, underscores)
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_pseudo 
CHECK (
  pseudo ~ '^[a-zA-Z0-9_-]{3,50}$'
);

-- Validation du numéro de téléphone français
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_phone_number 
CHECK (
  phone_number IS NULL OR 
  phone_number ~ '^(\+33|0)[1-9]([0-9]{8})$'
);

-- =====================================================
-- 7. PERFORMANCE INDEXES
-- =====================================================

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

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Activer RLS sur user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : tous peuvent voir les profils publics
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
FOR SELECT USING (true);

-- Politique de mise à jour : utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Politique d'insertion : utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Activer RLS sur chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour messages publics et privés
CREATE POLICY "Users can view relevant messages" ON public.chat_messages
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

-- Activer RLS sur private_chats
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

-- Activer RLS sur private_chat_participants
ALTER TABLE public.private_chat_participants ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : utilisateurs peuvent voir leurs participations
CREATE POLICY "Users can view their chat participations" ON public.private_chat_participants
FOR SELECT USING (
  user_id = auth.uid() OR 
  chat_id IN (
    SELECT chat_id FROM public.private_chat_participants 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Politique d'insertion : créateurs de chat peuvent ajouter des participants
CREATE POLICY "Chat creators can add participants" ON public.private_chat_participants
FOR INSERT WITH CHECK (
  chat_id IN (
    SELECT id FROM public.private_chats 
    WHERE created_by = auth.uid()
  )
);

-- =====================================================
-- 9. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Fonction de création automatique de profil utilisateur
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

-- Trigger pour création automatique de profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction de mise à jour du statut en ligne
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

-- Fonction de mise à jour de la dernière connexion
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS VOID AS $$
BEGIN
  -- Mettre à jour la table students si l'utilisateur est un étudiant
  UPDATE public.students 
  SET last_login_date = NOW()
  WHERE user_id = auth.uid();
  
  -- Mettre à jour le statut en ligne dans user_profiles
  UPDATE public.user_profiles 
  SET 
    is_online = true,
    last_seen = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mise à jour automatique des timestamps
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON public.chat_messages 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 10. SAMPLE DATA FOR TESTING
-- =====================================================

-- Note: Les données de test seront ajoutées après la création des utilisateurs
-- via l'interface d'inscription

-- =====================================================
-- DEPLOYMENT NOTES
-- =====================================================

-- 1. Exécuter ce script dans l'éditeur SQL de Supabase
-- 2. Vérifier que l'authentification Supabase est activée
-- 3. Configurer les templates d'email pour la validation
-- 4. Tester l'inscription et la connexion
-- 5. Vérifier les politiques RLS avec différents utilisateurs

-- =====================================================
-- ROLLBACK SCRIPT (if needed)
-- =====================================================

/*
-- Pour annuler les modifications (à utiliser avec précaution) :

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON public.chat_messages;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_user_online_status(BOOLEAN);
DROP FUNCTION IF EXISTS public.update_updated_at_column();

DROP TABLE IF EXISTS public.private_chat_participants;
DROP TABLE IF EXISTS public.private_chats;
DROP TABLE IF EXISTS public.chat_messages;

ALTER TABLE public.contacts DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.contacts DROP COLUMN IF EXISTS is_authenticated;
ALTER TABLE public.students DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.students DROP COLUMN IF EXISTS registration_date;

DROP TABLE IF EXISTS public.user_profiles;
*/

