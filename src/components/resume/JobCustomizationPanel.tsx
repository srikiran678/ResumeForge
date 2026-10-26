import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Tag, 
  Layers, 
  Plus, 
  ShieldAlert
} from 'lucide-react';
import { ResumeData } from '../../data/types/resume';
import { Company, JobRole, JobRequirement } from '../../data/types/companyTemplate';
import { CompanyTemplateService } from '../../services/companyTemplateService';

interface JobCustomizationPanelProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
}

export const JobCustomizationPanel: React.FC<JobCustomizationPanelProps> = ({
  resume,
  onUpdateResume
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [requirements, setRequirements] = useState<JobRequirement | null>(null);
  const [learningSkills, setLearningSkills] = useState<string[]>([]);

  useEffect(() => {
    async function init() {
      const [comps, rols] = await Promise.all([
        CompanyTemplateService.getCompanies(),
        CompanyTemplateService.getRoles()
      ]);
      setCompanies(comps);
      setRoles(rols);

      // Default select company based on resume.targetCompany if present
      if (resume.targetCompany) {
        const found = comps.find(c => c.name.toLowerCase() === resume.targetCompany?.toLowerCase());
        if (found) setSelectedCompanyId(found.id);
      } else if (comps.length > 0) {
        setSelectedCompanyId(comps[0].id);
      }

      if (rols.length > 0) {
        setSelectedRoleId(rols[1]?.id || rols[0]?.id);
      }
    }
    init();
  }, [resume.targetCompany]);

  // Load requirements when company or role changes
  useEffect(() => {
    async function fetchReqs() {
      if (!selectedCompanyId || !selectedRoleId) return;
      const reqs = await CompanyTemplateService.getJobRequirements(selectedCompanyId, selectedRoleId);
      if (reqs && reqs.length > 0) {
        setRequirements(reqs[0]);
      } else {
        // Fallback generic requirements
        setRequirements({
          id: 'temp',
          company_id: selectedCompanyId,
          role_id: selectedRoleId,
          skills: ['Data Structures & Algorithms', 'System Architecture', 'Git / CI-CD', 'Clean Code', 'REST APIs'],
          keywords: ['performance', 'scalability', 'automated testing', 'collaboration'],
          recommended_sections: ['Work Experience', 'Key Projects', 'Technical Skills', 'Education']
        });
      }
    }
    fetchReqs();
  }, [selectedCompanyId, selectedRoleId, companies, roles]);

  // Extract all existing user resume text for keyword and skill matching
  const resumeTextBlob = useMemo(() => {
    const parts: string[] = [];
    if (resume.basics?.summary) parts.push(resume.basics.summary);
    if (resume.careerObjective) parts.push(resume.careerObjective);
    resume.skills?.forEach(s => {
      parts.push(s.category);
      s.items?.forEach(k => parts.push(k));
    });
    resume.work?.forEach(w => {
      parts.push(w.company, w.position);
      w.responsibilities?.forEach(h => parts.push(h));
      w.technologies?.forEach(t => parts.push(t));
    });
    resume.projects?.forEach(p => {
      parts.push(p.name, p.description || '');
      p.highlights?.forEach(h => parts.push(h));
      p.technologies?.forEach(k => parts.push(k));
    });
    resume.education?.forEach(e => {
      parts.push(e.institution, e.degree || '', e.field || '', e.qualification || '');
    });
    return parts.join(' ').toLowerCase();
  }, [resume]);

  // Match demonstrated vs missing skills
  const skillAnalysis = useMemo(() => {
    if (!requirements) return { demonstrated: [], missing: [] };

    const demonstrated: string[] = [];
    const missing: string[] = [];

    requirements.skills.forEach(skill => {
      const lower = skill.toLowerCase();
      // Check multi-word or sub-words
      const matched = lower.split(/[\s/,&]+/).filter(w => w.length > 2).some(word => resumeTextBlob.includes(word));
      if (matched) {
        demonstrated.push(skill);
      } else {
        missing.push(skill);
      }
    });

    return { demonstrated, missing };
  }, [requirements, resumeTextBlob]);

  // Match keyword recommendations
  const keywordAnalysis = useMemo(() => {
    if (!requirements) return { present: [], recommended: [] };
    const present: string[] = [];
    const recommended: string[] = [];

    requirements.keywords.forEach(kw => {
      if (resumeTextBlob.includes(kw.toLowerCase())) {
        present.push(kw);
      } else {
        recommended.push(kw);
      }
    });

    return { present, recommended };
  }, [requirements, resumeTextBlob]);

  // Add a verified skill to resume
  const handleAddSkillToResume = (skillName: string) => {
    const existingGroup = resume.skills?.[0];
    let updatedSkills = [...(resume.skills || [])];

    if (updatedSkills.length === 0) {
      updatedSkills = [{
        category: 'Technical Skills',
        items: [skillName]
      }];
    } else {
      const items = existingGroup.items || [];
      if (!items.includes(skillName)) {
        updatedSkills[0] = {
          ...existingGroup,
          items: [...items, skillName]
        };
      }
    }

    onUpdateResume({
      ...resume,
      skills: updatedSkills,
      updatedAt: new Date().toISOString()
    });
  };

  const handleMarkAsLearning = (skillName: string) => {
    if (!learningSkills.includes(skillName)) {
      setLearningSkills(prev => [...prev, skillName]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5 text-xs text-left shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white text-sm">
              Job-Specific Resume Customization
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Target requirements comparison based on official public career data.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          ATS Audit Active
        </span>
      </div>

      {/* Target Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Company
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              const comp = companies.find(c => c.id === e.target.value);
              if (comp) {
                onUpdateResume({
                  ...resume,
                  targetCompany: comp.name,
                  meta: { ...resume.meta, targetCompany: comp.name }
                });
              }
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Role Profile
          </label>
          <select
            value={selectedRoleId}
            onChange={(e) => {
              setSelectedRoleId(e.target.value);
              const r = roles.find(rol => rol.id === e.target.value);
              if (r) {
                onUpdateResume({
                  ...resume,
                  targetRole: r.title,
                  meta: { ...resume.meta, targetRole: r.title }
                });
              }
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.title} ({r.category})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="space-y-4">
        {/* Demonstrated vs Missing Skills */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Skill Coverage Comparison</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {skillAnalysis.demonstrated.length}/{requirements?.skills.length || 0} Matched
            </span>
          </div>

          {/* Demonstrated */}
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              Demonstrated in Resume:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillAnalysis.demonstrated.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic">None detected yet in current resume text.</span>
              ) : (
                skillAnalysis.demonstrated.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-[11px] flex items-center space-x-1">
                    <span>✓</span>
                    <span>{s}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Missing Skills */}
          {skillAnalysis.missing.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400 mb-1">
                Frequently Required Skills Not Yet Found:
              </div>
              <div className="space-y-1.5">
                {skillAnalysis.missing.map(skill => {
                  const isLearning = learningSkills.includes(skill);
                  return (
                    <div key={skill} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{skill}</span>
                        {isLearning && (
                          <span className="ml-2 text-[9px] font-mono font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded">
                            Learning / Familiar
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {!isLearning && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsLearning(skill)}
                            className="px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded cursor-pointer"
                          >
                            Mark Learning
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAddSkillToResume(skill)}
                          className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded hover:bg-indigo-500 cursor-pointer flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* High-Impact Keyword Recommendations */}
        {requirements?.keywords && requirements.keywords.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-indigo-500" />
              <span>Recommended ATS Keywords & Impact Verbs</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {requirements.keywords.map(kw => {
                const found = keywordAnalysis.present.includes(kw);
                return (
                  <span
                    key={kw}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                      found
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {found ? '✓ ' : '+ '}
                    {kw}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Section Emphasis & Project Advice */}
        {requirements?.recommended_sections && (
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50 space-y-1.5 text-[11px]">
            <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Section Emphasis for this Role:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on standard screening criteria for <strong>{companies.find(c => c.id === selectedCompanyId)?.name}</strong>, recruiters prioritize:
            </p>
            <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
              {requirements.recommended_sections.map(sec => (
                <span key={sec} className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded border border-indigo-200 dark:border-indigo-800 font-semibold text-indigo-700 dark:text-indigo-300">
                  {sec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Honest Guardrail Disclaimer */}
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 text-[10px] text-amber-900 dark:text-amber-300 flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Honest Tailoring Guarantee:</strong> Only add skills and achievements you can genuinely discuss during an interview. Never fabricate dates or experience.
          </span>
        </div>
      </div>
    </div>
  );
};
