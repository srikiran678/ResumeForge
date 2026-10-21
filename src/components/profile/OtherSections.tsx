import React from 'react';
import { Plus, Trash2, Award, Trophy, HeartHandshake, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-6 text-left">
      {/* 1. Hackathons & Competitions */}
      <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-forge-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Hackathons & Technical Competitions</span>
            </h2>
            <p className="text-xs text-forge-500">
              Crucial differentiator for students demonstrating rapid engineering under deadline pressure.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddHackathon}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white rounded-lg hover:bg-forge-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hackathon</span>
          </button>
        </div>

        {hackathons.length === 0 ? (
          <div className="py-6 text-center text-xs text-forge-400 bg-forge-50 rounded-lg">
            No hackathons added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {hackathons.map((h) => (
              <div key={h.id} className="p-4 rounded-xl border border-forge-200 bg-forge-50/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-forge-700">Hackathon Item (ID: {h.id})</span>
                  <button
                    type="button"
                    onClick={() => onChange({ hackathons: hackathons.filter((x) => x.id !== h.id) })}
                    className="text-forge-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Event Name (e.g. DubHacks 2023)"
                    value={h.name}
                    onChange={(e) =>
                      onChange({
                        hackathons: hackathons.map((x) => (x.id === h.id ? { ...x, name: e.target.value } : x)),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Organization (e.g. UW ACM)"
                    value={h.organization}
                    onChange={(e) =>
                      onChange({
                        hackathons: hackathons.map((x) =>
                          x.id === h.id ? { ...x, organization: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Award (e.g. 1st Place / Top 5 Finalist)"
                    value={h.achievement}
                    onChange={(e) =>
                      onChange({
                        hackathons: hackathons.map((x) =>
                          x.id === h.id ? { ...x, achievement: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={h.project}
                    onChange={(e) =>
                      onChange({
                        hackathons: hackathons.map((x) => (x.id === h.id ? { ...x, project: e.target.value } : x)),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={h.technologies.join(', ')}
                    onChange={(e) =>
                      onChange({
                        hackathons: hackathons.map((x) =>
                          x.id === h.id
                            ? { ...x, technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }
                            : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Certifications */}
      <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-forge-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Certifications</span>
            </h2>
            <p className="text-xs text-forge-500">Cloud credentials, course certificates, and accredited badges.</p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white rounded-lg hover:bg-forge-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-forge-400 bg-forge-50 rounded-lg">
            No certifications added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-forge-200 bg-forge-50/50 flex flex-col md:flex-row gap-2 items-center">
                <input
                  type="text"
                  placeholder="Certification Name"
                  value={c.name}
                  onChange={(e) =>
                    onChange({
                      certifications: certifications.map((x) =>
                        x.id === c.id ? { ...x, name: e.target.value } : x
                      ),
                    })
                  }
                  className="text-xs p-2 border border-forge-300 rounded bg-white flex-1 w-full"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. AWS, Meta)"
                  value={c.issuer}
                  onChange={(e) =>
                    onChange({
                      certifications: certifications.map((x) =>
                        x.id === c.id ? { ...x, issuer: e.target.value } : x
                      ),
                    })
                  }
                  className="text-xs p-2 border border-forge-300 rounded bg-white w-full md:w-48"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={c.date}
                  onChange={(e) =>
                    onChange({
                      certifications: certifications.map((x) =>
                        x.id === c.id ? { ...x, date: e.target.value } : x
                      ),
                    })
                  }
                  className="text-xs p-2 border border-forge-300 rounded bg-white w-full md:w-32"
                />
                <button
                  type="button"
                  onClick={() => onChange({ certifications: certifications.filter((x) => x.id !== c.id) })}
                  className="text-forge-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Achievements & Honors */}
      <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-forge-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Achievements & Academic Honors</span>
            </h2>
            <p className="text-xs text-forge-500">Dean’s List, scholarships, competition honors, and awards.</p>
          </div>
          <button
            type="button"
            onClick={handleAddAchievement}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white rounded-lg hover:bg-forge-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Achievement</span>
          </button>
        </div>

        {achievements.length === 0 ? (
          <div className="py-6 text-center text-xs text-forge-400 bg-forge-50 rounded-lg">
            No achievements added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl border border-forge-200 bg-forge-50/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-forge-700">Honor Item</span>
                  <button
                    type="button"
                    onClick={() => onChange({ achievements: achievements.filter((x) => x.id !== a.id) })}
                    className="text-forge-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Award Title (e.g. Dean's List Honor)"
                    value={a.title}
                    onChange={(e) =>
                      onChange({
                        achievements: achievements.map((x) =>
                          x.id === a.id ? { ...x, title: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Organization (e.g. College of Engineering)"
                    value={a.organization}
                    onChange={(e) =>
                      onChange({
                        achievements: achievements.map((x) =>
                          x.id === a.id ? { ...x, organization: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Date / Term"
                    value={a.date}
                    onChange={(e) =>
                      onChange({
                        achievements: achievements.map((x) =>
                          x.id === a.id ? { ...x, date: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Volunteering */}
      <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-forge-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-rose-500" />
              <span>Volunteering & Community Leadership</span>
            </h2>
            <p className="text-xs text-forge-500">Student clubs, open mentoring, and community contributions.</p>
          </div>
          <button
            type="button"
            onClick={handleAddVolunteering}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white rounded-lg hover:bg-forge-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Volunteering</span>
          </button>
        </div>

        {volunteering.length === 0 ? (
          <div className="py-6 text-center text-xs text-forge-400 bg-forge-50 rounded-lg">
            No volunteering added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {volunteering.map((v) => (
              <div key={v.id} className="p-3 rounded-xl border border-forge-200 bg-forge-50/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-forge-700">Community Role</span>
                  <button
                    type="button"
                    onClick={() => onChange({ volunteering: volunteering.filter((x) => x.id !== v.id) })}
                    className="text-forge-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Organization (e.g. Girls Who Code)"
                    value={v.organization}
                    onChange={(e) =>
                      onChange({
                        volunteering: volunteering.map((x) =>
                          x.id === v.id ? { ...x, organization: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Python Instructor)"
                    value={v.role}
                    onChange={(e) =>
                      onChange({
                        volunteering: volunteering.map((x) =>
                          x.id === v.id ? { ...x, role: e.target.value } : x
                        ),
                      })
                    }
                    className="text-xs p-2 border border-forge-300 rounded bg-white"
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
