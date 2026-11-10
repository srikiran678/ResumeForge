import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Sliders,
  Palette,
  FileType,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  template: string;
  font: string;
  accent: string;
  accentHex: string;
  density: string;
  actionSummary: string;
}

const DEMO_PROMPTS: QuickPrompt[] = [
  {
    id: 'fit-one-page',
    label: 'Fit to 1 page',
    prompt: 'Make my resume fit cleanly on 1 page without cutting text',
    template: 'classic',
    font: 'Inter Sans',
    accent: 'text-indigo-600 dark:text-indigo-400',
    accentHex: '#4f46e5',
    density: 'Tight 0.85x Line Spacing',
    actionSummary: 'Applied single-page auto-fit: line height -12%, margins 0.5", section gap 8px'
  },
  {
    id: 'google-ats',
    label: 'Google SWE Standard',
    prompt: 'Format for Google SWE ATS with Google Blue accents and XYZ impact bullets',
    template: 'google-swe',
    font: 'Roboto Mono & Sans',
    accent: 'text-blue-600 dark:text-blue-400',
    accentHex: '#1a73e8',
    density: 'Clean Technical 1.0x',
    actionSummary: 'Switched to Google SWE template, added Google Blue (#1a73e8) accents and monospaced tech tags'
  },
  {
    id: 'harvard-serif',
    label: 'Harvard Classic Serif',
    prompt: 'Switch to Harvard classic formal serif with crimson accents for research',
    template: 'harvard-classic',
    font: 'Times New Roman Serif',
    accent: 'text-rose-600 dark:text-rose-400',
    accentHex: '#a51c30',
    density: 'Scholarly 1.1x',
    actionSummary: 'Switched to Harvard Classic template, enabled centered formal serif headers and Crimson palette'
  },
  {
    id: 'wall-street',
    label: 'Wall Street Finance',
    prompt: 'Ultra-tight finance layout for Goldman Sachs investment banking',
    template: 'wall-street',
    font: 'Georgia Serif',
    accent: 'text-emerald-700 dark:text-emerald-400',
    accentHex: '#047857',
    density: 'Hyper-Dense 0.5" Margins',
    actionSummary: 'Applied Wall Street layout: removed casual summary, set 0.5" bounds, highlighted deal metrics'
  },
  {
    id: 'jakes-latex',
    label: "Jake's LaTeX Minimal",
    prompt: "Switch to Jake's resume LaTeX format with horizontal hairline dividers",
    template: 'jakes-resume',
    font: 'Computer Modern Serif',
    accent: 'text-neutral-900 dark:text-neutral-200',
    accentHex: '#171717',
    density: 'LaTeX High Density',
    actionSummary: "Switched to Jake's Resume format, aligned dates to baseline margin, added horizontal dividers"
  }
];

