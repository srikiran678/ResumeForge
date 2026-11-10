import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  FileCode2, 
  GraduationCap, 
  TrendingUp, 
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TemplateId } from '../../data/types/resume';

interface ShowcaseItem {
  id: TemplateId;
  key: string;
  name: string;
  badge: string;
  company: string;
  icon: React.ElementType;
  role: string;
  atsScore: string;
  font: string;
  margins: string;
  formula: string;
  description: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  bulletLead: string;
  sampleBullets: string[];
  techSkills: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'google-swe',
    key: 'google',
    name: 'Google SWE ATS Standard',
    badge: 'Silicon Valley Benchmark',
    company: 'Google / Alphabet',
    icon: FileCode2,
    role: 'Staff / Senior Software Engineer',
    atsScore: '99.4%',
    font: 'Inter / Roboto (Clean Sans)',
    margins: '0.65" balanced grid',
    formula: 'Google XYZ Accomplishment Formula',
    description: 'Enforces the canonical Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]". Features monospaced skill badges, systems impact, and clean horizontal delimiters.',
    accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    accentBorder: 'border-blue-500/40',
    accentText: 'text-blue-600 dark:text-blue-400',
    bulletLead: 'Google • Software Engineer III (Systems)',
    sampleBullets: [
      'Architected distributed caching proxy in Go/gRPC, processing 140k req/sec with p99 latency < 11ms, reducing Redis cluster costs by $1.8M annually (XYZ formula).',
      'Engineered multi-region failover pipeline for Spanner clusters across 4 continents, elevating availability SLA from 99.9% to 99.999% for 240M daily users.'
    ],
    techSkills: 'Go, C++, Distributed Systems, Kubernetes, gRPC, Protobuf, Spanner, Envoy, Prometheus'
  },
  {
    id: 'jakes-resume',
    key: 'jakes',
    name: "Jake's Resume (LaTeX Standard)",
    badge: 'Overleaf #1 Ranked',
    company: 'Open-Source Academic Legend',
    icon: Layers,
    role: 'Full-Stack & Systems Engineer',
    atsScore: '99.8%',
    font: 'Computer Modern Serif',
    margins: '0.5" compact rules',
    formula: 'Horizontal Delimiters & Baseline Dates',
    description: 'The world-famous open-source standard created by Jake Ryan. Zero multi-column parser traps, horizontal hairline dividers, baseline right-aligned dates, and maximal single-page density.',
    accentBg: 'bg-neutral-500/10 dark:bg-neutral-500/15',
    accentBorder: 'border-neutral-500/40',
    accentText: 'text-neutral-900 dark:text-neutral-200',
    bulletLead: 'Meta • Software Engineering Intern',
    sampleBullets: [
      'Engineered asynchronous webhook queue utilizing Kafka and Redis, absorbing 12M daily incoming events with zero packet loss during peak flash-sales.',
      'Implemented transactional database migration engine in Rust, cutting scheduled monthly maintenance windows from 4 hours to zero downtime.'
    ],
    techSkills: 'TypeScript, Rust, PostgreSQL, Redis, Kafka, Docker, GraphQL, Tailwind CSS'
  },
  {
    id: 'harvard-classic',
    key: 'harvard',
    name: 'Harvard Classic Standard',
    badge: 'Ivy League OCS / Mignone',
    company: 'Harvard University',
    icon: GraduationCap,
    role: 'Economics, Policy & Quantitative Research',
    atsScore: '99.1%',
    font: 'Times New Roman (Formal Serif)',
    margins: '0.75" classic scholarly',
    formula: 'Latin Honors & Empirical Rigor',
    description: 'Strictly modeled after Harvard Mignone Center for Career Success guidelines. Centered uppercase serif headings, Latin academic honors (magna cum laude), publications, and timeless formal prose.',
    accentBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    accentBorder: 'border-rose-500/40',
    accentText: 'text-rose-600 dark:text-rose-400',
    bulletLead: 'Harvard Berkman Klein Center • Research Fellow',
    sampleBullets: [
      'Authored empirical study on LLM alignment robustness cited by 18 peer-reviewed academic publications; presented oral session at NeurIPS 2024.',
      'Advised Federal Trade Commission antitrust working group on digital algorithmic collusions, drafting 3 core provisions included in final policy brief.'
    ],
    techSkills: 'Python, R, PyTorch, Causal Econometrics, Stata, LaTeX, Policy Analysis'
  },
  {
    id: 'wall-street',
    key: 'wallstreet',
    name: 'Wall Street & Goldman Sachs',
    badge: 'WSO / IB / PE Standard',
    company: 'Goldman Sachs / Morgan Stanley / WSO',
    icon: TrendingUp,
    role: 'Investment Banking & Private Equity Analyst',
    atsScore: '99.7%',
    font: 'Georgia / Times Roman',
    margins: '0.5" ultra-dense margins',
    formula: 'Deal Size ($M/B) & Transaction Metrics',
    description: 'The Wall Street Oasis (WSO) standard demanded across Goldman Sachs, Morgan Stanley, and top private equity funds. Omits casual summaries, packing maximum transaction deal volumes and valuation modeling.',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    bulletLead: 'Goldman Sachs • Investment Banking Analyst (M&A)',
    sampleBullets: [
      'Constructed dynamic 3-statement LBO and DCF financial models for $4.2B cross-border acquisition of enterprise SaaS market leader.',
      'Authored 48-page confidential information memorandum (CIM) and managed diligence data room for 16 strategic and financial sponsor bidders.'
    ],
    techSkills: 'LBO Modeling, M&A Due Diligence, DCF Valuation, PitchBook, CapitalIQ, Bloomberg'
  },
  {
    id: 'mckinsey-consulting',
    key: 'mckinsey',
    name: 'McKinsey Strategy Standard',
    badge: 'MBB Elite Consulting',
    company: 'McKinsey & Company / BCG / Bain',
    icon: Briefcase,
    role: 'Management Consultant / Engagement Manager',
    atsScore: '99.2%',
    font: 'Modern Executive Sans',
    margins: '0.6" structured blocks',
    formula: 'Hypothesis-Driven Client Impact',
    description: 'Engineered for top-tier management consulting. Focuses on structured problem-solving, C-suite executive alignment, cross-functional team workstreams, and direct client EBITDA improvements.',
    accentBg: 'bg-sky-500/10 dark:bg-sky-500/15',
    accentBorder: 'border-sky-500/40',
    accentText: 'text-sky-600 dark:text-sky-400',
    bulletLead: 'McKinsey & Company • Senior Associate',
    sampleBullets: [
      'Led 6-consultant workstream on global supply chain network optimization for Fortune 50 retailer, delivering $135M in validated annual run-rate EBITDA savings.',
      'Synthesized 240+ stakeholder interviews into Board-level digital strategy deck, accelerating automation roadmap implementation by 18 months.'
    ],
    techSkills: 'Growth Strategy, EBITDA Optimization, C-Suite Communications, Organizational Transformation'
  }
];

