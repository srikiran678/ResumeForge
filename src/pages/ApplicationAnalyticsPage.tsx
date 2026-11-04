import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  FileSpreadsheet,
  X,
  Target,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { AnalyticsEngine } from '../modules/careerSuite';
import { JobApplication } from '../types';

export const ApplicationAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, saveApplication } = useWorkspace();
  const { showToast } = useToast();

  const [showImportModal, setShowImportModal] = useState(false);
  const [csvInputText, setCsvInputText] = useState('');
  const [previewApps, setPreviewApps] = useState<JobApplication[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute analytics
  const analytics = useMemo(() => {
    return AnalyticsEngine.computeAnalytics(applications);
  }, [applications]);

  // Handle Export
  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast('No applications to export yet', 'info');
      return;
    }
    const csvContent = AnalyticsEngine.exportToCSV(applications);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `resumeforge_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported applications to CSV successfully', 'success');
  };

  // Handle Download Sample CSV
  const handleDownloadSample = () => {
    const sample = AnalyticsEngine.generateSampleCSV();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'resumeforge_sample_applications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle File Upload for Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvInputText(text);
        const parsed = AnalyticsEngine.importFromCSV(text, user?.id || 'guest');
        setPreviewApps(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleParseManualText = (text: string) => {
    setCsvInputText(text);
    if (!text.trim()) {
      setPreviewApps([]);
      return;
    }
    const parsed = AnalyticsEngine.importFromCSV(text, user?.id || 'guest');
    setPreviewApps(parsed);
  };

  const handleConfirmImport = () => {
    if (previewApps.length === 0) {
      showToast('No valid applications detected to import', 'info');
      return;
    }

    previewApps.forEach(app => {
      saveApplication(app);
    });

    showToast(`Successfully imported ${previewApps.length} applications into your pipeline!`, 'success');
    setShowImportModal(false);
    setCsvInputText('');
    setPreviewApps([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#0c0d13] dark:via-[#131526] dark:to-[#0c0d13] border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <BarChart3 className="size-3.5 text-indigo-400" />
                <span>Pipeline Conversion Telemetry</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Bidirectional CSV Sync
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
              Application Funnel & Intelligence
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Track conversion benchmarks across each recruitment stage, evaluate response velocities, and sync data seamlessly with spreadsheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Upload className="size-4" />
              <span>Import CSV</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Download className="size-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Tracked */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tracked</span>
            <div className="size-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Briefcase className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums font-display">
              {analytics.totalApplications}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ({analytics.activeCount} active)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Across all pipeline stages
          </span>
        </div>

        {/* Interview Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interview Rate</span>
            <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Target className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums font-display">
              {analytics.interviewRate}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {analytics.interviewRate >= 20 ? 'Above avg' : 'In range'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Applied to interview conversion
          </span>
        </div>

        {/* Avg Response Velocity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Response Velocity</span>
            <div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums font-display">
              {analytics.avgResponseDays}d
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              average lag
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            From submission to recruiter callback
          </span>
        </div>

        {/* Offers Received */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Offer Conversion</span>
            <div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums font-display">
              {analytics.offerRate}%
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              final round win rate
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Interviews converted to offers
          </span>
        </div>
      </div>

      {/* Full Recruitment Funnel Visualization */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="size-5 text-indigo-500" />
              <span>Recruitment Funnel Conversion Flow</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualize stage-by-stage attrition from initial discovery down to formal employment offer.
            </p>
          </div>
          <Link
            to="/applications"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>Open Kanban Board</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Funnel Stage Bars */}
        <div className="space-y-4">
          {analytics.stageFunnel.map((stage, idx) => {
            const maxCount = Math.max(1, analytics.totalApplications);
            const widthPercent = Math.max(8, Math.round((stage.count / maxCount) * 100));

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-200">
                    <span className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span>{stage.stage}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {stage.count} roles
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      ({stage.conversionRate}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-white/[0.06] h-3.5 rounded-xl overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-lg transition-all duration-700"
                    style={{
                      width: `${stage.count > 0 ? widthPercent : 0}%`,
                      backgroundColor: stage.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Telemetry: Activity Velocity & AI Strategy Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Weekly Submission Velocity & Top Targets */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weekly Volume */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="size-4 text-indigo-500" />
              <span>Application Submission Velocity</span>
            </h3>

            <div className="grid grid-cols-4 gap-3 pt-2">
              {analytics.weeklyVolume.map((w, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161720] border border-slate-100 dark:border-white/[0.06] text-center space-y-1">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">{w.week}</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums font-display">{w.count}</span>
                  <span className="text-[10px] text-slate-400 block">applications</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Target Companies */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111218] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Briefcase className="size-4 text-purple-500" />
              <span>Top Companies in Pipeline</span>
            </h3>

            {analytics.topCompanies.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No companies recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {analytics.topCompanies.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-[#161720] text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.company}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                      {c.count} role{c.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): AI Strategic Recommendations & Fast Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/40 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-indigo-950 dark:text-indigo-300">
              <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold">Pipeline Strategy Insights</h3>
            </div>

            <div className="space-y-3">
              {analytics.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-[#141522]/60 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-indigo-200/50 dark:border-indigo-800/30 space-y-2">
              <button
                onClick={() => navigate('/jobs')}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Discover Matching Jobs</span>
                <ArrowRight className="size-3.5" />
              </button>

              <button
                onClick={() => navigate('/interview-prep')}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#1a1b24] hover:bg-slate-50 dark:hover:bg-[#222430] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Rehearse STAR Behavioral Answers</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111218] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center space-x-2.5">
                <FileSpreadsheet className="size-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Import Applications from CSV
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Upload a CSV spreadsheet or paste comma-delimited data. Supported columns: <code>Company, Role, Status, Location, Salary, Application Date, Interview Date, Job URL, Notes</code>.
              </p>

              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1a1b24] hover:bg-slate-200 dark:hover:bg-[#222430] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  <span>Choose File (.csv)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Paste CSV Text Directly:
                </label>
                <textarea
                  rows={4}
                  value={csvInputText}
                  onChange={(e) => handleParseManualText(e.target.value)}
                  placeholder={`Company,Role,Status,Location\n"Vercel","Frontend SWE","Applied","Remote"`}
                  className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-[#161720] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {previewApps.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Parsed Preview ({previewApps.length} applications detected)</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-xl divide-y divide-slate-100 dark:divide-white/[0.06] text-xs">
                    {previewApps.slice(0, 5).map((app, idx) => (
                      <div key={idx} className="p-2.5 flex justify-between items-center bg-white dark:bg-[#111218]">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white mr-2">{app.company}</span>
                          <span className="text-slate-500 dark:text-slate-400">{app.role}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">
                          {app.status}
                        </span>
                      </div>
                    ))}
                    {previewApps.length > 5 && (
                      <div className="p-2 text-center text-[11px] text-slate-400 bg-slate-50 dark:bg-[#161720]">
                        + {previewApps.length - 5} more records
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1b24] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={previewApps.length === 0}
                onClick={handleConfirmImport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Import {previewApps.length} Applications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
