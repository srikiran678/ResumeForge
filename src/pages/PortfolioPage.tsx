import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Mail, 
  Palette, 
  Code2 
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const PortfolioPage: React.FC = () => {
  const { resumes, masterProfile, portfolio, updatePortfolio } = useWorkspace();
  const [copied, setCopied] = useState(false);

  const portfolioUrl = `${window.location.origin}/portfolio`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThemeChange = (theme: 'clean' | 'slate' | 'editorial') => {
    updatePortfolio({ ...portfolio, theme });
  };

  const activeResume = resumes.find((r) => !r.isTrash) || resumes[0];
  const p = masterProfile;

  const githubProfile = activeResume?.basics?.profiles?.find((pr) => pr.network.toLowerCase().includes('github'))?.url || p?.personalInfo?.github;
  const linkedInProfile = activeResume?.basics?.profiles?.find((pr) => pr.network.toLowerCase().includes('linkedin'))?.url || p?.personalInfo?.linkedIn;

  const personalInfo = {
    fullName: activeResume?.basics?.name || p?.personalInfo?.fullName || 'Your Name',
    label: activeResume?.basics?.label || p?.personalInfo?.label || 'Software Engineer',
    summary: activeResume?.basics?.summary || p?.personalInfo?.summary || 'Passionate software builder with expertise in high-scale systems and web engineering.',
    email: activeResume?.basics?.email || p?.personalInfo?.email || '',
    github: githubProfile || '',
    linkedIn: linkedInProfile || '',
    website: activeResume?.basics?.url || p?.personalInfo?.website || '',
  };

  const projects = (activeResume?.projects?.length ? activeResume.projects : p?.projects)?.map((proj: any) => ({
    id: proj.id,
    name: proj.name,
    description: proj.highlights?.[0] || proj.description || 'Technical implementation and architecture.',
    githubUrl: proj.githubUrl || proj.url,
    technologies: proj.technologies || ['TypeScript', 'React'],
  })) || [];

  const rawSkills = activeResume?.skills?.flatMap((s) => s.items || []) || [];
  const profileSkills = p?.skills ? [
    ...(p.skills.languages || []),
    ...(p.skills.frameworks || []),
    ...(p.skills.databases || []),
    ...(p.skills.cloud || []),
    ...(p.skills.tools || []),
  ] : [];

  const skillsList = rawSkills.length > 0 ? rawSkills : (profileSkills.length > 0 ? profileSkills : [
    'TypeScript',
    'React',
    'PostgreSQL',
    'Node.js',
    'Docker',
    'Git',
  ]);

  const experience = (activeResume?.work?.length ? activeResume.work : p?.experience)?.map((w: any) => ({
    id: w.id,
    position: w.position,
    company: w.company,
    startDate: w.startDate,
    endDate: w.endDate,
    responsibilities: w.responsibilities,
  })) || [];

  const education = (activeResume?.education?.length ? activeResume.education : p?.education)?.map((e: any) => ({
    id: e.id,
    institution: e.institution,
    degree: e.degree,
    field: e.field,
    cgpa: e.cgpa,
  })) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121316] p-6 rounded-2xl border border-forge-200 dark:border-white/[0.07] shadow-xs no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-forge-400 dark:text-slate-500 uppercase tracking-wider">Web Showcase</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Live Interactive Portfolio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forge-900 dark:text-white tracking-tight mt-1">
            Personal Portfolio Webpage
          </h1>
          <p className="text-xs text-forge-500 dark:text-slate-400 mt-0.5">
            Auto-generated live web page derived from your active resume.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center space-x-1.5 p-1 bg-forge-100 dark:bg-white/[0.06] rounded-lg text-xs font-semibold">
            <Palette className="w-3.5 h-3.5 text-forge-500 dark:text-slate-400 ml-1.5" />
            <button
              onClick={() => handleThemeChange('clean')}
              className={`px-2.5 py-1 rounded transition-colors ${portfolio.theme === 'clean' ? 'bg-white dark:bg-[#121316] shadow-xs text-forge-900 dark:text-white' : 'text-forge-600 dark:text-slate-400'}`}
            >
              Clean
            </button>
            <button
              onClick={() => handleThemeChange('slate')}
              className={`px-2.5 py-1 rounded transition-colors ${portfolio.theme === 'slate' ? 'bg-white dark:bg-[#121316] shadow-xs text-forge-900 dark:text-white' : 'text-forge-600 dark:text-slate-400'}`}
            >
              Slate
            </button>
            <button
              onClick={() => handleThemeChange('editorial')}
              className={`px-2.5 py-1 rounded transition-colors ${portfolio.theme === 'editorial' ? 'bg-white dark:bg-[#121316] shadow-xs text-forge-900 dark:text-white' : 'text-forge-600 dark:text-slate-400'}`}
            >
              Editorial
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white dark:bg-[#121316] border border-forge-300 dark:border-white/[0.08] text-forge-800 dark:text-slate-200 rounded-lg hover:bg-forge-50 dark:hover:bg-[#1a1b20] shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>

      {/* Live Rendered Web Portfolio */}
      <div
        className={`rounded-2xl border p-8 sm:p-12 transition-all ${
          portfolio.theme === 'slate'
            ? 'bg-slate-900 text-slate-100 border-slate-800'
            : portfolio.theme === 'editorial'
            ? 'bg-[#FAF8F5] text-stone-900 border-stone-300 font-serif'
            : 'bg-white text-forge-900 border-forge-200'
        }`}
      >
        {/* Hero / About */}
        <section className="pb-10 border-b border-forge-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{personalInfo.fullName}</h1>
            <p className="text-base font-medium opacity-80">{personalInfo.label}</p>
            <p className="text-xs sm:text-sm leading-relaxed opacity-70 pt-2">{personalInfo.summary}</p>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 underline opacity-80 hover:opacity-100"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {personalInfo.linkedIn && (
                <a
                  href={personalInfo.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 underline opacity-80 hover:opacity-100"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center space-x-1 underline opacity-80 hover:opacity-100"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{personalInfo.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Section 36: Visual QR Code Matrix */}
          {portfolio.showQrCode && (
            <div className="p-3 bg-white text-black rounded-xl border border-forge-200 dark:border-slate-800 shadow-sm text-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto" aria-label="Portfolio QR Code">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="24" height="24" fill="black" />
                <rect x="14" y="14" width="16" height="16" fill="white" />
                <rect x="18" y="18" width="8" height="8" fill="black" />
                <rect x="66" y="10" width="24" height="24" fill="black" />
                <rect x="70" y="14" width="16" height="16" fill="white" />
                <rect x="74" y="18" width="8" height="8" fill="black" />
                <rect x="10" y="66" width="24" height="24" fill="black" />
                <rect x="14" y="70" width="16" height="16" fill="white" />
                <rect x="18" y="74" width="8" height="8" fill="black" />
                <rect x="38" y="14" width="4" height="4" fill="black" />
                <rect x="46" y="14" width="4" height="4" fill="black" />
                <rect x="54" y="14" width="4" height="4" fill="black" />
                <rect x="14" y="38" width="4" height="4" fill="black" />
                <rect x="14" y="46" width="4" height="4" fill="black" />
                <rect x="14" y="54" width="4" height="4" fill="black" />
                <rect x="38" y="38" width="24" height="24" fill="black" />
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <rect x="46" y="46" width="8" height="8" fill="black" />
                <rect x="66" y="42" width="6" height="6" fill="black" />
                <rect x="78" y="42" width="6" height="6" fill="black" />
                <rect x="66" y="54" width="6" height="6" fill="black" />
                <rect x="74" y="66" width="6" height="6" fill="black" />
                <rect x="82" y="78" width="8" height="8" fill="black" />
                <rect x="42" y="70" width="6" height="6" fill="black" />
                <rect x="54" y="78" width="6" height="6" fill="black" />
                <rect x="70" y="82" width="6" height="6" fill="black" />
              </svg>
              <span className="text-[10px] text-forge-600 font-mono font-bold block mt-1">Scan for Portfolio</span>
            </div>
          )}
        </section>

        {/* Featured Projects */}
        <section className="py-10 border-b border-forge-200/50 space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider opacity-90">Featured Projects</h2>
          {projects.length === 0 ? (
            <div className="py-8 text-center text-xs opacity-70 border border-dashed border-forge-300/40 rounded-xl">
              No projects added yet. Add your projects in your Master Profile to showcase them here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-xl border border-forge-200/40 bg-forge-50/20 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start font-bold text-sm">
                      <span>{proj.name}</span>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs opacity-75 mt-1">{proj.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {proj.technologies.map((t: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-forge-200/30 opacity-80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills Tag Cloud */}
        <section className="py-10 border-b border-forge-200/50 space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-wider opacity-90">Core Competencies</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {skillsList.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg border border-forge-200/60 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-wider opacity-90">Experience</h2>
            {experience.length === 0 ? (
              <p className="text-xs opacity-70 italic">No experience added yet.</p>
            ) : (
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs space-y-1">
                    <div className="font-bold text-sm">{exp.position}</div>
                    <div className="opacity-75">{exp.company} • {exp.startDate} – {exp.endDate}</div>
                    <p className="opacity-70 leading-relaxed pt-1">{exp.responsibilities[0]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-wider opacity-90">Education & Academic Background</h2>
            {education.length === 0 ? (
              <p className="text-xs opacity-70 italic">No education records added yet.</p>
            ) : (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-1">
                    <div className="font-bold text-sm">{edu.institution}</div>
                    <div className="opacity-75">{edu.degree} in {edu.field} (GPA: {edu.cgpa})</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