interface CompanyTemplatesShowcaseProps {
  onOpenGallery?: () => void;
}

export const CompanyTemplatesShowcase: React.FC<CompanyTemplatesShowcaseProps> = ({ onOpenGallery }) => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string>('google');

  const currentItem = SHOWCASE_ITEMS.find(item => item.key === selectedKey) || SHOWCASE_ITEMS[0];
  const CurrentIcon = currentItem.icon;

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-widest mb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Company &amp; Industry Standards</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Battle-Tested Templates from Top Tech, Finance &amp; Academia
          </h2>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Never guess what recruiters want. Every standard is reverse-engineered from verified hiring guidelines at Google, Goldman Sachs, Harvard, and McKinsey with guaranteed 99%+ ATS pass rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onOpenGallery) onOpenGallery();
              else navigate('/templates');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-semibold transition-colors cursor-pointer border border-outline-variant/30"
          >
            <span>Explore All 15 Templates</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {SHOWCASE_ITEMS.map((item) => {
          const isSelected = item.key === selectedKey;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setSelectedKey(item.key)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-surface-container text-on-surface border-primary/50 shadow-md scale-[1.02]'
                  : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? item.accentText : 'text-on-surface-variant'}`} />
              <span>{item.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${item.accentBg} ${item.accentText}`}>
                {item.atsScore} ATS
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Specification Column (5 cols) */}
        <div className="lg:col-span-5 p-7 rounded-2xl bg-surface-container flex flex-col justify-between border border-outline-variant/30 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl ${currentItem.accentBg} border ${currentItem.accentBorder}`}>
                  <CurrentIcon className={`w-5 h-5 ${currentItem.accentText}`} />
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {currentItem.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{currentItem.company}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${currentItem.accentBg} ${currentItem.accentText}`}>
                {currentItem.badge}
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {currentItem.description}
            </p>

            {/* Spec Checklist */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs">
                <span className="text-on-surface-variant">ATS Pass Rate</span>
                <span className="font-bold text-tertiary flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  {currentItem.atsScore} (Tier-1 Compliant)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs">
                <span className="text-on-surface-variant">Typography Engine</span>
                <span className="font-mono text-on-surface">{currentItem.font}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs">
                <span className="text-on-surface-variant">Margin Profile</span>
                <span className="font-mono text-on-surface">{currentItem.margins}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs">
                <span className="text-on-surface-variant">Target Impact Formula</span>
                <span className="font-semibold text-primary">{currentItem.formula}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-4">
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use this Format</span>
            </button>
            <span className="text-xs text-on-surface-variant">100% Free • No Paywalls</span>
          </div>
        </div>

        {/* Right Live Layout Rendering Simulator (7 cols) */}
        <div className="lg:col-span-7 p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-surface-container-high text-[11px] font-mono text-on-surface-variant border-b border-l border-outline-variant/30">
            Live Preview Parity • ISO A4 / US Letter
          </div>

          <div>
            {/* Mock Resume Top Header */}
            <div className={`pb-3 mb-4 border-b ${currentItem.key === 'jakes' || currentItem.key === 'wallstreet' ? 'border-neutral-900 text-center font-serif' : currentItem.key === 'harvard' ? 'border-neutral-900 text-center font-serif' : 'border-outline-variant text-left font-sans'}`}>
              <div className="text-lg font-bold text-on-surface tracking-tight uppercase">
                ALEXANDER J. CHEN
              </div>
              <div className="text-xs text-on-surface-variant mt-0.5">
                San Francisco, CA • alex.chen@alumni.edu • +1 (555) 019-2834 • github.com/alexchen • linkedin.com/in/alexchen
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-3">
              <div className={`text-xs font-bold uppercase tracking-wider text-on-surface border-b pb-1 ${currentItem.accentBorder}`}>
                Professional Experience
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs font-semibold text-on-surface">
                  <span>{currentItem.bulletLead}</span>
                  <span className="text-on-surface-variant font-normal">2022 — PRESENT</span>
                </div>

                <ul className="space-y-2 text-xs text-on-surface-variant">
                  {currentItem.sampleBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className={`mt-0.5 font-bold ${currentItem.accentText}`}>•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Skills or Competencies Section */}
            <div className="mt-5 space-y-2">
              <div className={`text-xs font-bold uppercase tracking-wider text-on-surface border-b pb-1 ${currentItem.accentBorder}`}>
                Skills &amp; Competencies
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface font-mono leading-relaxed">
                {currentItem.techSkills}
              </div>
            </div>
          </div>

          {/* Recruiter Verified Guarantee Pill */}
          <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5 text-tertiary font-medium">
              <CheckCircle2 className="w-4 h-4 text-tertiary" />
              Verified Workday, Taleo, Greenhouse &amp; Lever Parser Compatibility
            </span>
            <span className="text-[11px] font-mono text-outline">Deterministic PDF Parity</span>
          </div>
        </div>
      </div>
    </section>
  );
};
