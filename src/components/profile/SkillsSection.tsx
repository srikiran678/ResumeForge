import React, { useState } from 'react';
import { Cpu, X, Plus, Terminal, Layers, Database, Cloud, Wrench, CheckCircle2 } from 'lucide-react';
import { MasterProfile } from '../../types';

interface SkillsSectionProps {
  skills: MasterProfile['skills'];
  onChange: (updated: MasterProfile['skills']) => void;
}

type SkillKey = keyof MasterProfile['skills'];

const CATEGORY_DEFINITIONS: { 
  key: SkillKey; 
  label: string; 
  icon: any; 
  placeholder: string;
  chipClass: string;
}[] = [
  { 
    key: 'languages', 
    label: 'Programming Languages', 
    icon: Terminal,
    placeholder: 'Python, TypeScript, Go, C++, Java (comma separated)...',
    chipClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
  },
  { 
    key: 'frameworks', 
    label: 'Frameworks & Runtimes', 
    icon: Layers,
    placeholder: 'React, Next.js, FastAPI, Node.js, Express...',
    chipClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
  },
  { 
    key: 'libraries', 
    label: 'Libraries & State Management', 
    icon: Cpu,
    placeholder: 'Redux Toolkit, PyTorch, Tailwind CSS, TanStack Query...',
    chipClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
  },
  { 
    key: 'databases', 
    label: 'Databases & Storage', 
    icon: Database,
    placeholder: 'PostgreSQL, Redis, MongoDB, Supabase, SQLite...',
    chipClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
  },
  { 
    key: 'cloud', 
    label: 'Cloud & DevOps Infrastructure', 
    icon: Cloud,
    placeholder: 'Docker, AWS (S3, Lambda), GitHub Actions, Kubernetes...',
    chipClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
  },
  { 
    key: 'tools', 
    label: 'Developer Tools & Systems', 
    icon: Wrench,
    placeholder: 'Git, Linux / Bash, Postman, Vite, Vercel...',
    chipClass: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
  },
  { 
    key: 'other', 
    label: 'Architecture & Methodologies', 
    icon: CheckCircle2,
    placeholder: 'REST APIs, Microservices, CI/CD, Agile / Scrum...',
    chipClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onChange }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const handleAddSkill = (categoryKey: SkillKey) => {
    const text = inputs[categoryKey]?.trim();
    if (!text) return;

    // Split if user pasted comma-separated items
    const rawItems = text.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    const existing = new Set(skills[categoryKey].map((s) => s.toLowerCase()));
    const newItems = rawItems.filter((item) => !existing.has(item.toLowerCase()));

    onChange({
      ...skills,
      [categoryKey]: [...skills[categoryKey], ...newItems],
    });

    setInputs({ ...inputs, [categoryKey]: '' });
  };

  const handleRemoveSkill = (categoryKey: SkillKey, skillToRemove: string) => {
    onChange({
      ...skills,
      [categoryKey]: skills[categoryKey].filter((s) => s !== skillToRemove),
    });
  };

  const totalSkillsCount = Object.values(skills).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-left transition-colors duration-150">
      <div className="border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-semibold mb-1.5">
            <Cpu className="size-3 text-indigo-500" />
            <span>ATS Semantic Match</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Technical Skills & Core Competencies
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Categorized skills ensure precise ATS matching without keyword-stuffing penalties.
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="tabular-nums">{totalSkillsCount}</span>
            <span className="text-[10px] font-sans font-normal text-slate-500">Total Skills</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORY_DEFINITIONS.map(({ key, label, icon: Icon, placeholder, chipClass }) => {
          const list = skills[key] || [];

          return (
            <div 
              key={key} 
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-3 transition-all"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Icon className="size-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {list.length}
                </span>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 min-h-[42px] bg-white dark:bg-[#1a1b22] p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08]">
                {list.length === 0 ? (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 italic py-1">
                    No skills in this category yet
                  </span>
                ) : (
                  list.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${chipClass}`}
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(key, skill)}
                        className="opacity-70 hover:opacity-100 hover:text-rose-500 transition-opacity cursor-pointer"
                        title={`Remove ${skill}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input for new skill */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={inputs[key] || ''}
                  onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(key);
                    }
                  }}
                  placeholder={placeholder}
                  className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(key)}
                  className="px-3.5 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
