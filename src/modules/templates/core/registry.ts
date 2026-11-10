import React from 'react';
import { ResumeData, TemplateId } from '@/data/types';
import {
  ClassicTemplate,
  ModernTemplate,
  CompactTemplate,
  AcademicTemplate,
  HackathonTemplate,
  ExecutiveTemplate,
  MinimalTemplate,
  CreativeTemplate,
  ElegantTemplate,
  TechnicalTemplate,
  ClassicResumeTemplate,
  JakesResumeTemplate,
  GoogleSWETemplate,
  HarvardClassicTemplate,
  WallStreetTemplate,
  McKinseyTemplate,
} from '../definitions';

export interface ResumeTemplateProps {
  resume: ResumeData;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  badge?: string;
  description: string;
  bestFor: string;
  component: React.FC<ResumeTemplateProps>;
}

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  classic: {
    id: 'classic',
    name: 'Classic Editorial',
    badge: 'Enterprise Standard',
    description: 'Serif headings, high contrast, clean horizontal rules. Timeless traditional layout.',
    bestFor: 'Corporate SWE, Finance, Enterprise Tech, Research',
    component: ClassicTemplate,
  },
  modern: {
    id: 'modern',
    name: 'Modern Clean',
    badge: 'Popular',
    description: 'Clean sans-serif typography, subtle badge accents, contemporary spacing.',
    bestFor: 'Startups, Product Engineering, Full-Stack, Frontend',
    component: ModernTemplate,
  },
  compact: {
    id: 'compact',
    name: 'Compact Density',
    badge: '1-Page Max',
    description: 'Tight margins and dense item rows. Maximizes information per vertical inch.',
    bestFor: 'Experienced Engineers, Dense Work History, SREs',
    component: CompactTemplate,
  },
  academic: {
    id: 'academic',
    name: 'Academic CV',
    badge: 'Research & Labs',
    description: 'Formal serif structure prioritizing publications, coursework, lab research, and degrees.',
    bestFor: 'Ph.D., M.S., Research Scientists, ML Researchers',
    component: AcademicTemplate,
  },
  hackathon: {
    id: 'hackathon',
    name: 'Hackathon Builder',
    badge: 'Project Heavy',
    description: 'Terminal-inspired accent styling with prominent project cards and demo links.',
    bestFor: 'Open Source Contributors, Hackathon Winners, Indie Hackers',
    component: HackathonTemplate,
  },
  executive: {
    id: 'executive',
    name: 'Executive Leadership',
    badge: 'Management',
    description: 'Refined serif typography with prominent leadership summary and executive presence.',
    bestFor: 'Engineering Managers, Directors, VP of Eng, Product Leaders',
    component: ExecutiveTemplate,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Monochrome',
    badge: 'ATS Safe',
    description: 'Ultra-clean black and white layout with zero distracting embellishments.',
    bestFor: 'General Tech, Systems Engineering, Strict ATS Applications',
    component: MinimalTemplate,
  },
  creative: {
    id: 'creative',
    name: 'Creative Product',
    badge: 'Design / UX',
    description: 'Modern sans-serif typography with generous line-height and contemporary structure.',
    bestFor: 'Design Engineers, Product Designers, Developer Advocates',
    component: CreativeTemplate,
  },
  elegant: {
    id: 'elegant',
    name: 'Ivy League & FinTech',
    badge: 'Prestige',
    description: 'Refined serif typography, centered formal header, high-finance polish.',
    bestFor: 'Quantitative Finance, FinTech, Management Consulting, Dual Degrees',
    component: ElegantTemplate,
  },
  technical: {
    id: 'technical',
    name: 'Cloud & Systems Architect',
    badge: 'DevOps / Cloud',
    description: 'Cloud/DevOps skill matrix, certifications showcase, systems-level architecture focus.',
    bestFor: 'DevOps, SRE, Cloud Architects, Distributed Systems Engineers',
    component: TechnicalTemplate,
  },
  'classic-resume': {
    id: 'classic-resume',
    name: 'Classic Resume',
    badge: 'Campus Placement',
    description: 'Traditional formal resume with 5-column education table, technical skill groups, and declaration statement.',
    bestFor: 'College Students, Freshers, Entry-Level SWE, Campus Placements',
    component: ClassicResumeTemplate,
  },
  // High-Value Company & Industry Standard Templates
  'jakes-resume': {
    id: 'jakes-resume',
    name: "Jake's LaTeX Resume",
    badge: 'Gold Standard',
    description: 'The world-famous r/EngineeringResumes open-source LaTeX template. Razor-sharp horizontal rules, date baseline alignment, and 100% ATS score.',
    bestFor: 'Software Engineers, CS Students, Big Tech (FAANG/MAANG), Systems Programmers',
    component: JakesResumeTemplate,
  },
  'google-swe': {
    id: 'google-swe',
    name: 'Google SWE (XYZ Formula)',
    badge: 'Google Standard',
    description: 'Single-column high-signal engineering layout prioritizing Laszlo Bock XYZ metrics ("Accomplished X, measured by Y, by doing Z") and system architecture.',
    bestFor: 'Google, Meta, Systems Engineering, High-Scale Backend & Distributed Systems',
    component: GoogleSWETemplate,
  },
  'harvard-classic': {
    id: 'harvard-classic',
    name: 'Harvard Academic & Pro',
    badge: 'Ivy League',
    description: 'Official Harvard Mignone Center format. Traditional centered header, academic standing metrics, and conservative executive polish.',
    bestFor: 'Consulting, Legal, Dual-Degrees, Corporate Strategy, University Placement',
    component: HarvardClassicTemplate,
  },
  'wall-street': {
    id: 'wall-street',
    name: 'Wall Street & Investment Banking',
    badge: 'Wall Street Oasis',
    description: 'Strict Bulge Bracket (Goldman, Morgan Stanley) standard. 0.5" tight margins, transaction metrics ($M/B), SAT/GPA prominence, zero fluff.',
    bestFor: 'Investment Banking, Quantitative Finance, Private Equity, Hedge Funds',
    component: WallStreetTemplate,
  },
  'mckinsey-consulting': {
    id: 'mckinsey-consulting',
    name: 'McKinsey Strategy Consulting',
    badge: 'MBB Standard',
    description: 'Elite management consulting layout. Structured problem solving, organizational scale, leadership impact, and executive communication.',
    bestFor: 'McKinsey, BCG, Bain, Tech Product Managers, Strategy Leads',
    component: McKinseyTemplate,
  },
};

export const TemplateRegistry = {
  get(id?: TemplateId): React.FC<ResumeTemplateProps> {
    const match = id && TEMPLATE_REGISTRY[id];
    return match ? match.component : ClassicTemplate;
  },

  getDefinition(id?: TemplateId): TemplateDefinition | undefined {
    return id ? TEMPLATE_REGISTRY[id] : undefined;
  },

  getAll(): TemplateDefinition[] {
    return Object.values(TEMPLATE_REGISTRY);
  },

  register(id: TemplateId, definition: TemplateDefinition): void {
    TEMPLATE_REGISTRY[id] = definition;
  },

  has(id: string): id is TemplateId {
    return id in TEMPLATE_REGISTRY;
  },
};

export function getTemplate(id?: TemplateId): React.FC<ResumeTemplateProps> {
  return TemplateRegistry.get(id);
}

export function getAllTemplates(): TemplateDefinition[] {
  return TemplateRegistry.getAll();
}
