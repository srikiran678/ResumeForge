import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, X, BookOpen, Calendar, MapPin, Award } from 'lucide-react';
import { EducationItem } from '../../types';

interface EducationSectionProps {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education, onChange }) => {
  const [courseworkInputs, setCourseworkInputs] = useState<Record<string, string>>({});

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2021-09',
      endDate: '2025-06',
      current: true,
      cgpa: '',
      location: '',
      coursework: [],
    };
    onChange([...education, newItem]);
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: any) => {
    onChange(
      education.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const handleAddCoursework = (eduId: string) => {
    const text = courseworkInputs[eduId]?.trim();
    if (!text) return;
    const edu = education.find((e) => e.id === eduId);
    if (!edu) return;

    handleUpdate(eduId, 'coursework', [...edu.coursework, text]);
    setCourseworkInputs({ ...courseworkInputs, [eduId]: '' });
  };

  const handleRemoveCoursework = (eduId: string, index: number) => {
    const edu = education.find((e) => e.id === eduId);
    if (!edu) return;
    const updated = edu.coursework.filter((_, idx) => idx !== index);
    handleUpdate(eduId, 'coursework', updated);
  };

  return (
    <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-left transition-colors duration-150">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-6 gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold mb-1.5">
            <GraduationCap className="size-3 text-emerald-500" />
            <span>Academic Foundations</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Education & Degrees</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Degree, university, graduation timeline, CGPA, and relevant courses.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="py-12 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No education entries yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Add your high school, college, or university degrees. ATS parsers match degree requirements strictly.
          </p>
          <button
            type="button"
            onClick={handleAddEducation}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add First Degree</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {education.map((edu, idx) => (
            <div 
              key={edu.id} 
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-4 transition-all"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center size-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {edu.institution || 'Untitled University'} — {edu.degree || 'Degree'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(edu.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={edu.institution}
                    onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. University of California, Berkeley"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Campus Location
                  </label>
                  <div className="relative">
                    <MapPin className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={edu.location || ''}
                      onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g. Berkeley, CA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Computer Science & AI"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                      placeholder="YYYY-MM (e.g. 2021-09)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date / Expected Graduation
                  </label>
                  <div className="relative">
                    <Calendar className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                      placeholder="YYYY-MM or Present"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CGPA / Honors Score (Optional)
                  </label>
                  <div className="relative">
                    <Award className="size-3.5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={edu.cgpa}
                      onChange={(e) => handleUpdate(edu.id, 'cgpa', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g. 3.92 / 4.0 (Dean's Honors List)"
                    />
                  </div>
                </div>
              </div>

              {/* Coursework Tags */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex items-center space-x-1.5 mb-2">
                  <BookOpen className="size-3.5 text-indigo-500" />
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Relevant Coursework & Subjects
                  </label>
                </div>
                
                {edu.coursework.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {edu.coursework.map((course, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 shadow-2xs"
                      >
                        <span>{course}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCoursework(edu.id, cIdx)}
                          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={courseworkInputs[edu.id] || ''}
                    onChange={(e) =>
                      setCourseworkInputs({ ...courseworkInputs, [edu.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCoursework(edu.id);
                      }
                    }}
                    placeholder="Type course name and press Enter (e.g. Distributed Systems, Algorithms)"
                    className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCoursework(edu.id)}
                    className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Add
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
