-- Migration: 20261026000000_create_template_library.sql
-- Description: Company-Wise Resume Template Library, Agent Runs, Sources, and Job Requirements.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  official_careers_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ROLES
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  experience_level TEXT NOT NULL DEFAULT 'All',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_roles_title_level UNIQUE (title, experience_level)
);

-- 3. TEMPLATES
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  preview_url TEXT,
  asset_url TEXT,
  layout_style TEXT NOT NULL DEFAULT 'single-column',
  experience_level TEXT NOT NULL DEFAULT 'All',
  publication_status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'pending_review', 'published', 'rejected', 'archived'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TEMPLATE_COMPANIES (many-to-many)
CREATE TABLE IF NOT EXISTS public.template_companies (
  template_id TEXT NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, company_id)
);

-- 5. TEMPLATE_ROLES (many-to-many)
CREATE TABLE IF NOT EXISTS public.template_roles (
  template_id TEXT NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, role_id)
);

-- 6. TEMPLATE_SOURCES
CREATE TABLE IF NOT EXISTS public.template_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id TEXT NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  license_name TEXT NOT NULL,
  license_url TEXT,
  attribution TEXT,
  file_hash TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'verified', -- 'verified', 'license_review_required', 'rejected'
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. JOB_REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.job_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  source_url TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_company_role_requirements UNIQUE (company_id, role_id)
);

-- 8. AGENT_RUNS
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  results JSONB DEFAULT '{}'::jsonb,
  error_summary TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'manual' -- 'manual', 'scheduled', 'cron'
);

-- 9. TEMPLATE_REVIEWS
CREATE TABLE IF NOT EXISTS public.template_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id TEXT NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  reviewer_id UUID,
  reviewer_email TEXT,
  decision TEXT NOT NULL, -- 'approved', 'rejected', 'changes_requested'
  notes TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-performance filtering
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_roles_category ON public.roles(category);
CREATE INDEX IF NOT EXISTS idx_templates_status ON public.templates(publication_status);
CREATE INDEX IF NOT EXISTS idx_template_sources_hash ON public.template_sources(file_hash);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at ON public.agent_runs(started_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access policies for published catalog
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Anyone can view roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Anyone can view published templates" ON public.templates FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Anyone can view template companies" ON public.template_companies FOR SELECT USING (true);
CREATE POLICY "Anyone can view template roles" ON public.template_roles FOR SELECT USING (true);
CREATE POLICY "Anyone can view verified template sources" ON public.template_sources FOR SELECT USING (true);
CREATE POLICY "Anyone can view job requirements" ON public.job_requirements FOR SELECT USING (true);

-- Authenticated user / service role administrative policies
CREATE POLICY "Admins can manage companies" ON public.companies FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage roles" ON public.roles FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage all templates" ON public.templates FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage template companies" ON public.template_companies FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage template roles" ON public.template_roles FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage template sources" ON public.template_sources FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage job requirements" ON public.job_requirements FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can view and manage agent runs" ON public.agent_runs FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins can manage template reviews" ON public.template_reviews FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