export const AIDesignerShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activePrompt, setActivePrompt] = useState<QuickPrompt>(DEMO_PROMPTS[1]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mutationCount, setMutationCount] = useState<number>(1);

  const handleSelectPrompt = (prompt: QuickPrompt) => {
    setIsProcessing(true);
    setTimeout(() => {
      setActivePrompt(prompt);
      setInputValue('');
      setMutationCount(prev => prev + 1);
      setIsProcessing(false);
    }, 280);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const match = DEMO_PROMPTS.find(p => 
        inputValue.toLowerCase().includes(p.label.toLowerCase()) || 
        inputValue.toLowerCase().includes(p.template)
      ) || DEMO_PROMPTS[0];

      setActivePrompt({
        ...match,
        prompt: inputValue,
        actionSummary: `Applied custom transformation for "${inputValue}": layout calibrated to ${match.template} in 1.4ms`
      });
      setMutationCount(prev => prev + 1);
      setIsProcessing(false);
    }, 320);
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-widest mb-3">
            <Wand2 className="w-4 h-4 text-primary animate-pulse" />
            <span>Interactive Live AI Resume Designer</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Design &amp; Restyle Live by Natural Language Prompt
          </h2>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Type what you want or click quick chips. Our hybrid deterministic intent router executes layout transformations, color accents, and 1-page autofit in milliseconds with <strong className="text-on-surface">zero API token cost</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-xs font-semibold text-tertiary">
            <Zap className="w-3.5 h-3.5" />
            <span>0-Quota Execution • Unlimited Edits</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Demo Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Interactive Control Terminal (5 cols) */}
        <div className="lg:col-span-5 p-7 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-xs text-on-surface-variant font-semibold">
                  ai-designer-dock.sh
                </span>
              </div>
              <span className="font-mono text-[11px] text-tertiary font-medium">
                Engine Active • v3.0
              </span>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-on-surface-variant block mb-2 uppercase tracking-wider">
                Instant Styling Actions
              </label>
              <div className="flex flex-wrap gap-2">
                {DEMO_PROMPTS.map((prompt) => {
                  const isCurrent = prompt.id === activePrompt.id;
                  return (
                    <button
                      key={prompt.id}
                      onClick={() => handleSelectPrompt(prompt)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium border ${
                        isCurrent
                          ? 'bg-primary text-on-primary border-primary shadow-sm'
                          : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary/50 hover:text-on-surface'
                      }`}
                    >
                      {prompt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Prompt Form */}
            <form onSubmit={handleCustomSubmit} className="relative mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. Fit to 1 page, Harvard serif, Google Blue..."
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-primary text-on-primary hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
                title="Execute AI Design Intent"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Live Intent Diagnostic Telemetry */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" /> Active Mutation
                </span>
                <span className="font-mono font-semibold text-primary">#{mutationCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <FileType className="w-3.5 h-3.5 text-secondary" /> Font Engine
                </span>
                <span className="font-mono text-on-surface">{activePrompt.font}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" style={{ color: activePrompt.accentHex }} /> Accent Token
                </span>
                <span className="font-mono font-semibold" style={{ color: activePrompt.accentHex }}>
                  {activePrompt.accentHex}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-tertiary" /> Layout Density
                </span>
                <span className="font-mono text-on-surface">{activePrompt.density}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Editor</span>
            </button>
            <span className="text-[11px] text-on-surface-variant">Instant Revert / Undo Ready</span>
          </div>
        </div>

        {/* Right Live Reactive Canvas Preview (7 cols) */}
        <div className={`lg:col-span-7 p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${isProcessing ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}`}>
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-surface-container-high text-[11px] font-mono text-on-surface-variant border-b border-l border-outline-variant/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span>Reactive State: {activePrompt.template}</span>
          </div>

          <div>
            {/* Action Feedback Banner */}
            <div className="mb-5 p-3 rounded-xl bg-primary/10 border border-primary/25 flex items-center gap-2.5 text-xs text-primary">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="font-mono">{activePrompt.actionSummary}</span>
            </div>

            {/* Dynamic Resume Preview */}
            <div className={`p-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest transition-all ${
              activePrompt.template === 'jakes-resume' || activePrompt.template === 'harvard-classic' || activePrompt.template === 'wall-street'
                ? 'font-serif'
                : 'font-sans'
            }`}>
              {/* Header */}
              <div className={`pb-3 mb-4 border-b ${
                activePrompt.template === 'jakes-resume' || activePrompt.template === 'wall-street' || activePrompt.template === 'harvard-classic'
                  ? 'border-neutral-900 text-center'
                  : 'border-outline-variant text-left'
              }`}>
                <h3 className="text-xl font-bold tracking-tight text-on-surface uppercase">
                  JORDAN R. TAYLOR
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  San Francisco, CA • jordan.taylor@example.com • +1 (555) 234-5678 • github.com/jtaylor
                </p>
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <div 
                  className="text-xs font-bold uppercase tracking-wider border-b pb-1"
                  style={{ color: activePrompt.accentHex, borderColor: activePrompt.accentHex }}
                >
                  Experience
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-semibold text-on-surface">
                    <span>Stripe • Staff Infrastructure Engineer</span>
                    <span className="text-on-surface-variant font-normal">2022 — PRESENT</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-on-surface-variant">
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-0.5 font-bold" style={{ color: activePrompt.accentHex }}>•</span>
                      <span>
                        Architected distributed consensus engine handling 450,000 requests/sec with p99 latency &lt; 9ms.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-0.5 font-bold" style={{ color: activePrompt.accentHex }}>•</span>
                      <span>
                        Reduced Kubernetes infrastructure OPEX by $2.4M annually via predictive resource autoscaling.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Education */}
              <div className="mt-4 space-y-2">
                <div 
                  className="text-xs font-bold uppercase tracking-wider border-b pb-1"
                  style={{ color: activePrompt.accentHex, borderColor: activePrompt.accentHex }}
                >
                  Education
                </div>
                <div className="flex justify-between items-baseline text-xs text-on-surface font-semibold">
                  <span>University of California, Berkeley — B.S. in Computer Science</span>
                  <span className="text-on-surface-variant font-normal">GPA 3.94 • 2022</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="mt-6 pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-2">
            <span className="font-mono text-[11px] text-tertiary flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Sub-2ms Deterministic Dispatch
            </span>
            <span className="font-mono text-[11px] text-outline">
              Undo/Redo Stack Synced
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
