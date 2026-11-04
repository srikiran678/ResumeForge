import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, Calendar, MapPin, Building, Sparkles } from 'lucide-react';
import { ExperienceItem } from '../../types';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, onChange }) => {
  const [bulletInputs, setBulletInputs] = useState<Record<string, string>>({});

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      location: 'Remote',
      startDate: '2024-05',
      endDate: '2024-08',
      current: false,
      technologies: [],
      responsibilities: ['Collaborated with cross-functional engineering teams to implement features.'],
    };
    onChange([...experience, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      experience.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  const handleAddBullet = (expId: string) => {
    const text = bulletInputs[expId]?.trim();
    if (!text) return;
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;

    handleUpdate(expId, 'responsibilities', [...exp.responsibilities, text]);
    setBulletInputs({ ...bulletInputs, [expId]: '' });
  };

  const handleRemoveBullet = (expId: string, index: number) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const updated = exp.responsibilities.filter((_, idx) => idx !== index);
    handleUpdate(expId, 'responsibilities', updated);
  };

  const handleUpdateBullet = (expId: string, index: number, newText: string) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const updated = [...exp.responsibilities];
    updated[index] = newText;
    handleUpdate(expId, 'responsibilities', updated);
  };

  return (
    <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-left transition-colors duration-150">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-6 gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-semibold mb-1.5">
            <Briefcase className="size-3 text-blue-500" />
            <span>Career History</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Work & Internship Experience</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Professional roles, internships, or research assistantships with measurable impact bullets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="py-12 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
            <Briefcase className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No work experience added yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            If you are a student without formal corporate roles, you can emphasize Technical Projects, Hackathons, and Open Source contributions!
          </p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Internship / Role</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((exp, idx) => (
            <div 
              key={exp.id} 
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-4 transition-all"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center size-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {exp.position || 'Position'} @ {exp.company || 'Company'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  title="Delete experience"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={exp.company}
                      onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      placeholder="e.g. Stripe or AWS"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Position <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={exp.position}
                    onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Software Engineering Intern"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      placeholder="e.g. Seattle, WA (Hybrid)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                        className="w-full text-xs pl-7 pr-2 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        placeholder="YYYY-MM"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                        className="w-full text-xs pl-7 pr-2 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        placeholder="YYYY-MM or Present"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsibilities / Bullets */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="size-3.5 text-amber-500" />
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Action & Impact Bullets (Google XYZ Format)
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Lead with active verbs (e.g. Architected, Optimized, Deployed)
                  </span>
                </div>

                <div className="space-y-2.5 mb-3">
                  {exp.responsibilities.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2">
                      <span className="size-1.5 rounded-full bg-blue-500 mt-3 shrink-0" />
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                        className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(exp.id, bIdx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors mt-1 cursor-pointer"
                        title="Remove bullet"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={bulletInputs[exp.id] || ''}
                    onChange={(e) =>
                      setBulletInputs({ ...bulletInputs, [exp.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBullet(exp.id);
                      }
                    }}
                    placeholder="Add an achievement bullet and press Enter..."
                    className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddBullet(exp.id)}
                    className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Add Bullet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
