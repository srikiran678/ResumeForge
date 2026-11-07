import React from 'react';
import { Eye } from 'lucide-react';
import { TemplateId } from '@/data/types';

interface TemplateThumbnailProps {
  templateId: TemplateId;
  size?: 'sm' | 'md' | 'lg';
  onPreviewClick?: () => void;
  className?: string;
  showOverlayButton?: boolean;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  size = 'md',
  onPreviewClick,
  className = '',
  showOverlayButton = true,
}) => {
  // Height / aspect ratio configs
  const containerClasses = {
    sm: 'w-16 h-20 text-[6px]',
    md: 'w-full aspect-[8.5/11] max-h-56 text-[8px]',
    lg: 'w-full aspect-[8.5/11] max-h-96 text-[10px]',
  }[size];

  return (
    <div
      className={`relative rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#121316] text-slate-800 dark:text-slate-200 shadow-xs overflow-hidden select-none group transition-all ${containerClasses} ${className}`}
    >
      {/* Paper Sheen & Top Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-200 via-indigo-400/40 to-slate-200 dark:from-white/5 dark:via-indigo-500/30 dark:to-white/5 opacity-60" />

      {/* Internal Mini Document Render */}
      <div className="p-3 h-full flex flex-col justify-between overflow-hidden">
        {/* Header Block based on Template Style */}
        <div className="space-y-1">
          {templateId === 'classic' && (
            <div className="text-center pb-1.5 border-b-2 border-slate-900 dark:border-white">
              <div className="font-serif font-black tracking-wider text-[1.15em] uppercase text-slate-900 dark:text-white leading-tight">
                ALEX CHEN
              </div>
              <div className="text-[0.75em] text-slate-500 dark:text-slate-400 flex justify-center gap-1">
                <span>San Francisco</span> • <span>alex@berkeley.edu</span>
              </div>
            </div>
          )}

          {templateId === 'modern' && (
            <div className="text-left pb-1 border-b border-indigo-500/30 flex justify-between items-start">
              <div>
                <div className="font-sans font-extrabold text-[1.15em] text-slate-950 dark:text-white leading-tight">
                  Alex Chen
                </div>
                <div className="text-[0.75em] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Software Engineer
                </div>
              </div>
              <div className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            </div>
          )}

          {templateId === 'compact' && (
            <div className="flex justify-between items-center pb-1 border-b border-slate-300 dark:border-slate-700 leading-none">
              <div>
                <span className="font-bold text-[1.1em] text-slate-900 dark:text-white">Alex Chen</span>
                <span className="text-[0.7em] text-slate-500 ml-1.5">Full Stack</span>
              </div>
              <div className="text-[0.7em] text-slate-400 font-mono">1-Page High Density</div>
            </div>
          )}

          {templateId === 'academic' && (
            <div className="text-center pb-1 border-b-2 border-slate-800 dark:border-slate-200">
              <div className="font-serif font-bold text-[1.1em] tracking-wide text-slate-950 dark:text-white">
                ALEX CHEN, B.S.
              </div>
              <div className="text-[0.7em] italic text-slate-600 dark:text-slate-400">
                Department of Computer Science • UC Berkeley
              </div>
            </div>
          )}

          {templateId === 'hackathon' && (
            <div className="pb-1 border-b border-slate-300 dark:border-slate-700 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[1.1em] text-indigo-600 dark:text-indigo-400">&gt; alex_chen.ts</span>
                <span className="text-[0.65em] px-1 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                  BUILDER
                </span>
              </div>
              <div className="text-[0.7em] text-slate-500">github.com/alexchen • Full Stack</div>
            </div>
          )}

          {templateId === 'executive' && (
            <div className="text-center py-1 border-y-2 border-slate-900 dark:border-slate-100">
              <div className="font-serif font-black tracking-widest text-[1.2em] uppercase text-slate-950 dark:text-white">
                ALEX CHEN
              </div>
              <div className="text-[0.7em] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400">
                Principal Software Engineer &amp; Systems Architect
              </div>
            </div>
          )}

          {templateId === 'minimal' && (
            <div className="pb-1.5 text-left">
              <div className="font-sans font-light tracking-tight text-[1.3em] text-slate-950 dark:text-white leading-none">
                Alex Chen
              </div>
              <div className="text-[0.7em] text-slate-400 mt-0.5">Software Engineering • Distributed Systems</div>
            </div>
          )}

          {templateId === 'creative' && (
            <div className="p-1 rounded-md bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-left">
              <div className="font-sans font-bold text-[1.1em] text-indigo-950 dark:text-indigo-200">
                Alex Chen
              </div>
              <div className="text-[0.7em] text-indigo-600 dark:text-indigo-400 font-medium">
                Product &amp; Systems Engineer
              </div>
            </div>
          )}

          {templateId === 'elegant' && (
            <div className="text-center pb-1">
              <div className="font-serif font-bold text-[1.15em] tracking-wider text-slate-900 dark:text-white">
                ALEX CHEN
              </div>
              <div className="text-[0.7em] text-slate-500 font-serif flex items-center justify-center gap-1">
                <span>NEW YORK</span> <span>◆</span> <span>SAN FRANCISCO</span> <span>◆</span> <span>LONDON</span>
              </div>
              <div className="w-12 h-px bg-slate-400 mx-auto mt-1" />
            </div>
          )}

          {templateId === 'technical' && (
            <div className="pb-1 border-b border-emerald-500/40 text-left">
              <div className="flex justify-between items-center">
                <span className="font-sans font-bold text-[1.1em] text-slate-950 dark:text-white">Alex Chen</span>
                <span className="text-[0.65em] font-mono px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  AWS Certified
                </span>
              </div>
              <div className="text-[0.7em] text-slate-500 font-mono">Cloud Architecture &amp; Distributed Systems</div>
            </div>
          )}

          {templateId === 'classic-resume' && (
            <div className="text-center pb-1 border-b border-slate-900 dark:border-slate-100">
              <div className="font-serif font-bold text-[1.15em] tracking-wide uppercase text-slate-950 dark:text-white">
                RESUME
              </div>
              <div className="font-bold text-[0.85em] text-slate-800 dark:text-slate-200">Alex Chen</div>
              <div className="text-[0.7em] text-slate-500">Contact: +1 (555) 019-2834 • Email: alex@berkeley.edu</div>
            </div>
          )}
        </div>

        {/* Miniature Document Body Blocks */}
        <div className="space-y-1.5 flex-1 pt-1.5">
          {/* Section 1: Education or Experience */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[0.8em] font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/[0.08] pb-0.2 uppercase">
              <span>{templateId === 'academic' || templateId === 'classic-resume' ? 'Education' : 'Experience'}</span>
            </div>

            {templateId === 'classic-resume' ? (
              // 5-Column Miniature Table representation
              <div className="w-full border border-slate-300 dark:border-slate-700 rounded text-[0.65em] overflow-hidden my-0.5">
                <div className="grid grid-cols-5 bg-slate-100 dark:bg-slate-800 font-bold p-0.5 text-center border-b border-slate-300 dark:border-slate-700">
                  <span>Degree</span>
                  <span>College</span>
                  <span>Board</span>
                  <span>Year</span>
                  <span>Score</span>
                </div>
                <div className="grid grid-cols-5 p-0.5 text-center text-slate-600 dark:text-slate-400">
                  <span>B.S. CS</span>
                  <span>UC Berkeley</span>
                  <span>Univ</span>
                  <span>2026</span>
                  <span>3.92</span>
                </div>
              </div>
            ) : (
              <div className="text-[0.7em] text-slate-600 dark:text-slate-300 leading-tight">
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                  <span>Stripe • SWE Intern</span>
                  <span className="text-slate-400 font-normal">2025</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                  <span className="truncate">Architected webhook retry queue reducing latency by 38%</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Projects / Skills */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[0.8em] font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/[0.08] pb-0.2 uppercase">
              <span>{templateId === 'hackathon' ? 'Flagship Projects' : templateId === 'technical' ? 'Technical Competencies' : 'Projects'}</span>
            </div>

            {templateId === 'hackathon' ? (
              <div className="text-[0.7em] space-y-0.5 font-mono">
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>CloudMesh KV Engine</span>
                  <span className="text-[0.85em] text-slate-400">CalHacks #1</span>
                </div>
                <div className="flex gap-1">
                  <span className="px-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[0.9em]">
                    [Go]
                  </span>
                  <span className="px-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[0.9em]">
                    [Raft]
                  </span>
                  <span className="px-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[0.9em]">
                    [Docker]
                  </span>
                </div>
              </div>
            ) : templateId === 'creative' ? (
              <div className="flex flex-wrap gap-0.5 text-[0.65em]">
                {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'].map((s) => (
                  <span
                    key={s}
                    className="px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[0.7em] text-slate-600 dark:text-slate-300 leading-tight">
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                  <span>CloudMesh Distributed Store</span>
                  <span className="text-slate-400 font-normal">Go, Raft</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                  <span className="truncate">48k writes/sec across 5-node cluster</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Technical Skills Matrix */}
          <div className="space-y-0.5 pt-0.5">
            <div className="flex items-center justify-between text-[0.8em] font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/[0.08] pb-0.2 uppercase">
              <span>Skills &amp; Tools</span>
            </div>
            <div className="text-[0.68em] text-slate-600 dark:text-slate-400 leading-tight truncate">
              <strong>Languages:</strong> TypeScript, Go, Python, SQL, C++
            </div>
            <div className="text-[0.68em] text-slate-600 dark:text-slate-400 leading-tight truncate">
              <strong>Frameworks:</strong> React, Node.js, Next.js, Docker
            </div>
          </div>
        </div>

        {/* Footer / ATS Verification Bar */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-white/[0.06] flex justify-between items-center text-[0.7em] text-slate-400 font-mono">
          <span>ATS 1-Col</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Pass</span>
        </div>
      </div>

      {/* Hover / Tap Overlay Action */}
      {showOverlayButton && onPreviewClick && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPreviewClick();
          }}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 cursor-pointer z-10"
        >
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Full Preview</span>
          </button>
        </div>
      )}
    </div>
  );
};
