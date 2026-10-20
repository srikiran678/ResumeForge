-- Migration: 20261016100000_create_master_profiles.sql
-- Description: Create master_profiles table to store the central career repository.

CREATE TABLE IF NOT EXISTS public.master_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_master_profiles_user_id ON public.master_profiles(user_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_master_profiles_updated_at ON public.master_profiles;
CREATE TRIGGER set_master_profiles_updated_at
  BEFORE UPDATE ON public.master_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.master_profiles ENABLE ROW LEVEL SECURITY;

-- Master Profiles RLS Policies (strictly owner only)
CREATE POLICY "Users can view their own master profile"
  ON public.master_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own master profile"
  ON public.master_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own master profile"
  ON public.master_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own master profile"
  ON public.master_profiles FOR DELETE
  USING (auth.uid() = user_id);
