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
    <div className="bg-white border border-forge-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-forge-900">Section Order & Visibility</h3>
          <p className="text-[11px] text-forge-500">Reorder top-to-bottom or hide sections without deleting data.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {currentOrder.map((sectionKey, idx) => {
          const isHidden = hiddenSections.has(sectionKey);
          const label = SECTION_LABELS[sectionKey] || sectionKey;

          return (
            <div
              key={sectionKey}
              className={`flex items-center justify-between p-2 rounded-md border text-xs transition-colors ${
                isHidden
                  ? 'bg-forge-50 border-forge-200 text-forge-400'
                  : 'bg-white border-forge-200 text-forge-900 hover:border-forge-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GripVertical className="w-3.5 h-3.5 text-forge-400 cursor-grab" />
                <span className={isHidden ? 'line-through' : 'font-medium'}>{label}</span>
                {isHidden && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-forge-200 text-forge-600 rounded">
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
                  className="p-1 rounded text-forge-500 hover:text-forge-900 hover:bg-forge-100 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === currentOrder.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  title="Move section down"
                  className="p-1 rounded text-forge-500 hover:text-forge-900 hover:bg-forge-100 disabled:opacity-30 disabled:hover:bg-transparent"
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
                      ? 'text-forge-400 hover:text-forge-700 hover:bg-forge-100'
                      : 'text-forge-600 hover:text-rose-600 hover:bg-rose-50'
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
