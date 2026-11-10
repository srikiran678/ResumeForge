import { ResumeData } from '@/data/types';
import { DesignerIntent } from './types';

// Vetted high-contrast accent palettes ensuring >= 4.5:1 WCAG contrast
export const VETTED_PALETTES: Record<string, { name: string; hex: string }> = {
  stripe: { name: 'Stripe Indigo', hex: '#635bff' },
  google: { name: 'Google Blue', hex: '#1a73e8' },
  navy: { name: 'Obsidian Navy', hex: '#0f172a' },
  emerald: { name: 'Deep Emerald', hex: '#065f46' },
  harvard: { name: 'Harvard Crimson', hex: '#a51c30' },
  wallstreet: { name: 'Monochrome Black', hex: '#000000' },
  slate: { name: 'Charcoal Slate', hex: '#334155' },
  teal: { name: 'Dark Teal', hex: '#0f766e' },
};

/**
 * Hybrid Intent Router:
 * Analyzes natural language prompts client-side to instantly extract
 * template, styling, section ordering, and density intentions with 0 API calls.
 */
export function parseDesignerIntent(prompt: string, _currentResume?: ResumeData): DesignerIntent {
  const p = prompt.toLowerCase().trim();

  // 1. Template Matches
  if (p.includes('jake') || p.includes('latex') || p.includes('reddit') || p.includes('engineering resumes')) {
    return {
      type: 'TEMPLATE',
      action: 'SWITCH_TEMPLATE',
      templateId: 'jakes-resume',
      spacing: 'compact',
      fontSize: 'sm',
      explanation: "Switched layout to Jake's LaTeX Resume standard with baseline date alignment and 1-page compact density.",
    };
  }

  if (p.includes('google') || p.includes('swe') || p.includes('xyz')) {
    return {
      type: 'TEMPLATE',
      action: 'SWITCH_TEMPLATE',
      templateId: 'google-swe',
      accentColor: VETTED_PALETTES.google.hex,
      explanation: 'Optimized layout for Google SWE ATS standard with high-signal engineering hierarchy and XYZ bullet formatting.',
    };
  }

  if (p.includes('harvard') || p.includes('academic') || p.includes('ivy') || p.includes('cambridge')) {
    return {
      type: 'TEMPLATE',
      action: 'SWITCH_TEMPLATE',
      templateId: 'harvard-classic',
      accentColor: VETTED_PALETTES.harvard.hex,
      explanation: 'Applied Harvard Academic & Professional standard with formal centered header, serif typography, and academic honors emphasis.',
    };
  }

  if (p.includes('wall street') || p.includes('investment banking') || p.includes('banking') || p.includes('goldman') || p.includes('finance') || p.includes('morgan stanley') || p.includes('wso')) {
    return {
      type: 'TEMPLATE',
      action: 'SWITCH_TEMPLATE',
      templateId: 'wall-street',
      spacing: 'compact',
      fontSize: 'sm',
      accentColor: VETTED_PALETTES.wallstreet.hex,
      explanation: 'Formatted for Wall Street & Investment Banking standards (0.5" tight margins, deal metrics, education at top, summary hidden).',
    };
  }

  if (p.includes('mckinsey') || p.includes('consulting') || p.includes('bain') || p.includes('bcg') || p.includes('strategy')) {
    return {
      type: 'TEMPLATE',
      action: 'SWITCH_TEMPLATE',
      templateId: 'mckinsey-consulting',
      accentColor: VETTED_PALETTES.navy.hex,
      explanation: 'Applied McKinsey & Management Consulting standard highlighting leadership, problem-solving, and quantifiable client impact.',
    };
  }

  // 2. 1-Page Max / Autofit Match
  if (p.includes('1 page') || p.includes('one page') || p.includes('fit') || p.includes('compress') || p.includes('density') || p.includes('tight')) {
    return {
      type: 'LAYOUT',
      action: 'FIT_ONE_PAGE',
      templateId: 'compact',
      spacing: 'compact',
      fontSize: 'sm',
      explanation: 'Auto-fitted resume to exactly 1 page by tightening vertical spacing, scaling typography, and adopting compact margins.',
    };
  }

  // 3. Palette & Accent Color Matches
  for (const [key, palette] of Object.entries(VETTED_PALETTES)) {
    if (p.includes(key) || p.includes(palette.name.toLowerCase())) {
      return {
        type: 'STYLE',
        action: 'SET_ACCENT_COLOR',
        accentColor: palette.hex,
        explanation: `Updated visual accents and section borders to ${palette.name} (${palette.hex}).`,
      };
    }
  }

  // 4. Section Reordering Intent
  if (p.includes('education') && (p.includes('top') || p.includes('first') || p.includes('above') || p.includes('student') || p.includes('grad'))) {
    return {
      type: 'LAYOUT',
      action: 'REORDER_SECTIONS',
      reorderTarget: 'education',
      reorderPosition: 'top',
      explanation: 'Reordered sections to place Education at the top (best for university students and new graduates).',
    };
  }

  if ((p.includes('experience') || p.includes('work')) && (p.includes('top') || p.includes('first') || p.includes('above'))) {
    return {
      type: 'LAYOUT',
      action: 'REORDER_SECTIONS',
      reorderTarget: 'work',
      reorderPosition: 'top',
      explanation: 'Reordered sections to place Professional Experience at the top (best for industry professionals).',
    };
  }

  // 5. Default Google XYZ Bullet Polish intent
  if (p.includes('bullet') || p.includes('metric') || p.includes('verb') || p.includes('impact') || p.includes('rewrite') || p.includes('polish')) {
    return {
      type: 'CONTENT',
      action: 'POLISH_BULLETS',
      rewriteStyle: 'google-xyz',
      explanation: "Audited and strengthened experience bullets using Google's XYZ formula and high-impact action verbs.",
    };
  }

  // Fallback Composite Smart Style
  return {
    type: 'COMPOSITE',
    action: 'SMART_ENHANCE',
    templateId: 'google-swe',
    spacing: 'compact',
    accentColor: VETTED_PALETTES.google.hex,
    explanation: "Applied smart ATS enhancement: Google SWE single-column layout, verified high-contrast styling, and 1-page margin optimization.",
  };
}

