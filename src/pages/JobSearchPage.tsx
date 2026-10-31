import React, { useMemo, useState } from 'react';
import { ExternalLink, BriefcaseBusiness, BookmarkPlus, Search, ShieldCheck, ClipboardList } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import type { JobApplication } from '../types';

export const JobSearchPage: React.FC = () => {
  const { user } = useAuth();
  const { resumes, applications, saveApplication } = useWorkspace();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('India');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [description, setDescription] = useState('');
  const [resumeId, setResumeId] = useState(resumes[0]?.id || '');
  const [message, setMessage] = useState('');

  const searchQuery = useMemo(() => [role, location].filter(Boolean).join(' '), [role, location]);
  const searchLinks = [
    { label: 'Google Jobs', href: 'https://www.google.com/search?q=' + encodeURIComponent(searchQuery + ' jobs') },
    { label: 'LinkedIn Jobs', href: 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(role) + '&location=' + encodeURIComponent(location) },
    { label: 'Indeed', href: 'https://in.indeed.com/jobs?q=' + encodeURIComponent(role) + '&l=' + encodeURIComponent(location) },
    { label: 'Wellfound', href: 'https://wellfound.com/jobs' },
  ];

  const handleTrack = (event: React.FormEvent) => {
    event.preventDefault();
    if (!company.trim() || !role.trim()) {
      setMessage('Add the company and role before saving this opportunity.');
      return;
    }
    const selectedResume = resumes.find((resume) => resume.id === resumeId);
    const application: JobApplication = {
      id: crypto.randomUUID(),
      userId: user?.id || 'local-demo',
      company: company.trim(),
      role: role.trim(),
      jobUrl: jobUrl.trim() || undefined,
      location: location.trim() || undefined,
      resumeId: selectedResume?.id || '',
      resumeVersion: selectedResume?.meta.version || '1.0',
      status: 'Interested',
      notes: description.trim() ? 'Job description saved for review:\n' + description.trim() : 'Added from ResumeForge Job Search.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveApplication(application);
    setMessage('Opportunity saved to your Application Tracker.');
    setCompany('');
    setJobUrl('');
    setDescription('');
  };

  const trackedCount = applications.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <header className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <BriefcaseBusiness className="w-4 h-4" /> Career search workspace
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">Find the right role. Apply with evidence.</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">Search public job boards, save roles you want to pursue, then prepare each application with your verified ResumeForge profile. Job listings are opened on their original sites; this page does not scrape sites or submit applications for you.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {searchLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 dark:bg-white dark:text-slate-950"><Search className="w-3.5 h-3.5" />{link.label}<ExternalLink className="w-3 h-3" /></a>)}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <form onSubmit={handleTrack} className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-6">
          <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Save a job opportunity</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Paste a listing you found on a job board. It will appear in your existing application tracker.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target role *<input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer Intern" className="mt-1 w-full rounded-lg border border-slate-300 dark:border-white/10 bg-transparent p-3 text-sm" /></label>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="India / Remote" className="mt-1 w-full rounded-lg border border-slate-300 dark:border-white/10 bg-transparent p-3 text-sm" /></label>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company name *<input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" className="mt-1 w-full rounded-lg border border-slate-300 dark:border-white/10 bg-transparent p-3 text-sm" /></label>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Job posting URL<input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-slate-300 dark:border-white/10 bg-transparent p-3 text-sm" /></label>
          </div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Job description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={20000} placeholder="Paste the responsibilities and requirements. Keep the original wording so you can compare it with your evidence." className="mt-1 w-full rounded-lg border border-slate-300 dark:border-white/10 bg-transparent p-3 text-sm" /><span className="mt-1 block text-right text-[10px] text-slate-400">{description.length.toLocaleString()} / 20,000</span></label>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Resume to associate<select value={resumeId} onChange={(e) => setResumeId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-white/10 bg-transparent p-3 text-sm"><option value="">Choose later</option>{resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}</option>)}</select></label>
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500"><BookmarkPlus className="mr-2 inline h-4 w-4" />Save to Application Tracker</button>
          {message && <p role="status" className="text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}
        </form>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-6">
            <div className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-indigo-500" /><h2 className="font-bold text-slate-900 dark:text-white">Your application pipeline</h2></div>
            <p className="mt-3 text-4xl font-black text-slate-950 dark:text-white">{trackedCount}</p><p className="text-xs text-slate-500 dark:text-slate-400">opportunities currently tracked</p>
            <a href="/applications" className="mt-4 inline-flex text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Open Application Tracker →</a>
          </section>
          <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/20 p-6">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300"><ShieldCheck className="h-5 w-5" /><h2 className="font-bold">Evidence-first applications</h2></div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-emerald-900 dark:text-emerald-200">
              <li>• Use Job Description Analyzer to identify supported matches and genuine gaps.</li>
              <li>• Tailor only claims supported by your Master Profile.</li>
              <li>• Review every change before using it in an application.</li>
              <li>• Never let an agent invent experience, skills, dates or achievements.</li>
            </ul>
            <a href="/ai" className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600">Open Honest AI Analyzer ↗</a>
          </section>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Inspired by the open-source AI Job Search workflow. ResumeForge adapts its role evaluation and application-preparation stages while retaining your existing profile, ATS-safe resume rules and approval controls.</p>
        </aside>
      </div>
    </div>
  );
};

export default JobSearchPage;
