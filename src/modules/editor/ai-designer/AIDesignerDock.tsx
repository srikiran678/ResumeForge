import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  ChevronDown, 
  Zap, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Compass, 
  Palette
} from 'lucide-react';
import { useAIDesigner } from './useAIDesigner';
import { DesignerPromptChip } from './types';

const PROMPT_CHIPS: DesignerPromptChip[] = [
  { id: 'jake', label: "Jake's LaTeX", iconName: 'FileText', prompt: "Format this as Jake's LaTeX resume with 1-page compact density", category: 'format' },
  { id: 'google', label: 'Google SWE (XYZ)', iconName: 'Building2', prompt: 'Optimize layout for Google SWE ATS and apply XYZ formula to bullets', category: 'format' },
  { id: 'harvard', label: 'Harvard Classic', iconName: 'Compass', prompt: 'Switch to Harvard Academic & Professional serif format with crimson accents', category: 'format' },
  { id: 'wallstreet', label: 'Wall Street IB', iconName: 'Building2', prompt: 'Format for Wall Street & Investment Banking with 0.5" margins and hide summary', category: 'format' },
  { id: 'mckinsey', label: 'McKinsey Strategy', iconName: 'Layers', prompt: 'Apply McKinsey Management Consulting format with executive leadership focus', category: 'format' },
  { id: 'fit1page', label: 'Fit onto 1 Page', iconName: 'Zap', prompt: 'Auto-fit resume to exactly 1 page by tightening vertical spacing and margins', category: 'layout' },
  { id: 'stripe', label: 'Stripe Indigo', iconName: 'Palette', prompt: 'Set accent color to Stripe Indigo palette', category: 'style' },
  { id: 'edufirst', label: 'Education Top', iconName: 'Compass', prompt: 'Move Education section to the top of the resume', category: 'layout' },
];

export const AIDesignerDock: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    prompt, 
    setPrompt, 
    isProcessing, 
    lastResult, 
    canUndo, 
    applyPrompt, 
    revertLastMutation, 
    applyChip 
  } = useAIDesigner();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;
    applyPrompt(prompt);
  };

  return (
    <aside 
      aria-label="Live AI Resume Designer"
      className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md w-full transition-all duration-300"
    >
      {/* Minimized Pill */}
      {!isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="ml-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 border border-slate-700/50 backdrop-blur-md transition-all group"
        >
          <div className="relative">
            <Sparkles className="size-4 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 size-2 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-wide">Live AI Resume Designer</span>
          <span className="text-[10px] bg-slate-800 dark:bg-indigo-700 px-1.5 py-0.5 rounded-full text-slate-300">Prompt</span>
        </button>
      )}

      {/* Expanded Dock */}
      {isExpanded && (
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-left flex flex-col animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-amber-300">
                <Sparkles className="size-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">Live AI Resume Designer</h3>
                <p className="text-[10px] text-slate-300">Prompt-driven live styling &amp; ATS formatting</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {canUndo && (
                <button
                  type="button"
                  onClick={revertLastMutation}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all font-medium"
                  title="Undo last modification"
                >
                  <RotateCcw className="size-3" />
                  <span>Undo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Minimize designer dock"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Quick Formatting Presets</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">● 0 Quota • Local-First</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => applyChip(chip)}
                  className="px-2 py-1 rounded-md text-[10.5px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-xs transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {chip.id === 'fit1page' && <Zap className="size-2.5 text-amber-500" />}
                  {chip.id === 'google' && <Building2 className="size-2.5 text-blue-500" />}
                  {chip.id === 'jake' && <FileText className="size-2.5 text-emerald-500" />}
                  {chip.id === 'harvard' && <Compass className="size-2.5 text-rose-500" />}
                  {chip.id === 'stripe' && <Palette className="size-2.5 text-indigo-500" />}
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Changelog / Feedback Alert */}
          {lastResult && (
            <div className="px-3 py-2 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-800/40 flex items-start justify-between gap-2 text-[11px] text-emerald-900 dark:text-emerald-300">
              <div className="flex items-start gap-1.5 flex-1">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-tight">
                  <span className="font-semibold">{lastResult.message}</span>
                  {lastResult.changes && lastResult.changes.length > 0 && (
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      {lastResult.changes.join(' • ')}
                    </div>
                  )}
                </div>
              </div>
              {canUndo && (
                <button
                  type="button"
                  onClick={revertLastMutation}
                  className="text-[10px] text-emerald-800 dark:text-emerald-200 underline hover:no-underline font-semibold shrink-0"
                >
                  Revert
                </button>
              )}
            </div>
          )}

          {/* Prompt Form */}
          <form onSubmit={handleSubmit} className="p-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
                placeholder="Ask to restyle, format for a company, or auto-fit..."
                className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isProcessing}
                className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-colors"
                title="Send design prompt"
              >
                {isProcessing ? (
                  <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1">
              <span>Try: <em>"Format for Google SWE"</em> or <em>"Fit onto 1 page"</em></span>
              <span className="text-indigo-500 font-medium">Live Canvas Sync</span>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
