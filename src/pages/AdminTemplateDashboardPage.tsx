import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Database, 
  RefreshCw,
  Building2,
  ArrowLeft,
  ExternalLink,
  Plus
} from 'lucide-react';
import { CompanyTemplate, AgentRun, Company } from '../data/types';
import { CompanyTemplateService } from '../services/companyTemplateService';
import { ResumeLibraryAgent } from '../services/resumeLibraryAgent';

export const AdminTemplateDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'all' | 'runs' | 'companies'>('pending');
  const [templates, setTemplates] = useState<CompanyTemplate[]>([]);
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentRunning, setAgentRunning] = useState(false);
  const [runNotification, setRunNotification] = useState<string | null>(null);

  // Review modal
  const [selectedTemplate, setSelectedTemplate] = useState<CompanyTemplate | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New Company form
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySlug, setNewCompanySlug] = useState('');
  const [newCompanyCareersUrl, setNewCompanyCareersUrl] = useState('');
  const [newCompanyDesc, setNewCompanyDesc] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allTmpls, runs, comps] = await Promise.all([
        CompanyTemplateService.getTemplates(undefined, true),
        CompanyTemplateService.getAgentRuns(10),
        CompanyTemplateService.getCompanies()
      ]);
      setTemplates(allTmpls);
      setAgentRuns(runs);
      setCompanies(comps);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRunAgentNow = async () => {
    setAgentRunning(true);
    setRunNotification('Resume Library Agent initiated: scanning sources, validating licenses & checking SHA-256 hashes...');
    try {
      const runResult = await ResumeLibraryAgent.runDiscovery('manual');
      setRunNotification(`Agent finished: ${runResult.results?.imported || 0} imported, ${runResult.results?.duplicates || 0} duplicates skipped, ${runResult.results?.errors || 0} errors.`);
      await loadAllData();
    } catch (e: any) {
      setRunNotification(`Agent execution failed: ${e?.message || e}`);
    } finally {
      setAgentRunning(false);
      setTimeout(() => setRunNotification(null), 8000);
    }
  };

  const handleUpdateStatus = async (templateId: string, status: 'published' | 'rejected' | 'pending_review' | 'archived') => {
    setActionLoading(true);
    try {
      const success = await CompanyTemplateService.updateTemplateStatus(templateId, status, reviewNotes);
      if (success) {
        setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, publication_status: status } : t));
        setSelectedTemplate(null);
        setReviewNotes('');
      }
    } catch (err) {
      console.error('Failed to update template status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    const slug = newCompanySlug.trim() || newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const { data } = await CompanyTemplateService.addCompany({
      name: newCompanyName.trim(),
      slug,
      official_careers_url: newCompanyCareersUrl.trim() || undefined,
      description: newCompanyDesc.trim() || undefined
    });
    if (data) {
      setCompanies(prev => [...prev, data]);
      setNewCompanyName('');
      setNewCompanySlug('');
      setNewCompanyCareersUrl('');
      setNewCompanyDesc('');
    }
  };

  // Filter templates based on active tab
  const displayedTemplates = templates.filter(t => {
    if (activeTab === 'pending') return t.publication_status === 'pending_review';
    if (activeTab === 'published') return t.publication_status === 'published';
    return true;
  });

  const pendingCount = templates.filter(t => t.publication_status === 'pending_review').length;
  const publishedCount = templates.filter(t => t.publication_status === 'published').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/templates')}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60">
                  Admin Control Center
                </span>
                <span className="text-xs text-slate-400 font-mono">v1.2-agent</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-0.5">
                Resume Library Agent & Review Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunAgentNow}
              disabled={agentRunning}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                agentRunning 
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {agentRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agent Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Agent Now</span>
                </>
              )}
            </button>
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Real-time Notification Banner */}
        {runNotification && (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-center space-x-3 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-medium">{runNotification}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white mt-2 font-mono">
              {pendingCount}
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
              Requires Admin Decision
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Published Templates</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white mt-2 font-mono">
              {publishedCount}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              Live in User Library
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Companies Seeded</span>
              <Building2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white mt-2 font-mono">
              {companies.length}
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
              Mapped to ATS Specs
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Agent Status</span>
              <div className={`size-2 rounded-full ${agentRunning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
            </div>
            <div className="text-base font-bold text-slate-950 dark:text-white mt-2">
              {agentRunning ? 'Processing...' : 'Scheduled / Idle'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {agentRuns[0]?.started_at ? `Last: ${new Date(agentRuns[0].started_at).toLocaleTimeString()}` : 'Ready'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-white/[0.08] overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Review Queue ({pendingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'published'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Approved & Published ({publishedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>All Catalog Items ({templates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-4 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'runs'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Agent Run History ({agentRuns.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'companies'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Companies & Roles</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'runs' ? (
          /* Agent Run Logs */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Scheduled & Manual Execution History
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Chronological Audit Log</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {agentRuns.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No agent runs recorded yet. Click "Run Agent Now" above.</div>
              ) : (
                agentRuns.map((run) => (
                  <div key={run.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          run.status === 'completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                        }`}>
                          {run.status}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white capitalize">
                          Trigger: {run.trigger_type}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {new Date(run.started_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Imported: <strong>{run.results?.imported || 0}</strong> | Duplicates: <strong>{run.results?.duplicates || 0}</strong> | Errors: <strong>{run.results?.errors || 0}</strong>
                      </div>
                    </div>
                    {run.results?.log && (
                      <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg font-mono text-[10px] text-slate-600 dark:text-slate-400 max-h-32 overflow-y-auto space-y-1">
                        {run.results.log.map((entry, idx) => (
                          <div key={idx} className={entry.level === 'error' ? 'text-rose-600 dark:text-rose-400' : entry.level === 'warn' ? 'text-amber-600 dark:text-amber-400' : ''}>
                            [{new Date(entry.timestamp).toLocaleTimeString()}] {entry.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'companies' ? (
          /* Companies & Roles Manager */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Configured Companies ({companies.length})</span>
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
                {companies.map(c => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">slug: {c.slug}</div>
                    </div>
                    {c.official_careers_url && (
                      <a href={c.official_careers_url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 text-[11px]">
                        <span>Careers</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Add New Company Entity</span>
              </h3>
              <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => {
                      setNewCompanyName(e.target.value);
                      if (!newCompanySlug) setNewCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }}
                    placeholder="e.g. Uber, Cisco, Tesla"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                  <input
                    type="text"
                    value={newCompanySlug}
                    onChange={(e) => setNewCompanySlug(e.target.value)}
                    placeholder="e.g. uber"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Careers URL</label>
                  <input
                    type="url"
                    value={newCompanyCareersUrl}
                    onChange={(e) => setNewCompanyCareersUrl(e.target.value)}
                    placeholder="https://www.uber.com/careers"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save Company
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Template Table */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Template Name</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">License & Attribution</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No templates found in this queue.
                      </td>
                    </tr>
                  ) : (
                    displayedTemplates.map((template) => {
                      const company = template.companies?.[0];
                      const role = template.roles?.[0];
                      const isPending = template.publication_status === 'pending_review';
                      const isPublished = template.publication_status === 'published';

                      return (
                        <tr key={template.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-950 dark:text-white">
                              {template.name}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {template.description}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {company?.name || 'Universal'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {role?.title || 'General SWE'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {template.source ? (
                              <div>
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                  {template.source.license_name}
                                </span>
                                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                  {template.source.file_hash}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">Internal Template</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              isPublished
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                : isPending
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                            }`}>
                              {template.publication_status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedTemplate(template)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                            >
                              Review & Audit
                            </button>
                            {isPending && (
                              <button
                                onClick={() => handleUpdateStatus(template.id, 'published')}
                                className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors shadow-2xs cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {isPublished && (
                              <button
                                onClick={() => handleUpdateStatus(template.id, 'archived')}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
                              >
                                Unpublish
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  Template Audit & License Check
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] space-y-1">
                <div><strong>Template ID:</strong> {selectedTemplate.id}</div>
                <div><strong>Status:</strong> {selectedTemplate.publication_status}</div>
                <div><strong>Layout:</strong> {selectedTemplate.layout_style}</div>
                <div><strong>Target Company:</strong> {selectedTemplate.companies?.[0]?.name || 'Universal'}</div>
              </div>

              {selectedTemplate.source && (
                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50 space-y-1 font-mono text-[11px]">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300">Provenance & Hash</div>
                  <div><strong>License:</strong> {selectedTemplate.source.license_name}</div>
                  <div><strong>Source URL:</strong> {selectedTemplate.source.source_url}</div>
                  <div><strong>Attribution:</strong> {selectedTemplate.source.attribution}</div>
                  <div className="text-[10px] text-slate-400 truncate"><strong>SHA-256:</strong> {selectedTemplate.source.file_hash}</div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reviewer Audit Notes:
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Verify license terms, formatting accuracy, and ATS compatibility..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus(selectedTemplate.id, 'rejected')}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
              >
                Reject Template
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus(selectedTemplate.id, 'published')}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
