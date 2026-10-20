import React, { useState } from 'react';
import { Cpu, X, Plus } from 'lucide-react';
import { MasterProfile } from '../../types';

interface SkillsSectionProps {
  skills: MasterProfile['skills'];
  onChange: (updated: MasterProfile['skills']) => void;
}

type SkillKey = keyof MasterProfile['skills'];

const CATEGORY_DEFINITIONS: { key: SkillKey; label: string; placeholder: string }[] = [
  { key: 'languages', label: 'Programming Languages', placeholder: 'Python, TypeScript, Go, C++...' },
  { key: 'frameworks', label: 'Frameworks', placeholder: 'React, Next.js, FastAPI, Node.js...' },
  { key: 'libraries', label: 'Libraries', placeholder: 'PyTorch, Redux, Socket.io, Tailwind...' },
  { key: 'databases', label: 'Databases & Storage', placeholder: 'PostgreSQL, Redis, MongoDB, SQLite...' },
  { key: 'cloud', label: 'Cloud & DevOps', placeholder: 'Docker, AWS (S3, EC2), GitHub Actions...' },
  { key: 'tools', label: 'Tools & Utilities', placeholder: 'Git, Linux/Bash, Postman, Vite...' },
  { key: 'other', label: 'Methodologies & Other', placeholder: 'RESTful APIs, Distributed Systems, Microservices...' },
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

  return (
    <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm text-left">
      <div className="border-b border-forge-100 pb-3 mb-5">
        <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-forge-800" />
          <span>Technical Skills & Core Competencies</span>
        </h2>
        <p className="text-xs text-forge-500">
          Categorized skills ensure precise ATS matching without keyword-stuffing penalties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORY_DEFINITIONS.map(({ key, label, placeholder }) => {
          const list = skills[key] || [];

          return (
            <div key={key} className="p-4 rounded-xl border border-forge-200 bg-forge-50/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-forge-800 uppercase tracking-wider">{label}</span>
                <span className="text-[10px] text-forge-400 font-mono">({list.length})</span>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 min-h-[36px] bg-white p-2 rounded-lg border border-forge-200">
                {list.length === 0 ? (
                  <span className="text-[11px] text-forge-400 italic">No skills added yet</span>
                ) : (
                  list.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-forge-100 text-forge-800 hover:bg-forge-200 transition-colors"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(key, skill)}
                        className="text-forge-400 hover:text-rose-600 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input for new skill */}
              <div className="flex space-x-1.5 pt-1">
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
                  className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(key)}
                  className="px-3 py-1.5 text-xs font-medium bg-forge-900 text-white rounded hover:bg-forge-800 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
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
