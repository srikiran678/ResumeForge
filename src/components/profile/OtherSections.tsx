import React, { useState } from 'react';
import { Plus, Trash2, Award, Trophy, HeartHandshake, ShieldCheck, X, ExternalLink, Calendar, Code } from 'lucide-react';
import { 
  CertificationItem, 
  AchievementItem, 
  HackathonItem, 
  VolunteeringItem, 
  OpenSourceItem, 
  PublicationItem 
} from '../../types';

interface OtherSectionsProps {
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  hackathons: HackathonItem[];
  volunteering: VolunteeringItem[];
  openSource: OpenSourceItem[];
  publications: PublicationItem[];
  onChange: (updates: {
    certifications?: CertificationItem[];
    achievements?: AchievementItem[];
    hackathons?: HackathonItem[];
    volunteering?: VolunteeringItem[];
    openSource?: OpenSourceItem[];
    publications?: PublicationItem[];
  }) => void;
}

export const OtherSections: React.FC<OtherSectionsProps> = ({
  certifications,
  achievements,
  hackathons,
  volunteering,
  openSource: _openSource,
  publications: _publications,
  onChange,
}) => {
  const [hackathonTechInputs, setHackathonTechInputs] = useState<Record<string, string>>({});

  // Hackathon handlers
  const handleAddHackathon = () => {
    const newItem: HackathonItem = {
      id: `hack_${Date.now()}`,
      name: '',
      organization: '',
      role: 'Full-Stack Developer',
      project: '',
      technologies: ['React', 'FastAPI'],
      achievement: 'Finalist',
      date: '2024-02',
    };
    onChange({ hackathons: [...hackathons, newItem] });
  };

  const handleAddHackTech = (hackId: string) => {
    const text = hackathonTechInputs[hackId]?.trim();
    if (!text) return;
    const item = hackathons.find((h) => h.id === hackId);
    if (!item) return;

    onChange({
      hackathons: hackathons.map((h) => 
        h.id === hackId ? { ...h, technologies: [...h.technologies, text] } : h
      )
    });
    setHackathonTechInputs({ ...hackathonTechInputs, [hackId]: '' });
  };

  const handleRemoveHackTech = (hackId: string, index: number) => {
    const item = hackathons.find((h) => h.id === hackId);
    if (!item) return;

    onChange({
      hackathons: hackathons.map((h) => 
        h.id === hackId ? { ...h, technologies: h.technologies.filter((_, i) => i !== index) } : h
      )
    });
  };

  // Certification handlers
  const handleAddCert = () => {
    const newItem: CertificationItem = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      date: '2024-01',
      credentialUrl: '',
    };
    onChange({ certifications: [...certifications, newItem] });
  };

  // Achievement handlers
  const handleAddAchievement = () => {
    const newItem: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: '',
      organization: '',
      date: '2024',
      description: '',
    };
    onChange({ achievements: [...achievements, newItem] });
  };

  // Volunteering handlers
  const handleAddVolunteering = () => {
    const newItem: VolunteeringItem = {
      id: `vol_${Date.now()}`,
      organization: '',
      role: '',
      startDate: '2023',
      endDate: '2024',
      contributions: ['Mentored students in programming fundamentals.'],
    };
    onChange({ volunteering: [...volunteering, newItem] });
  };

  return (
    <div className="space-y-6 text-left transition-colors duration-150">
      {/* 1. Hackathons & Competitions */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 dark:border-white/[0.06] mb-5 gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-semibold mb-1.5">
              <Trophy className="size-3 text-amber-500" />
              <span>Competitions</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hackathons & Rapid Builds
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showcases high-velocity problem solving under strict deadlines.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddHackathon}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Add Hackathon</span>
          </button>
        </div>

        {hackathons.length === 0 ? (
          <div className="py-8 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            No hackathons added yet. Click "Add Hackathon" to feature events like MLH, HackMIT, or Devpost projects.
          </div>
        ) : (
          <div className="space-y-4">
            {hackathons.map((h, idx) => (
              <div key={h.id} className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-3">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/70 dark:border-white/[0.06]">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    #{idx + 1} {h.name || 'Untitled Hackathon'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange({ hackathons: hackathons.filter((x) => x.id !== h.id) })}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Delete item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hackathon Name
                    </label>
                    <input
                      type="text"
                      value={h.name}
                      onChange={(e) =>
                        onChange({
                          hackathons: hackathons.map((x) => (x.id === h.id ? { ...x, name: e.target.value } : x)),
                        })
                      }
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="e.g. CalHacks 10.0"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Award / Recognition
                    </label>
                    <input
                      type="text"
                      value={h.achievement || ''}
                      onChange={(e) =>
                        onChange({
                          hackathons: hackathons.map((x) => (x.id === h.id ? { ...x, achievement: e.target.value } : x)),
                        })
                      }
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="e.g. 1st Place Overall (out of 300+ teams)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Project Built
                    </label>
                    <input
                      type="text"
                      value={h.project || ''}
                      onChange={(e) =>
                        onChange({
                          hackathons: hackathons.map((x) => (x.id === h.id ? { ...x, project: e.target.value } : x)),
                        })
                      }
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Real-Time Emergency Drone Dispatch"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={h.date}
                        onChange={(e) =>
                          onChange({
                            hackathons: hackathons.map((x) => (x.id === h.id ? { ...x, date: e.target.value } : x)),
                          })
                        }
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        placeholder="YYYY-MM (e.g. 2024-02)"
                      />
                    </div>
                  </div>
                </div>

                {/* Tech chips */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {h.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200">
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHackTech(h.id, tIdx)}
                          className="hover:text-rose-500"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={hackathonTechInputs[h.id] || ''}
                      onChange={(e) => setHackathonTechInputs({ ...hackathonTechInputs, [h.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHackTech(h.id);
                        }
                      }}
                      placeholder="Add tech stack..."
                      className="flex-1 text-xs p-2 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-lg text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddHackTech(h.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300"
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

      {/* 2. Certifications */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 dark:border-white/[0.06] mb-5 gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold mb-1.5">
              <ShieldCheck className="size-3 text-emerald-500" />
              <span>Accreditation</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Certifications & Credentials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cloud credentials, course certificates, and accredited badges.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="py-8 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            No certifications added yet. (e.g. AWS Certified Developer, Meta Full-Stack Certificate).
          </div>
        ) : (
          <div className="space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] flex flex-col md:flex-row gap-2.5 items-center">
                <input
                  type="text"
                  placeholder="Certification Name (e.g. AWS Certified Solutions Architect)"
                  value={c.name}
                  onChange={(e) =>
                    onChange({
                      certifications: certifications.map((x) =>
                        x.id === c.id ? { ...x, name: e.target.value } : x
                      ),
                    })
                  }
                  className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 flex-1 w-full"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. Amazon Web Services)"
                  value={c.issuer}
                  onChange={(e) =>
                    onChange({
                      certifications: certifications.map((x) =>
                        x.id === c.id ? { ...x, issuer: e.target.value } : x
                      ),
                    })
                  }
                  className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 w-full md:w-56"
                />
                <input
                  type="text"
                  placeholder="Date (YYYY-MM)"
                  value={c.date}
                  onChange={(e) =>
                    onChange({
                      certifications: certifications.map((x) =>
                        x.id === c.id ? { ...x, date: e.target.value } : x
                      ),
                    })
                  }
                  className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 w-full md:w-36"
                />
                <button
                  type="button"
                  onClick={() => onChange({ certifications: certifications.filter((x) => x.id !== c.id) })}
                  className="text-slate-400 hover:text-rose-500 p-2 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Achievements & Honors */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 dark:border-white/[0.06] mb-5 gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-semibold mb-1.5">
              <Award className="size-3 text-indigo-500" />
              <span>Distinction</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Achievements & Academic Honors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dean’s List, merit scholarships, competition honors, and awards.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddAchievement}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Add Achievement</span>
          </button>
        </div>

        {achievements.length === 0 ? (
          <div className="py-8 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            No achievements added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {a.title || 'Honor Entry'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange({ achievements: achievements.filter((x) => x.id !== a.id) })}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Award Title (e.g. Dean's Honors List)"
                    value={a.title}
                    onChange={(e) =>
                      onChange({
                        achievements: achievements.map((x) =>
                          x.id === a.id ? { ...x, title: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Organization (e.g. School of Computing)"
                    value={a.organization}
                    onChange={(e) =>
                      onChange({
                        achievements: achievements.map((x) =>
                          x.id === a.id ? { ...x, organization: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Date / Academic Term"
                    value={a.date}
                    onChange={(e) =>
                      onChange({
                        achievements: achievements.map((x) =>
                          x.id === a.id ? { ...x, date: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Volunteering */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 dark:border-white/[0.06] mb-5 gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-[10px] font-mono font-semibold mb-1.5">
              <HeartHandshake className="size-3 text-rose-500" />
              <span>Community</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Volunteering & Community Leadership
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student clubs, peer tutoring, and open community initiatives.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddVolunteering}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Add Volunteering</span>
          </button>
        </div>

        {volunteering.length === 0 ? (
          <div className="py-8 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            No volunteering roles added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {volunteering.map((v) => (
              <div key={v.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {v.role ? `${v.role} @ ` : ''}{v.organization || 'Organization'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange({ volunteering: volunteering.filter((x) => x.id !== v.id) })}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Organization (e.g. ACM Student Chapter)"
                    value={v.organization}
                    onChange={(e) =>
                      onChange({
                        volunteering: volunteering.map((x) =>
                          x.id === v.id ? { ...x, organization: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Workshop Lead & Mentor)"
                    value={v.role}
                    onChange={(e) =>
                      onChange({
                        volunteering: volunteering.map((x) =>
                          x.id === v.id ? { ...x, role: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
