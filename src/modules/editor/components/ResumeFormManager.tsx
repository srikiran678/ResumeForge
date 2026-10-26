import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowUp, 
  ArrowDown,
  Target
} from 'lucide-react';
import { ResumeData } from '@/data/types';

export interface ResumeFormManagerProps {
  currentResume: ResumeData;
  updateCurrentResume: (updater: (prev: ResumeData) => ResumeData) => void;
  activeAccordion: string;
  setActiveAccordion: (section: string) => void;
  getBulletTelemetry: (text: string) => { status: string; label: string };
  handleTriggerBulletImprover: (
    bulletText: string,
    section: string,
    title: string,
    onApply: (newText: string) => void
  ) => void;
  handleOpenXyzFormula: (
    initialBullet: string,
    onApply: (newBullet: string) => void
  ) => void;
}

export const ResumeFormManager: React.FC<ResumeFormManagerProps> = ({
  currentResume,
  updateCurrentResume,
  activeAccordion,
  setActiveAccordion,
  getBulletTelemetry,
  handleTriggerBulletImprover,
  handleOpenXyzFormula,
}) => {
  return (
    <div className="space-y-4">
          {/* Accordion 1: Basics & Contact Info */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'basics' ? '' : 'basics')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Personal Information & Basics</span>
              {activeAccordion === 'basics' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'basics' && (
              <div className="p-4 space-y-3 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <div>
                  <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={currentResume.basics.name}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, name: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">Target Headline</label>
                  <input
                    type="text"
                    value={currentResume.basics.label}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, label: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={currentResume.basics.email}
                      onChange={(e) =>
                        updateCurrentResume((prev) => ({
                          ...prev,
                          basics: { ...prev.basics, email: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={currentResume.basics.phone}
                      onChange={(e) =>
                        updateCurrentResume((prev) => ({
                          ...prev,
                          basics: { ...prev.basics, phone: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">Location (City, State)</label>
                  <input
                    type="text"
                    value={currentResume.basics.location}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, location: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">Summary</label>
                  <textarea
                    rows={3}
                    value={currentResume.basics.summary}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, summary: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Accordion: Career Objective */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'objective' ? '' : 'objective')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Career Objective</span>
              {activeAccordion === 'objective' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'objective' && (
              <div className="p-4 space-y-3 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <div>
                  <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">
                    Career Objective
                  </label>
                  <p className="text-[11px] text-forge-500 dark:text-slate-400 mb-2">
                    Describe your professional goals, intended role, and relevant core competencies.
                  </p>
                  <textarea
                    rows={4}
                    value={
                      currentResume.careerObjective !== undefined
                        ? currentResume.careerObjective
                        : currentResume.basics.summary
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentResume((prev) => ({
                        ...prev,
                        careerObjective: val,
                        basics: { ...prev.basics, summary: prev.basics.summary || val },
                      }));
                    }}
                    placeholder="Seeking a challenging software engineering role where I can utilize my programming and analytical skills..."
                    className="w-full p-2.5 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Accordion: Educational Qualifications (5-Column Structured Format) */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'education' ? '' : 'education')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Educational Qualifications ({currentResume.education.length})</span>
              {activeAccordion === 'education' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'education' && (
              <div className="p-4 space-y-4 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <p className="text-[11px] text-forge-500 dark:text-slate-400">
                  Manage qualifications (B.Tech / Degree, Intermediate / 12th, SSC / 10th, Diploma) with structured columns.
                </p>

                {currentResume.education.map((edu, eduIdx) => (
                  <div
                    key={edu.id || eduIdx}
                    className="p-3 bg-forge-50 dark:bg-[#08090a] rounded-xl border border-forge-200 dark:border-white/[0.07] space-y-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-forge-900 dark:text-white">
                        #{eduIdx + 1}: {edu.qualification || edu.degree || 'Qualification'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={eduIdx === 0}
                          onClick={() => {
                            updateCurrentResume((prev) => {
                              const list = [...prev.education];
                              const temp = list[eduIdx];
                              list[eduIdx] = list[eduIdx - 1];
                              list[eduIdx - 1] = temp;
                              return { ...prev, education: list };
                            });
                          }}
                          className="p-1 rounded text-forge-400 hover:text-forge-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={eduIdx === currentResume.education.length - 1}
                          onClick={() => {
                            updateCurrentResume((prev) => {
                              const list = [...prev.education];
                              const temp = list[eduIdx];
                              list[eduIdx] = list[eduIdx + 1];
                              list[eduIdx + 1] = temp;
                              return { ...prev, education: list };
                            });
                          }}
                          className="p-1 rounded text-forge-400 hover:text-forge-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateCurrentResume((prev) => ({
                              ...prev,
                              education: prev.education.filter((_, idx) => idx !== eduIdx),
                            }));
                          }}
                          className="p-1 rounded text-forge-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          title="Remove Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Qualification
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech (CSE) / Intermediate / SSC"
                          value={edu.qualification || edu.degree || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.education];
                              updated[eduIdx] = {
                                ...updated[eduIdx],
                                qualification: val,
                                degree: val,
                              };
                              return { ...prev, education: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Institution
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. College / School Name"
                          value={edu.institution || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.education];
                              updated[eduIdx] = { ...updated[eduIdx], institution: val };
                              return { ...prev, education: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          University / Board
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. JNTUH / State Board / CBSE"
                          value={edu.board || edu.location || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.education];
                              updated[eduIdx] = { ...updated[eduIdx], board: val, location: val };
                              return { ...prev, education: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Year
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2020 - 2024 or 2024"
                          value={
                            edu.year ||
                            (edu.startDate && edu.endDate
                              ? `${edu.startDate} - ${edu.endDate}`
                              : edu.endDate || edu.startDate || '')
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.education];
                              updated[eduIdx] = { ...updated[eduIdx], year: val, endDate: val };
                              return { ...prev, education: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          CGPA / Percentage
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 8.5 CGPA or 85%"
                          value={edu.percentage || edu.cgpa || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.education];
                              updated[eduIdx] = { ...updated[eduIdx], percentage: val, cgpa: val };
                              return { ...prev, education: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateCurrentResume((prev) => ({
                      ...prev,
                      education: [
                        ...prev.education,
                        {
                          id: `edu_${Date.now()}`,
                          institution: '',
                          degree: 'B.Tech',
                          field: 'Computer Science',
                          qualification: 'B.Tech (CSE)',
                          board: '',
                          year: '2024',
                          percentage: '',
                          startDate: '2020',
                          endDate: '2024',
                          cgpa: '',
                          coursework: [],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-forge-800 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Qualification</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion: Technical Skills (Grouped Format) */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'skills' ? '' : 'skills')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Technical Skills ({currentResume.skills.length} Groups)</span>
              {activeAccordion === 'skills' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'skills' && (
              <div className="p-4 space-y-4 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <p className="text-[11px] text-forge-500 dark:text-slate-400">
                  Group skills into categories (Programming Languages, Databases, Web Technologies, Tools, etc.).
                </p>

                {currentResume.skills.map((skillGroup, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 bg-forge-50 dark:bg-[#08090a] rounded-xl border border-forge-200 dark:border-white/[0.07] space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={skillGroup.category}
                        placeholder="Group Name (e.g. Programming Languages)"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCurrentResume((prev) => {
                            const updated = [...prev.skills];
                            updated[sIdx] = { ...updated[sIdx], category: val };
                            return { ...prev, skills: updated };
                          });
                        }}
                        className="p-1.5 font-bold text-xs border border-forge-300 dark:border-white/[0.08] rounded bg-white dark:bg-[#121316] text-slate-900 dark:text-white flex-1 mr-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={sIdx === 0}
                          onClick={() => {
                            updateCurrentResume((prev) => {
                              const list = [...prev.skills];
                              const temp = list[sIdx];
                              list[sIdx] = list[sIdx - 1];
                              list[sIdx - 1] = temp;
                              return { ...prev, skills: list };
                            });
                          }}
                          className="p-1 rounded text-forge-400 hover:text-forge-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={sIdx === currentResume.skills.length - 1}
                          onClick={() => {
                            updateCurrentResume((prev) => {
                              const list = [...prev.skills];
                              const temp = list[sIdx];
                              list[sIdx] = list[sIdx + 1];
                              list[sIdx + 1] = temp;
                              return { ...prev, skills: list };
                            });
                          }}
                          className="p-1 rounded text-forge-400 hover:text-forge-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateCurrentResume((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, idx) => idx !== sIdx),
                            }));
                          }}
                          className="p-1 rounded text-forge-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          title="Remove Group"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. C, Java, Python, C++"
                        value={skillGroup.items?.join(', ') || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const items = val.split(',').map((s) => s.trim()).filter(Boolean);
                          updateCurrentResume((prev) => {
                            const updated = [...prev.skills];
                            updated[sIdx] = { ...updated[sIdx], items };
                            return { ...prev, skills: updated };
                          });
                        }}
                        className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateCurrentResume((prev) => ({
                      ...prev,
                      skills: [
                        ...prev.skills,
                        {
                          category: 'Tools & Technologies',
                          items: ['Git', 'VS Code'],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-forge-800 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill Group</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Projects & Bullets */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'projects' ? '' : 'projects')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Projects ({currentResume.projects.length})</span>
              {activeAccordion === 'projects' ? (
                <ChevronUp className="w-4 h-4 text-forge-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400" />
              )}
            </button>

            {activeAccordion === 'projects' && (
              <div className="p-4 space-y-4 border-t border-forge-100 text-xs">
                {currentResume.projects.map((proj, pIdx) => (
                  <div key={proj.id} className="p-3 bg-forge-50 rounded-lg border border-forge-200 space-y-2">
                    <div className="flex justify-between font-bold text-forge-900">
                      <span>{proj.name || 'Untitled Project'}</span>
                      <button
                        onClick={() =>
                          updateCurrentResume((prev) => ({
                            ...prev,
                            projects: prev.projects.filter((_, idx) => idx !== pIdx),
                          }))
                        }
                        className="text-forge-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => {
                          const updated = [...prev.projects];
                          updated[pIdx].name = val;
                          return { ...prev, projects: updated };
                        });
                      }}
                      className="w-full p-2 border border-forge-300 rounded bg-white text-xs"
                      placeholder="Project Name"
                    />

                    {/* Bullets with Improve Button */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-semibold text-forge-600">
                        Highlights & Action Bullets:
                      </label>
                      {proj.highlights.map((h, hIdx) => {
                        const tele = getBulletTelemetry(h);
                        return (
                          <div key={hIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-forge-200">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-slate-400">Highlight #{hIdx + 1}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                  tele.status === 'strong'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : tele.status === 'metric'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {tele.label}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              value={h}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.projects];
                                  updated[pIdx].highlights[hIdx] = val;
                                  return { ...prev, projects: updated };
                                });
                              }}
                              className="w-full text-xs p-1.5 border border-forge-200 rounded focus:outline-none"
                            />
                          <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleTriggerBulletImprover(
                                    h,
                                    'Projects',
                                    proj.name,
                                    (newText) => {
                                      updateCurrentResume((prev) => {
                                        const updated = [...prev.projects];
                                        updated[pIdx].highlights[hIdx] = newText;
                                        return { ...prev, projects: updated };
                                      });
                                    }
                                  )
                                }
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Improve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleOpenXyzFormula(h, (newBullet: string) => {
                                    updateCurrentResume((prev) => {
                                      const updated = [...(prev.projects || [])];
                                      updated[pIdx].highlights[hIdx] = newBullet;
                                      return { ...prev, projects: updated };
                                    });
                                  });
                                }}
                                className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800"
                              >
                                <Target className="w-3 h-3 text-slate-400" />
                                <span>XYZ metric</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.projects];
                                  updated[pIdx].highlights = updated[pIdx].highlights.filter(
                                    (_, idx) => idx !== hIdx
                                  );
                                  return { ...prev, projects: updated };
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          updateCurrentResume((prev) => {
                            const updated = [...prev.projects];
                            updated[pIdx].highlights.push('Engineered application features.');
                            return { ...prev, projects: updated };
                          });
                        }}
                        className="text-[11px] font-semibold text-forge-700 hover:text-forge-900 pt-1"
                      >
                        + Add bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 3: Experience & Bullets */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'work' ? '' : 'work')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Experience ({currentResume.work.length})</span>
              {activeAccordion === 'work' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'work' && (
              <div className="p-4 space-y-4 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                {currentResume.work.map((exp, eIdx) => (
                  <div key={exp.id} className="p-3 bg-forge-50 dark:bg-[#08090a] rounded-xl border border-forge-200 dark:border-white/[0.07] space-y-2">
                    <div className="flex justify-between font-bold text-forge-900 dark:text-white">
                      <span>{exp.position} — {exp.company}</span>
                      <button
                        onClick={() =>
                          updateCurrentResume((prev) => ({
                            ...prev,
                            work: prev.work.filter((_, idx) => idx !== eIdx),
                          }))
                        }
                        className="text-forge-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bullets with Improve Button */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-semibold text-forge-600 dark:text-slate-400">
                        Responsibility Bullets:
                      </label>
                      {exp.responsibilities.map((b, bIdx) => {
                        const tele = getBulletTelemetry(b);
                        return (
                          <div key={bIdx} className="space-y-1 bg-white dark:bg-[#121316] p-2.5 rounded-lg border border-forge-200 dark:border-white/[0.07]">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-slate-400 dark:text-slate-500">Bullet #{bIdx + 1}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                  tele.status === 'strong'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : tele.status === 'metric'
                                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/[0.08]'
                                }`}
                              >
                                {tele.label}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.work];
                                  updated[eIdx].responsibilities[bIdx] = val;
                                  return { ...prev, work: updated };
                                });
                              }}
                              className="w-full text-xs p-1.5 border border-forge-200 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleTriggerBulletImprover(
                                    b,
                                    'Experience',
                                    `${exp.company} (${exp.position})`,
                                    (newText) => {
                                      updateCurrentResume((prev) => {
                                        const updated = [...prev.work];
                                        updated[eIdx].responsibilities[bIdx] = newText;
                                        return { ...prev, work: updated };
                                      });
                                    }
                                  )
                                }
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] font-medium"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Improve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleOpenXyzFormula(b, (newBullet: string) => {
                                    updateCurrentResume((prev) => {
                                      const updated = [...(prev.work || [])];
                                      updated[eIdx].responsibilities[bIdx] = newBullet;
                                      return { ...prev, work: updated };
                                    });
                                  });
                                }}
                                className="inline-flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                              >
                                <Target className="w-3 h-3 text-slate-400" />
                                <span>XYZ metric</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.work];
                                  updated[eIdx].responsibilities = updated[eIdx].responsibilities.filter(
                                    (_, idx) => idx !== bIdx
                                  );
                                  return { ...prev, work: updated };
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateCurrentResume((prev) => ({
                      ...prev,
                      work: [
                        ...prev.work,
                        {
                          id: `work_${Date.now()}`,
                          company: 'Company Name',
                          position: 'Role Title',
                          startDate: '2023',
                          endDate: 'Present',
                          current: true,
                          location: 'Remote',
                          summary: '',
                          responsibilities: ['Engineered mission-critical software systems.'],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-forge-800 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience / Internship</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion: Certifications */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'certificates' ? '' : 'certificates')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Certifications ({currentResume.certificates.length})</span>
              {activeAccordion === 'certificates' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'certificates' && (
              <div className="p-4 space-y-4 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                {currentResume.certificates.map((cert, cIdx) => (
                  <div
                    key={cert.id || cIdx}
                    className="p-3 bg-forge-50 dark:bg-[#08090a] rounded-xl border border-forge-200 dark:border-white/[0.07] space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-forge-900 dark:text-white">
                        {cert.name || 'Untitled Certification'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateCurrentResume((prev) => ({
                            ...prev,
                            certificates: prev.certificates.filter((_, idx) => idx !== cIdx),
                          }));
                        }}
                        className="p-1 rounded text-forge-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Certification Name
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.certificates];
                              updated[cIdx] = { ...updated[cIdx], name: val };
                              return { ...prev, certificates: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Issuing Organization
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.certificates];
                              updated[cIdx] = { ...updated[cIdx], issuer: val };
                              return { ...prev, certificates: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Issue Date
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2024 or May 2024"
                          value={cert.date}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.certificates];
                              updated[cIdx] = { ...updated[cIdx], date: val };
                              return { ...prev, certificates: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-forge-700 dark:text-slate-300 mb-0.5">
                          Credential URL / ID (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Credential link or ID"
                          value={cert.credentialUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentResume((prev) => {
                              const updated = [...prev.certificates];
                              updated[cIdx] = { ...updated[cIdx], credentialUrl: val };
                              return { ...prev, certificates: updated };
                            });
                          }}
                          className="w-full p-2 text-xs border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateCurrentResume((prev) => ({
                      ...prev,
                      certificates: [
                        ...prev.certificates,
                        {
                          id: `cert_${Date.now()}`,
                          name: '',
                          issuer: '',
                          date: '',
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-forge-800 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion: Strengths */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'strengths' ? '' : 'strengths')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Strengths ({(currentResume.strengths || []).length})</span>
              {activeAccordion === 'strengths' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'strengths' && (
              <div className="p-4 space-y-3 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <p className="text-[11px] text-forge-500 dark:text-slate-400">
                  Personal and professional strengths displayed as bullet points.
                </p>

                {(currentResume.strengths || []).map((strength, sIdx) => (
                  <div key={sIdx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={strength}
                      placeholder="e.g. Quick Learner, Problem Solving, Adaptability"
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => {
                          const updated = [...(prev.strengths || [])];
                          updated[sIdx] = val;
                          return { ...prev, strengths: updated };
                        });
                      }}
                      className="flex-1 p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateCurrentResume((prev) => ({
                          ...prev,
                          strengths: (prev.strengths || []).filter((_, idx) => idx !== sIdx),
                        }));
                      }}
                      className="p-2 text-forge-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateCurrentResume((prev) => ({
                      ...prev,
                      strengths: [...(prev.strengths || []), ''],
                    }));
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-forge-800 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Strength</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion: Extra-Curricular Activities */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'extracurricular' ? '' : 'extracurricular')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Extra-Curricular Activities ({(currentResume.extracurricular || []).length})</span>
              {activeAccordion === 'extracurricular' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'extracurricular' && (
              <div className="p-4 space-y-3 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <p className="text-[11px] text-forge-500 dark:text-slate-400">
                  Contests, hackathons, college technical clubs, volunteering, and leadership activities.
                </p>

                {(currentResume.extracurricular || []).map((activity, aIdx) => (
                  <div key={aIdx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={activity}
                      placeholder="e.g. Secured 2nd place in Annual Inter-College Coding Contest"
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => {
                          const updated = [...(prev.extracurricular || [])];
                          updated[aIdx] = val;
                          return { ...prev, extracurricular: updated };
                        });
                      }}
                      className="flex-1 p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateCurrentResume((prev) => ({
                          ...prev,
                          extracurricular: (prev.extracurricular || []).filter((_, idx) => idx !== aIdx),
                        }));
                      }}
                      className="p-2 text-forge-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateCurrentResume((prev) => ({
                      ...prev,
                      extracurricular: [...(prev.extracurricular || []), ''],
                    }));
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-forge-800 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion: Declaration & Signature */}
          <div className="bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'declaration' ? '' : 'declaration')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 dark:text-white bg-forge-50/50 dark:bg-[#1a1b20]/60 hover:bg-forge-50 dark:hover:bg-[#1a1b20] transition-colors"
            >
              <span>Declaration & Sign-off</span>
              {activeAccordion === 'declaration' ? (
                <ChevronUp className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400 dark:text-slate-500" />
              )}
            </button>

            {activeAccordion === 'declaration' && (
              <div className="p-4 space-y-3 border-t border-forge-100 dark:border-white/[0.07] text-xs">
                <div>
                  <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">
                    Declaration Statement
                  </label>
                  <textarea
                    rows={3}
                    value={
                      currentResume.declaration?.text !== undefined
                        ? currentResume.declaration.text
                        : 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentResume((prev) => ({
                        ...prev,
                        declaration: {
                          text: val,
                          place: prev.declaration?.place || prev.basics.location || '',
                          date: prev.declaration?.date || '',
                          signature: prev.declaration?.signature || prev.basics.name || '',
                        },
                      }));
                    }}
                    className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={currentResume.declaration?.place ?? currentResume.basics.location}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => ({
                          ...prev,
                          declaration: {
                            text:
                              prev.declaration?.text ||
                              'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.',
                            place: val,
                            date: prev.declaration?.date || '',
                            signature: prev.declaration?.signature || prev.basics.name || '',
                          },
                        }));
                      }}
                      className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 25-10-2026"
                      value={currentResume.declaration?.date || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => ({
                          ...prev,
                          declaration: {
                            text:
                              prev.declaration?.text ||
                              'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.',
                            place: prev.declaration?.place || prev.basics.location || '',
                            date: val,
                            signature: prev.declaration?.signature || prev.basics.name || '',
                          },
                        }));
                      }}
                      className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-forge-700 dark:text-slate-300 mb-1">
                      Signature Name
                    </label>
                    <input
                      type="text"
                      placeholder="Candidate Name"
                      value={currentResume.declaration?.signature ?? currentResume.basics.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => ({
                          ...prev,
                          declaration: {
                            text:
                              prev.declaration?.text ||
                              'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.',
                            place: prev.declaration?.place || prev.basics.location || '',
                            date: prev.declaration?.date || '',
                            signature: val,
                          },
                        }));
                      }}
                      className="w-full p-2 border border-forge-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
    </div>
  );
};
