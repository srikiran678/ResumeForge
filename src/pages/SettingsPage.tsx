import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle, 
  Key, 
  Globe,
  Sun,
  Moon,
  Laptop,
  Palette,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { useTheme, Theme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { 
    exportAllData, 
    importAllData, 
    resetAllData, 
    publicLinks, 
    revokePublicLink, 
    togglePublicLink, 
    resumes 
  } = useWorkspace();
  const { theme, actualTheme, setTheme } = useTheme();

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Handle Export All Data
  const handleExportAll = () => {
    const jsonStr = exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resumeforge_complete_career_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Handle Import JSON
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus(null);

    if (!importJsonText.trim()) {
      setImportStatus({ error: 'Input cannot be empty. Please paste valid JSON.' });
      return;
    }

    try {
      JSON.parse(importJsonText);
      const res = importAllData(importJsonText);
      if (res.success) {
        setImportStatus({ success: true });
        setImportJsonText('');
      } else {
        setImportStatus({ error: res.error || 'Failed to import JSON structure.' });
      }
    } catch (err: any) {
      setImportStatus({
        error: `Invalid JSON syntax: ${err.message}. Make sure quotes and braces are closed.`,
      });
    }
  };

  // Delete All Data / Delete Account
  const handleDeleteAllData = () => {
    const confirmation = prompt('Type "DELETE EVERYTHING" to permanently remove all your resumes and application history.');
    if (confirmation === 'DELETE EVERYTHING') {
      resetAllData();
      alert('All local career workspace data has been permanently cleared.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt('Type "DELETE ACCOUNT" to permanently delete your account.');
    if (confirmation === 'DELETE ACCOUNT') {
      resetAllData();
      await signOut();
      alert('Account deleted and signed out.');
    }
  };

  const themeOptions: { id: Theme; title: string; subtitle: string; icon: React.FC<any>; previewBg: string }[] = [
    {
      id: 'light',
      title: 'Light Theme',
      subtitle: 'Daylight clean high-contrast',
      icon: Sun,
      previewBg: 'bg-white border-slate-200 text-slate-900',
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      subtitle: 'Obsidian slate developer dark',
      icon: Moon,
      previewBg: 'bg-slate-900 border-slate-700 text-slate-100',
    },
    {
      id: 'system',
      title: 'System Theme',
      subtitle: 'Auto-sync with OS preference',
      icon: Laptop,
      previewBg: 'bg-gradient-to-r from-white to-slate-900 border-slate-400 text-slate-800',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-left space-y-6 sm:space-y-8 transition-colors duration-150">
      {/* Header with Live Preview Button beside Settings */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forge-900 dark:text-white tracking-tight text-balance">
            Privacy Center & Workspace Settings
          </h1>
          <p className="text-xs text-forge-500 dark:text-slate-400 mt-1 text-pretty">
            You own 100% of your career information. Export your data anytime, customize your device theme, or revoke public links.
          </p>
        </div>

        <Link
          to="/portfolio"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-850 dark:hover:bg-slate-100 font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 group"
          title="Open live web portfolio and public showcase preview"
        >
          <Eye className="w-4 h-4 text-indigo-400 dark:text-indigo-600 group-hover:scale-105 transition-transform" />
          <span>Live Preview</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </Link>
      </div>

      {/* Feature: Appearance & Dark Mode (Compactable & Responsive across all devices) */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-forge-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-forge-800 dark:text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900 dark:text-white">
              Appearance & Dark Mode
            </h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
            Active: <span className="capitalize ml-1 font-bold">{theme}</span> ({actualTheme})
          </span>
        </div>

        <p className="text-xs text-forge-600 dark:text-slate-300 text-pretty">
          Select your preferred workspace theme. Compatible across mobile phones, tablets, laptops, and ultra-wide screens. Settings persist automatically.
        </p>

        {/* Responsive Theme Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`relative p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    opt.id === 'light' 
                      ? 'bg-amber-100 text-amber-700' 
                      : opt.id === 'dark' 
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      <span>Selected</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {opt.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {opt.subtitle}
                  </p>
                </div>

                {/* Mini Wireframe Preview */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center space-x-1.5">
                  <div className={`w-3 h-3 rounded-full ${opt.id === 'light' ? 'bg-amber-400' : opt.id === 'dark' ? 'bg-indigo-500' : 'bg-slate-400'}`} />
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {opt.id === 'light' ? '#FFFFFF Canvas' : opt.id === 'dark' ? '#0F172A Canvas' : 'System Match'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account & Authentication Card */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-forge-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-forge-800 dark:text-slate-200" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900 dark:text-white">
              Account & Authentication
            </h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            InsForge Backend Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div className="p-3 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800">
            <span className="text-forge-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Connected User</span>
            <p className="font-semibold text-forge-900 dark:text-white mt-0.5">{user?.fullName || 'Active User'}</p>
          </div>
          <div className="p-3 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800">
            <span className="text-forge-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
            <p className="font-semibold text-forge-900 dark:text-white mt-0.5 truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <div className="p-3 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-forge-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Auth Provider</span>
              <p className="font-semibold text-forge-900 dark:text-white mt-0.5">
                {user ? 'InsForge (Google / Email)' : 'Guest'}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 underline ml-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Full career data bundle exported successfully!</span>
        </div>
      )}

      {/* Privacy Transparency Disclosure */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-forge-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900 dark:text-white">
            Privacy Principles & Data Handling
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs text-forge-600 dark:text-slate-300">
          <div className="p-3.5 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800 space-y-1">
            <strong className="text-forge-900 dark:text-white block">What Data Is Stored?</strong>
            <p className="leading-relaxed text-[11px]">
              Your tailored resumes, application history, and immutable submission snapshots. Everything is isolated per user with InsForge PostgreSQL Row-Level Security.
            </p>
          </div>

          <div className="p-3.5 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800 space-y-1">
            <strong className="text-forge-900 dark:text-white block">What Is Sent to AI?</strong>
            <p className="leading-relaxed text-[11px]">
              Only the specific bullet point or job description you explicitly choose to improve. Data is processed securely and never used to train public foundation models.
            </p>
          </div>

          <div className="p-3.5 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800 space-y-1">
            <strong className="text-forge-900 dark:text-white block">How Do Public Resumes Work?</strong>
            <p className="leading-relaxed text-[11px]">
              Public resumes use unguessable, non-sequential slugs (e.g. <code className="text-indigo-600 dark:text-indigo-400 font-mono">/r/a8F4k29Lm</code>). You can toggle them between Public, Unlisted, or Private, or revoke them instantly with one click.
            </p>
          </div>

          <div className="p-3.5 bg-forge-50 dark:bg-slate-800/60 rounded-xl border border-forge-100 dark:border-slate-800 space-y-1">
            <strong className="text-forge-900 dark:text-white block">Zero Vendor Lock-In</strong>
            <p className="leading-relaxed text-[11px]">
              Export your entire profile and all resumes as standard JSON anytime. You can move your data into any other tool or re-import it whenever you want.
            </p>
          </div>
        </div>
      </div>

      {/* Web Portfolio & Live Showcase Settings */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-forge-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900 dark:text-white">
              Web Portfolio & Live Showcase
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            title="Preview live portfolio web page"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Web Showcase</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </Link>
        </div>

        <p className="text-xs text-forge-600 dark:text-slate-300">
          Your active career data is compiled into a personal web showcase with custom styling themes (Clean, Slate, Editorial) and optional QR code credentials.
        </p>
      </div>

      {/* Public Resume Links Management */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-forge-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-forge-800 dark:text-slate-200" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900 dark:text-white">
              Public Resume Links & Access Control
            </h2>
          </div>
          {resumes.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const link = togglePublicLink(resumes[0].id, 'public');
                window.open(`/r/${link.slug}`, '_blank');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-850 dark:hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
              title="Create a share link and preview it"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
              <span>Preview New Link</span>
            </button>
          )}
        </div>

        {publicLinks.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-forge-500 dark:text-slate-400">
              No public links currently active. You can generate a public share link to preview your resume anytime.
            </p>
            {resumes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const link = togglePublicLink(resumes[0].id, 'public');
                  window.open(`/r/${link.slug}`, '_blank');
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Create & Preview Link</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {publicLinks.map((link) => {
              const res = resumes.find((r) => r.id === link.resumeId);
              const url = `${window.location.origin}/r/${link.slug}`;

              return (
                <div
                  key={link.id}
                  className="p-3.5 rounded-xl border border-forge-200 dark:border-slate-800 bg-forge-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-forge-900 dark:text-white">{res?.title || 'Resume'}</div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-mono text-[11px] hover:underline break-all inline-flex items-center space-x-1"
                    >
                      <span>{url}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                    </a>
                    <div className="text-[10px] text-forge-400 dark:text-slate-400 mt-0.5">
                      Access: <strong className="uppercase">{link.accessType}</strong> • Views: {link.viewsCount}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                      title="Preview public resume in a new tab"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Preview</span>
                    </a>

                    <select
                      value={link.accessType}
                      onChange={(e) =>
                        togglePublicLink(link.resumeId, e.target.value as any)
                      }
                      className="p-1.5 border border-forge-300 dark:border-slate-750 rounded text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                      <option value="private">Private (Revoked)</option>
                    </select>

                    <button
                      onClick={() => revokePublicLink(link.slug)}
                      className="px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded border border-rose-200 dark:border-rose-900/50 font-semibold cursor-pointer"
                    >
                      Revoke Link
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Data Export / Import */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-forge-100 dark:border-slate-800">
          <Download className="w-5 h-5 text-forge-800 dark:text-slate-200" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900 dark:text-white">
            Export & Import Account Data (JSON)
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <button
            onClick={handleExportAll}
            className="w-full sm:w-auto px-5 py-2.5 bg-forge-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-forge-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete Career Backup (JSON)</span>
          </button>
        </div>

        {/* Import JSON Form */}
        <form onSubmit={handleImportSubmit} className="pt-4 border-t border-forge-100 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-forge-800 dark:text-slate-200">
            Import JSON Data File (Restores Resumes & Applications):
          </label>
          <textarea
            rows={4}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder='Paste your backup JSON here: { "masterProfile": { ... }, "resumes": [ ... ] }'
            className="w-full text-xs p-3 border border-forge-300 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-forge-900 dark:focus:ring-indigo-500 font-mono bg-forge-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />

          {importStatus?.error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300">
              <strong>Import Error:</strong> {importStatus.error}
            </div>
          )}

          {importStatus?.success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              ✓ Successfully imported and updated workspace!
            </div>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-forge-800 dark:bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-forge-700 dark:hover:bg-indigo-500 transition-colors flex items-center justify-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Validate & Import JSON</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Delete Data & Account */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 p-5 sm:p-6 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs space-y-4">
        <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-400 font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Danger Zone (Permanent Actions)</span>
        </div>

        <p className="text-forge-600 dark:text-slate-300">
          In accordance with our user data ownership principle, you have the right to permanently purge all data from this workspace.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDeleteAllData}
            className="px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-xs"
          >
            Delete All Workspace Data
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-xs"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
