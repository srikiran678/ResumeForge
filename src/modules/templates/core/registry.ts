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
    bestFor: 'Experienced Undergrads, Dual Majors, Extensive Projects',
    component: CompactTemplate,
  },
  academic: {
    id: 'academic',
    name: 'Academic & Research',
    badge: 'Higher Ed',
    description: 'Emphasizes Publications, Research, CGPA, and Academic Coursework.',
    bestFor: 'Grad School, Research Internships, Ph.D. / Master Candidates',
    component: AcademicTemplate,
  },
  hackathon: {
    id: 'hackathon',
    name: 'Hackathon & Builder',
    badge: 'Open Source',
    description: 'Brings Hackathons, Demo Links, and Flagship Projects to the foreground.',
    bestFor: 'Competitive Hackers, Open Source Contributors, Indie Hackers',
    component: HackathonTemplate,
  },
  executive: {
    id: 'executive',
    name: 'Executive & Leadership',
    badge: 'Leadership',
    description: 'Dual-line rules, executive competency matrix, strategic scope, corporate polish.',
    bestFor: 'Staff / Principal Engineers, Engineering Managers, Directors, Tech Leads',
    component: ExecutiveTemplate,
  },
  minimal: {
    id: 'minimal',
    name: 'Tech Minimalist',
    badge: 'Silicon Valley',
    description: 'Ultra-clean Swiss typography, sleek monochromatic hierarchy, distraction-free.',
    bestFor: 'Silicon Valley SWEs, Minimalist Developers, System Programmers',
    component: MinimalTemplate,
  },
  creative: {
    id: 'creative',
    name: 'Creative & Product',
    badge: 'Interactive',
    description: 'Contemporary indigo accents, skill badge pills, and project card highlights.',
    bestFor: 'UI/UX Engineers, Product Designers, Design Technologists, Frontend',
    component: CreativeTemplate,
  },
  elegant: {
    id: 'elegant',
    name: 'Ivy League & Wall Street',
    badge: 'Prestigious',
    description: 'Ivy League refined serif typography, centered formal header, high-finance polish.',
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
