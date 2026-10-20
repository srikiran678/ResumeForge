import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, X } from 'lucide-react';
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
    <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-forge-100 pb-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-forge-800" />
            <span>Work & Internship Experience</span>
          </h2>
          <p className="text-xs text-forge-500">
            Professional roles, internships, or research assistantships with impact bullet points.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="py-8 text-center text-xs text-forge-400 bg-forge-50 rounded-lg border border-dashed border-forge-200">
          No experience added yet. (For students, you can emphasize Projects and Hackathons!)
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((exp, idx) => (
            <div key={exp.id} className="p-4 rounded-xl border border-forge-200 bg-forge-50/50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-forge-200">
                <span className="text-xs font-bold text-forge-700 uppercase tracking-wider">
                  Role #{idx + 1} (ID: {exp.id})
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  className="text-forge-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={exp.company}
                    onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Acme Corp or Tech Labs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Job Title / Position *</label>
                  <input
                    type="text"
                    required
                    value={exp.position}
                    onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Software Engineering Intern"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Seattle, WA (Hybrid)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-forge-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                      className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-forge-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                      className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                      placeholder="YYYY-MM or Present"
                    />
                  </div>
                </div>
              </div>

              {/* Responsibilities / Bullets */}
              <div className="pt-2 border-t border-forge-200">
                <label className="block text-[11px] font-semibold text-forge-700 mb-1.5">
                  Action & Impact Bullets
                </label>
                <div className="space-y-2 mb-2">
                  {exp.responsibilities.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2">
                      <span className="text-forge-400 mt-2 text-xs">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                        className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(exp.id, bIdx)}
                        className="text-forge-400 hover:text-rose-600 p-1.5 mt-1"
                        title="Remove bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                    placeholder="Add a new accomplishment bullet (Action verb + Task + Result)..."
                    className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddBullet(exp.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-forge-100 hover:bg-forge-200 text-forge-800 rounded"
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
