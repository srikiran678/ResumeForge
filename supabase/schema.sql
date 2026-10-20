-- ==============================================================================
-- ResumeForge: Production Database Schema & Row Level Security (RLS)
-- ATS-First Free Resume Builder & Career Workspace
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Master Profiles Table (Central Source of Truth)
create table if not exists public.master_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  personal_info jsonb not null default '{}'::jsonb,
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  skills jsonb not null default '{"languages":[],"frameworks":[],"libraries":[],"databases":[],"cloud":[],"tools":[],"other":[]}'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  hackathons jsonb not null default '[]'::jsonb,
  volunteering jsonb not null default '[]'::jsonb,
  open_source jsonb not null default '[]'::jsonb,
  publications jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Resumes Table
create table if not exists public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled Resume',
  target_role text,
  target_company text,
  data jsonb not null, -- Structured ResumeData JSON
  is_archived boolean default false not null,
  is_trash boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Resume Versions Table (Supports version history, compare, rollback)
create table if not exists public.resume_versions (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references public.resumes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  version_number text not null,
  version_name text,
  data jsonb not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Applications Table (Job Application Tracker)
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  role text not null,
  job_url text,
  location text,
  deadline date,
  application_date date,
  resume_id uuid references public.resumes(id) on delete set null,
  resume_version text,
  resume_snapshot jsonb, -- Immutable snapshot of ResumeData when marked "Applied"
  status text not null default 'Interested',
  notes text default '',
  interview_date timestamp with time zone,
  contact_name text,
  contact_email text,
  salary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. AI Usage Table (Strict server-side 20 calls/day quota)
create table if not exists public.ai_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_date date not null default current_date,
  calls_count integer not null default 0,
  max_daily_calls integer not null default 20,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, usage_date)
);

-- 7. AI Request Logs
create table if not exists public.ai_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  operation text not null,
  prompt_chars integer not null,
  success boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Public Resume Links (Random non-sequential slugs e.g. /r/a8F4k29Lm)
create table if not exists public.public_resume_links (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references public.resumes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text not null unique,
  access_type text not null default 'public', -- 'public' | 'unlisted' | 'private'
  views_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Portfolio Profiles Table
create table if not exists public.portfolio_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  slug text not null unique,
  tagline text,
  bio text,
  theme text not null default 'clean',
  show_qr_code boolean not null default true,
  included_sections jsonb not null default '["projects","experience","skills","hackathons","education"]'::jsonb,
  custom_links jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.master_profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_versions enable row level security;
alter table public.applications enable row level security;
alter table public.ai_usage enable row level security;
alter table public.ai_logs enable row level security;
alter table public.public_resume_links enable row level security;
alter table public.portfolio_profiles enable row level security;

-- Profiles: Users can view & update only their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Master Profiles: Only owner can view, insert, update, delete
create policy "Users can access own master profile" on public.master_profiles
  for all using (auth.uid() = user_id);

-- Resumes: Only owner can access
create policy "Users can access own resumes" on public.resumes
  for all using (auth.uid() = user_id);

-- Resume Versions: Only owner can access
create policy "Users can access own resume versions" on public.resume_versions
  for all using (auth.uid() = user_id);

-- Applications: Only owner can access
create policy "Users can access own applications" on public.applications
  for all using (auth.uid() = user_id);

-- AI Usage: Only owner can view
create policy "Users can view own AI usage" on public.ai_usage
  for select using (auth.uid() = user_id);

-- AI Logs: Only owner can view
create policy "Users can view own AI logs" on public.ai_logs
  for select using (auth.uid() = user_id);

-- Public Resume Links:
-- Owner can CRUD
create policy "Owners manage public resume links" on public.public_resume_links
  for all using (auth.uid() = user_id);

-- Anyone can read public/unlisted resume links
create policy "Anyone can view public resumes by slug" on public.public_resume_links
  for select using (access_type in ('public', 'unlisted'));

-- Anyone can read resume data if linked to an active public resume link
create policy "Anyone can view resume if published" on public.resumes
  for select using (
    exists (
      select 1 from public.public_resume_links
      where public_resume_links.resume_id = resumes.id
      and public_resume_links.access_type in ('public', 'unlisted')
    )
  );

-- Portfolio Profiles:
create policy "Owners manage portfolio" on public.portfolio_profiles
  for all using (auth.uid() = user_id);

create policy "Anyone can view published portfolios" on public.portfolio_profiles
  for select using (true);

-- Indexes for high performance
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resume_versions_resume_id on public.resume_versions(resume_id);
create index if not exists idx_applications_user_id on public.applications(user_id);
create index if not exists idx_public_links_slug on public.public_resume_links(slug);
create index if not exists idx_portfolio_slug on public.portfolio_profiles(slug);
