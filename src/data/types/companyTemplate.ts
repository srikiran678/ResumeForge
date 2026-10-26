export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  official_careers_url?: string | null;
  description?: string | null;
  created_at?: string;
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  experience_level: string;
  created_at?: string;
}

export interface TemplateSource {
  id?: string;
  template_id?: string;
  source_url: string;
  license_name: string;
  license_url?: string | null;
  attribution?: string | null;
  file_hash: string;
  verification_status: 'verified' | 'license_review_required' | 'rejected';
  verified_at?: string;
}

export interface CompanyTemplate {
  id: string;
  name: string;
  description?: string | null;
  layout_style: string;
  experience_level: string;
  publication_status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';
  preview_url?: string | null;
  asset_url?: string | null;
  template_data?: Record<string, any>;
  companies?: Company[];
  roles?: JobRole[];
  source?: TemplateSource;
  created_at?: string;
  updated_at?: string;
}

export interface JobRequirement {
  id: string;
  company_id: string;
  role_id: string;
  source_url?: string | null;
  skills: string[];
  keywords: string[];
  recommended_sections: string[];
  last_checked_at?: string;
  company?: Company;
  role?: JobRole;
}

export interface AgentRun {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  finished_at?: string | null;
  results?: {
    discovered?: number;
    imported?: number;
    duplicates?: number;
    errors?: number;
    sourcesChecked?: number;
    log?: Array<{ timestamp: string; level: 'info' | 'warn' | 'error'; message: string }>;
  };
  error_summary?: string | null;
  trigger_type: 'manual' | 'scheduled' | 'cron';
}

export interface TemplateReview {
  id: string;
  template_id: string;
  reviewer_id?: string | null;
  reviewer_email?: string | null;
  decision: 'approved' | 'rejected' | 'changes_requested';
  notes?: string | null;
  reviewed_at: string;
}

export interface TemplateFilterState {
  companySlug?: string;
  roleCategory?: string;
  experienceLevel?: string;
  layoutStyle?: string;
  searchQuery?: string;
  selectedSkill?: string;
}
