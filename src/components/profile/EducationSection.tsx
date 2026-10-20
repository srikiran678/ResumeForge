import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, X } from 'lucide-react';
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
    <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-forge-100 pb-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-forge-800" />
            <span>Education</span>
          </h2>
          <p className="text-xs text-forge-500">Degree, university, graduation timeline, CGPA, and relevant courses.</p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="py-8 text-center text-xs text-forge-400 bg-forge-50 rounded-lg border border-dashed border-forge-200">
          No education items added yet. Click "Add Education" to begin.
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((edu, idx) => (
            <div key={edu.id} className="p-4 rounded-xl border border-forge-200 bg-forge-50/50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-forge-200">
                <span className="text-xs font-bold text-forge-700 uppercase tracking-wider">
                  Degree #{idx + 1} (ID: {edu.id})
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(edu.id)}
                  className="text-forge-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Institution / University *</label>
                  <input
                    type="text"
                    required
                    value={edu.institution}
                    onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. University of Washington"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Seattle, WA"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="YYYY-MM"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">End Date / Expected</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="YYYY-MM or Present"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">CGPA / GPA Score</label>
                  <input
                    type="text"
                    value={edu.cgpa}
                    onChange={(e) => handleUpdate(edu.id, 'cgpa', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. 3.86 / 4.0 or 8.9 / 10.0"
                  />
                </div>
              </div>

              {/* Coursework Tags */}
              <div className="pt-2 border-t border-forge-200">
                <label className="block text-[11px] font-semibold text-forge-700 mb-1">Relevant Coursework</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {edu.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-white border border-forge-200 text-forge-800"
                    >
                      <span>{course}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoursework(edu.id, cIdx)}
                        className="text-forge-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

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
                    placeholder="Type course name and press Enter (e.g. Operating Systems)"
                    className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCoursework(edu.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-forge-100 hover:bg-forge-200 text-forge-800 rounded"
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
