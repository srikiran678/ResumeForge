import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ArrowRight,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { 
  JobListing, 
  JobFilterCriteria, 
  CURATED_JOB_LISTINGS, 
  JobSearchEngine 
} from '../modules/careerSuite';

export const JobSearchExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { masterProfile, resumes, currentResume, saveApplication } = useWorkspace();
  const { showToast } = useToast();

  const [keyword, setKeyword] = useState('');
  const [remoteType, setRemoteType] = useState<JobFilterCriteria['remoteType']>('ALL');
  const [experienceLevel, setExperienceLevel] = useState<JobFilterCriteria['experienceLevel']>('ALL');
  const [tier, setTier] = useState<JobFilterCriteria['tier']>('ALL');
  const [sortBy, setSortBy] = useState<JobFilterCriteria['sortBy']>('match');
  const [selectedJobId, setSelectedJobId] = useState<string>(CURATED_JOB_LISTINGS[0]?.id || '');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => JobSearchEngine.getSavedJobIds());

  // Aggregate candidate skills from active resume or master profile
  const candidateSkills = useMemo(() => {
    const resumeSkills = currentResume?.skills?.flatMap(s => s.items) || [];
    
    // Fall back or augment with master profile skills
    const profileSkills = [
      ...(masterProfile.skills.languages || []),
      ...(masterProfile.skills.frameworks || []),
      ...(masterProfile.skills.libraries || []),
      ...(masterProfile.skills.tools || []),
      ...(masterProfile.skills.databases || []),
      ...(masterProfile.skills.cloud || [])
    ];

    const merged = Array.from(new Set([...resumeSkills, ...profileSkills]));
    return merged.length > 0 ? merged : ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git', 'Node.js'];
  }, [masterProfile, currentResume]);

  const candidateHeadline = masterProfile.personalInfo?.label || 'Software Engineer';

  // Compute matched jobs
  const filteredJobs = useMemo(() => {
    return JobSearchEngine.searchJobs(
      {
        keyword,
        remoteType,
        experienceLevel,
        tier,
        sortBy
      },
      candidateSkills,
      candidateHeadline
    );
  }, [keyword, remoteType, experienceLevel, tier, sortBy, candidateSkills, candidateHeadline]);

  const selectedJob = useMemo(() => {
    return filteredJobs.find(j => j.id === selectedJobId) || filteredJobs[0] || CURATED_JOB_LISTINGS[0];
  }, [filteredJobs, selectedJobId]);

  const handleToggleSave = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowSaved = JobSearchEngine.toggleSaveJob(jobId);
    setSavedJobIds(JobSearchEngine.getSavedJobIds());
    showToast(isNowSaved ? 'Job saved to your bookmarks' : 'Job removed from bookmarks', 'info');
  };

  const handleTrackApplication = (job: JobListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const userId = user?.id || 'usr_guest';

    const newApp = JobSearchEngine.createApplicationFromJob(
      job,
      userId,
      currentResume?.id || resumes[0]?.id || '',
      'Interested'
    );

    saveApplication(newApp);
    showToast(`Added "${job.title}" at ${job.company} to your Applications pipeline!`, 'success');
  };

  const handleBridgeToCoverLetter = (job: JobListing) => {
    navigate('/cover-letters', {
      state: {
        company: job.company,
        role: job.title,
        jobDescription: `${job.title} at ${job.company}\n\n${job.description}\n\nRequired Skills: ${job.requiredSkills.join(', ')}`
      }
    });
  };

  const handleBridgeToInterviewPrep = (job: JobListing) => {
    navigate('/interview-prep', {
      state: {
        company: job.company,
        role: job.title,
        jobDescription: `${job.title} at ${job.company}\n\n${job.description}\n\nRequirements: ${job.requiredSkills.join(', ')}`
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#0d0e14] dark:via-[#131525] dark:to-[#0d0e14] border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 size-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="size-3.5 text-indigo-400" />
                <span>Real-Time ATS Matching Active</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Free
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
              Job Search Explorer
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Curated tech opportunities with instant ATS fit analysis against your master profile. Save roles, tailor your resumes, and track conversions in one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/applications')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur transition-all flex items-center space-x-2"
            >
              <Briefcase className="size-4" />
              <span>View Application Pipeline</span>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <TrendingUp className="size-4" />
              <span>Funnel Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by role, company, or tech stack (e.g. React, Next.js, Stripe, Go)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161720] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Filter className="size-3.5" />
              <span className="hidden sm:inline">Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161720] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="match">Best ATS Match %</option>
              <option value="salary">Highest Salary</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">Remote:</span>
          {(['ALL', 'Remote', 'Hybrid', 'Onsite'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setRemoteType(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                remoteType === mode
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1b24] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}

          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-3 mr-1">Level:</span>
          {(['ALL', 'Intern', 'Entry Level', 'Mid Level'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setExperienceLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                experienceLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1b24] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-3 mr-1">Tier:</span>
          {(['ALL', 'Unicorn', 'Top Startup', 'Enterprise', 'FAANG'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                tier === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1b24] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 7-col List + 5-col Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Job Cards List */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex justify-between items-center px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Showing {filteredJobs.length} opportunities</span>
            <span>Matched with your profile skills</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#111218] border border-slate-200 dark:border-white/[0.08]">
              <Briefcase className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No matching roles found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Try widening your search terms or resetting filters to explore all curated positions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setRemoteType('ALL');
                  setExperienceLevel('ALL');
                  setTier('ALL');
                  setSortBy('match');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isSelected = job.id === selectedJob.id;
              const isSaved = savedJobIds.includes(job.id);
              const score = job.matchScore || 50;

              return (
                <div
                  key={job.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedJobId(job.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedJobId(job.id);
                    }
                  }}
                  className={`p-4 md:p-5 rounded-2xl transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isSelected
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-md'
                      : 'bg-white dark:bg-[#111218] border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 hover:shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="size-10 rounded-xl bg-slate-100 dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-200 shrink-0">
                        {job.companyLogo || job.company[0]}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-300">{job.company}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 font-medium">
                            {job.tier}
                          </span>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {job.title}
                        </h2>
                      </div>
                    </div>

                    {/* Bookmark */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(job.id, e)}
                      className="text-slate-400 hover:text-amber-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title={isSaved ? "Saved" : "Save role"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="size-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center space-x-1">
                      <MapPin className="size-3 text-slate-400" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <DollarSign className="size-3" />
                      <span>{job.salaryRange.split('+')[0].trim()}</span>
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium">
                      {job.remoteType}
                    </span>
                  </div>

                  {/* ATS Match Meter & Skills */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 ${
                        score >= 80 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                          : score >= 60
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60'
                      }`}>
                        <Sparkles className="size-3" />
                        <span>{score}% Match</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {job.matchedSkills?.slice(0, 3).join(', ')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleTrackApplication(job, e)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1b24] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Track</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Job Detail Inspector */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          {selectedJob ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-lg space-y-6">
              {/* Header */}
              <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="size-12 rounded-2xl bg-slate-900 text-white dark:bg-indigo-600 flex items-center justify-center text-lg font-bold">
                      {selectedJob.companyLogo || selectedJob.company[0]}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{selectedJob.company}</span>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                        {selectedJob.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161720] border border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block font-medium">Compensation</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedJob.salaryRange}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161720] border border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block font-medium">Work Arrangement</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedJob.remoteType} • {selectedJob.experienceLevel}</span>
                  </div>
                </div>
              </div>

              {/* ATS Fit Diagnostics */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-300 flex items-center space-x-1.5">
                    <Sparkles className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>ATS Match Diagnostics</span>
                  </span>
                  <span className="text-xs font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                    {selectedJob.matchScore || 50}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedJob.matchScore || 50}%` }}
                  />
                </div>

                {/* Matched skills */}
                {selectedJob.matchedSkills && selectedJob.matchedSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Matched in Your Profile:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.matchedSkills.map((s, idx) => (
                        <span key={idx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium">
                          <CheckCircle2 className="size-2.5" />
                          <span>{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {selectedJob.missingSkills && selectedJob.missingSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                      Recommended to Add / Highlight:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.missingSkills.map((s, idx) => (
                        <span key={idx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-medium">
                          <AlertCircle className="size-2.5" />
                          <span>{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Role Overview</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Key Responsibilities</h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {selectedJob.responsibilities.map((r, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
                <a
                  href={selectedJob.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Apply on Company Portal</span>
                  <ExternalLink className="size-3.5" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTrackApplication(selectedJob)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-[#1a1b24] hover:bg-slate-200 dark:hover:bg-[#222430] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Track in Pipeline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBridgeToCoverLetter(selectedJob)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-[#1a1b24] hover:bg-slate-200 dark:hover:bg-[#222430] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="size-3.5 text-indigo-500" />
                    <span>Cover Letter</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleBridgeToInterviewPrep(selectedJob)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#161720] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="size-3.5 text-purple-500" />
                  <span>Prepare STAR Interview Scenarios</span>
                  <ArrowRight className="size-3.5 ml-1 text-slate-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#111218] border border-slate-200 dark:border-white/[0.08]">
              <p className="text-xs text-slate-400">Select any position from the list to view its complete ATS diagnostics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
