import React from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from 'lucide-react';
import { ResumeData } from '../../types';

interface SectionManagerProps {
  resume: ResumeData;
  onUpdate: (updater: (prev: ResumeData) => ResumeData) => void;
}

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary / Profile',
  education: 'Education',
  work: 'Experience / Work History',
  projects: 'Projects',
  skills: 'Technical Skills',
  hackathons: 'Hackathons & Competitions',
  achievements: 'Achievements & Honors',
  certificates: 'Certifications',
  volunteering: 'Volunteering & Leadership',
};

export const SectionManager: React.FC<SectionManagerProps> = ({ resume, onUpdate }) => {
  const currentOrder = resume.meta.sectionOrder || [
    'summary',
    'education',
    'work',
    'projects',
    'skills',
    'hackathons',
    'achievements',
    'certificates',
    'volunteering',
  ];
  const hiddenSections = new Set(resume.meta.hiddenSections || []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    onUpdate((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        sectionOrder: newOrder,
      },
    }));
  };

  const toggleHide = (sectionKey: string) => {
    const updatedHidden = new Set(hiddenSections);
    if (updatedHidden.has(sectionKey)) {
      updatedHidden.delete(sectionKey);
    } else {
      updatedHidden.add(sectionKey);
    }

    onUpdate((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        hiddenSections: Array.from(updatedHidden),
      },
    }));
  };

  return (
    <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-forge-900 dark:text-white">Section Order & Visibility</h3>
          <p className="text-[11px] text-forge-500 dark:text-slate-400">Reorder top-to-bottom or hide sections without deleting data.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {currentOrder.map((sectionKey, idx) => {
          const isHidden = hiddenSections.has(sectionKey);
          const label = SECTION_LABELS[sectionKey] || sectionKey;

          return (
            <div
              key={sectionKey}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                isHidden
                  ? 'bg-forge-50 dark:bg-white/[0.03] border-forge-200 dark:border-white/[0.05] text-forge-400 dark:text-slate-500'
                  : 'bg-white dark:bg-[#1a1b20] border-forge-200 dark:border-white/[0.07] text-forge-900 dark:text-white hover:border-forge-300 dark:hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GripVertical className="w-3.5 h-3.5 text-forge-400 dark:text-slate-500 cursor-grab" />
                <span className={isHidden ? 'line-through opacity-70' : 'font-medium'}>{label}</span>
                {isHidden && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-forge-200 dark:bg-white/[0.08] text-forge-600 dark:text-slate-400 rounded">
                    Hidden
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  title="Move section up"
                  className="p-1 rounded text-forge-500 hover:text-forge-900 dark:text-slate-400 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === currentOrder.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  title="Move section down"
                  className="p-1 rounded text-forge-500 hover:text-forge-900 dark:text-slate-400 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Visibility */}
                <button
                  type="button"
                  onClick={() => toggleHide(sectionKey)}
                  title={isHidden ? 'Restore section' : 'Hide section'}
                  className={`p-1 rounded transition-colors ${
                    isHidden
                      ? 'text-forge-400 hover:text-forge-700 dark:hover:text-slate-200 hover:bg-forge-100 dark:hover:bg-white/[0.08]'
                      : 'text-forge-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  }`}
                >
                  {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
