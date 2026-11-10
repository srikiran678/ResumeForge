import { ResumeData, TemplateId } from '@/data/types';

export interface DesignerIntent {
  type: 'TEMPLATE' | 'STYLE' | 'LAYOUT' | 'CONTENT' | 'COMPOSITE';
  action: string;
  templateId?: TemplateId;
  accentColor?: string;
  fontFamily?: string;
  fontSize?: 'sm' | 'base' | 'md';
  spacing?: 'compact' | 'normal' | 'relaxed';
  reorderTarget?: string;
  reorderPosition?: 'top' | 'bottom';
  rewriteStyle?: 'google-xyz' | 'quantified' | 'leadership';
  explanation: string;
}

export interface DesignerPromptChip {
  id: string;
  label: string;
  iconName: string;
  prompt: string;
  category: 'format' | 'style' | 'content' | 'layout';
}

export interface DesignerExecutionResult {
  success: boolean;
  message: string;
  changes: string[];
  previousStateSnapshot?: ResumeData;
  quotaUsed: boolean;
}