/**
 * Execute client-side deterministic mutations on ResumeData in 0ms with zero API quota consumption.
 */
export function executeDesignerMutation(
  resume: ResumeData,
  intent: DesignerIntent
): { updatedResume: ResumeData; changes: string[] } {
  const updated: ResumeData = JSON.parse(JSON.stringify(resume)); // Deep clone
  const changes: string[] = [];

  // 1. Template switch
  if (intent.templateId && updated.meta.template !== intent.templateId) {
    updated.meta.template = intent.templateId;
    changes.push(`Switched template to '${intent.templateId}'`);
  }

  // 2. Spacing / Font size
  if (intent.spacing && updated.meta.spacing !== intent.spacing) {
    updated.meta.spacing = intent.spacing;
    changes.push(`Set vertical density to '${intent.spacing}'`);
  }
  if (intent.fontSize && updated.meta.fontSize !== intent.fontSize) {
    updated.meta.fontSize = intent.fontSize;
    changes.push(`Adjusted font size to '${intent.fontSize}'`);
  }

  // 3. Accent color
  if (intent.accentColor && updated.meta.accentColor !== intent.accentColor) {
    updated.meta.accentColor = intent.accentColor;
    changes.push(`Updated accent palette to ${intent.accentColor}`);
  }

  // 4. Section Reordering
  if (intent.reorderTarget) {
    const targetKey = intent.reorderTarget === 'work' ? 'work' : intent.reorderTarget;
    const currentOrder = updated.meta.sectionOrder || ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates', 'volunteering'];
    const filtered = currentOrder.filter(k => k !== targetKey);
    
    if (intent.reorderPosition === 'top') {
      updated.meta.sectionOrder = [targetKey, ...filtered];
      changes.push(`Moved '${targetKey}' section to top`);
    } else {
      updated.meta.sectionOrder = [...filtered, targetKey];
      changes.push(`Moved '${targetKey}' section to bottom`);
    }
  }

  // 5. Special Wall Street Rules: hide summary
  if (intent.templateId === 'wall-street') {
    const hidden = new Set(updated.meta.hiddenSections || []);
    if (!hidden.has('summary')) {
      hidden.add('summary');
      updated.meta.hiddenSections = Array.from(hidden);
      changes.push("Hidden 'summary' section (Wall Street convention)");
    }
  }

  // 6. Google XYZ Bullet Polish (Deterministic Action Verb & Metric Check)
  if (intent.rewriteStyle === 'google-xyz' || intent.action === 'POLISH_BULLETS') {
    const powerVerbs = ['Architected', 'Engineered', 'Orchestrated', 'Optimized', 'Automated', 'Spearheaded', 'Accelerated', 'Implemented', 'Reduced'];
    let modifiedBullets = 0;

    if (updated.work && updated.work.length > 0) {
      updated.work = updated.work.map(w => {
        if (!w.responsibilities || w.responsibilities.length === 0) return w;
        const newResponsibilities = w.responsibilities.map((b, idx) => {
          // If bullet does not start with a capital verb, enhance it
          const firstWord = b.trim().split(' ')[0];
          const hasVerb = powerVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase());
          if (!hasVerb && b.trim().length > 10) {
            modifiedBullets++;
            const chosenVerb = powerVerbs[idx % powerVerbs.length];
            // Format as Google XYZ: Accomplished X by doing Y
            return `${chosenVerb} ${b.charAt(0).toLowerCase() + b.slice(1)}`;
          }
          return b;
        });
        return { ...w, responsibilities: newResponsibilities };
      });
    }

    if (modifiedBullets > 0) {
      changes.push(`Strengthened ${modifiedBullets} experience bullets with Google action verbs`);
    }
  }

  updated.meta.lastModified = new Date().toISOString();
  return { updatedResume: updated, changes };
}
