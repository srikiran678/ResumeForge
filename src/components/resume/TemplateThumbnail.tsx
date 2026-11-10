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
  // Height / aspect ratio configs - Authentic 8.5:11 Letter page proportions without height clipping
  const containerClasses = {
    sm: 'w-16 h-20 text-[6px]',
    md: 'w-full aspect-[8.5/11] text-[7.5px]',
    lg: 'w-full aspect-[8.5/11] text-[9.5px]',
  }[size];

  return (
    <div
      className={`relative rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-sm overflow-hidden select-none group transition-all ${containerClasses} ${className}`}
      style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
    >
      {/* Paper Sheen & Top Edge Rule */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 opacity-60" />

      {/* Internal Mini Document: Full Resume Structure (Top to Bottom) */}
      <div className="p-3 h-full flex flex-col justify-between overflow-hidden bg-white text-slate-900 text-left">
        {/* 1. Resume Header */}
        <div className="space-y-1">
          {templateId === 'classic' && (
            <div className="text-center pb-1.5 border-b-2 border-slate-900">
              <div className="font-serif font-black tracking-wider text-[1.2em] uppercase text-slate-950 leading-tight">
                ALEX CHEN
              </div>
              <div className="text-[0.75em] text-slate-600 flex justify-center gap-1">
                <span>San Francisco, CA</span> • <span>alex@berkeley.edu</span> • <span>+1 555-019-2834</span>
              </div>
            </div>
          )}

          {templateId === 'modern' && (
            <div className="text-left pb-1 border-b border-indigo-200 flex justify-between items-start">
              <div>
                <div className="font-sans font-extrabold text-[1.2em] text-slate-950 leading-tight">
                  Alex Chen
                </div>
                <div className="text-[0.75em] text-indigo-700 font-semibold">
                  Software Engineer &amp; Systems Builder
                </div>
                <div className="text-[0.65em] text-slate-500">alex@berkeley.edu • github.com/alexchen</div>
              </div>
              <div className="w-1.5 h-6 rounded-full bg-indigo-600" />
            </div>
          )}

          {templateId === 'compact' && (
            <div className="flex justify-between items-center pb-1 border-b border-slate-300 leading-none">
              <div>
                <span className="font-bold text-[1.15em] text-slate-950">Alex Chen</span>
                <span className="text-[0.7em] text-slate-600 ml-1.5">Full Stack Systems</span>
              </div>
              <div className="text-[0.65em] text-slate-500 font-mono">1-Page High Density ATS</div>
            </div>
          )}

          {templateId === 'academic' && (
            <div className="text-center pb-1 border-b-2 border-slate-900">
              <div className="font-serif font-bold text-[1.15em] tracking-wide text-slate-950">
                ALEX CHEN, B.S.
              </div>
              <div className="text-[0.7em] italic text-slate-600">
                Department of Computer Science • UC Berkeley • alex@berkeley.edu
              </div>
            </div>
          )}

          {templateId === 'hackathon' && (
            <div className="pb-1 border-b border-slate-300 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[1.15em] text-indigo-800">&gt; alex_chen.ts</span>
                <span className="text-[0.65em] px-1 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                  HACKATHON BUILDER
                </span>
              </div>
              <div className="text-[0.65em] text-slate-600">github.com/alexchen • 1st Place CalHacks Winner</div>
            </div>
          )}

          {templateId === 'executive' && (
            <div className="text-center py-1 border-y-2 border-slate-950">
              <div className="font-serif font-black tracking-widest text-[1.25em] uppercase text-slate-950">
                ALEX CHEN
              </div>
              <div className="text-[0.68em] uppercase tracking-wider font-semibold text-slate-600">
                Principal Software Engineer &amp; Systems Architect
              </div>
            </div>
          )}

          {templateId === 'minimal' && (
            <div className="pb-1.5 text-left border-b border-slate-200">
              <div className="font-sans font-light tracking-tight text-[1.3em] text-slate-950 leading-none">
                Alex Chen
              </div>
              <div className="text-[0.68em] text-slate-500 mt-0.5">Software Engineering • Distributed Systems • alex@berkeley.edu</div>
            </div>
          )}

          {templateId === 'creative' && (
            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-left">
              <div className="font-sans font-bold text-[1.15em] text-slate-950">
                Alex Chen
              </div>
              <div className="text-[0.7em] text-indigo-700 font-medium">
                Product &amp; Systems Engineer • Portfolio: alexchen.dev
              </div>
            </div>
          )}

          {templateId === 'elegant' && (
            <div className="text-center pb-1">
              <div className="font-serif font-bold text-[1.2em] tracking-wider text-slate-950">
                ALEX CHEN
              </div>
              <div className="text-[0.68em] text-slate-600 font-serif flex items-center justify-center gap-1">
                <span>NEW YORK</span> <span>◆</span> <span>SAN FRANCISCO</span> <span>◆</span> <span>LONDON</span>
              </div>
              <div className="w-12 h-px bg-slate-300 mx-auto mt-0.5" />
            </div>
          )}

          {templateId === 'technical' && (
            <div className="pb-1 border-b border-emerald-400 text-left">
              <div className="flex justify-between items-center">
                <span className="font-sans font-bold text-[1.15em] text-slate-950">Alex Chen</span>
                <span className="text-[0.65em] font-mono px-1 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  AWS Certified Architect
                </span>
              </div>
              <div className="text-[0.68em] text-slate-600 font-mono">Cloud Architecture &amp; Distributed Systems • Go / TS</div>
            </div>
          )}

          {templateId === 'classic-resume' && (
            <div className="text-center pb-1 border-b-2 border-slate-900">
              <div className="font-serif font-bold text-[1.1em] tracking-wide uppercase text-slate-950">
                RESUME
              </div>
              <div className="font-bold text-[0.9em] text-slate-900">Alex Chen</div>
              <div className="text-[0.65em] text-slate-600">alex@berkeley.edu • +1 555-019-2834 • San Francisco, CA</div>
            </div>
          )}

          {templateId === 'jakes-resume' && (
            <div className="text-center pb-1 border-b border-black font-serif">
              <div className="font-bold text-[1.15em] tracking-tight uppercase text-black">
                ALEX CHEN
              </div>
              <div className="text-[0.62em] text-neutral-800">
                alex@berkeley.edu | +1 555-019-2834 | github.com/alexchen | San Francisco, CA
              </div>
            </div>
          )}

          {templateId === 'google-swe' && (
            <div className="text-left pb-1 border-b-2 border-blue-600 font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[1.2em] text-slate-950">Alex Chen</span>
                <span className="text-[0.6em] font-mono text-blue-700">Google SWE ATS</span>
              </div>
              <div className="text-[0.65em] text-slate-600 font-mono">alex@berkeley.edu • github.com/alexchen • Systems & Cloud</div>
            </div>
          )}

          {templateId === 'harvard-classic' && (
            <div className="text-center pb-1 border-b border-neutral-900 font-serif">
              <div className="font-bold text-[1.15em] tracking-wider uppercase text-neutral-950">
                ALEX CHEN
              </div>
              <div className="text-[0.62em] text-neutral-700 italic">
                Cambridge, MA • alex@harvard.edu • (555) 019-2834
              </div>
            </div>
          )}

          {templateId === 'wall-street' && (
            <div className="text-center pb-1 border-b-2 border-black font-serif">
              <div className="font-bold text-[1.1em] tracking-wider uppercase text-black">
                ALEX CHEN
              </div>
              <div className="text-[0.6em] text-black">
                New York, NY | +1 555-019-2834 | alex@berkeley.edu | linkedin.com/in/alexchen
              </div>
            </div>
          )}

          {templateId === 'mckinsey-consulting' && (
            <div className="text-left pb-1 border-b-2 border-slate-900 font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[1.2em] text-slate-950">Alex Chen</span>
                <span className="text-[0.6em] font-bold text-slate-700 uppercase tracking-widest">Strategy</span>
              </div>
              <div className="text-[0.65em] text-slate-600">San Francisco, CA • alex@berkeley.edu • Product &amp; Strategy</div>
            </div>
          )}

          {templateId === 'stanford-swe' && (
            <div className="text-left pb-1 border-b-2 border-[#8c1515] font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[1.2em] text-slate-950 uppercase">Alex Chen</span>
                <span className="text-[0.6em] font-mono font-bold text-[#8c1515]">YC S24 / FOUNDER</span>
              </div>
              <div className="text-[0.65em] text-slate-600 font-mono">Palo Alto, CA • alex@stanford.edu • ARR $1.2M</div>
            </div>
          )}

          {templateId === 'amazon-bar-raiser' && (
            <div className="text-left pb-1 border-b-2 border-slate-900 font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[1.2em] text-slate-950">Alex Chen</span>
                <span className="text-[0.6em] font-bold text-[#e67a00]">BAR RAISER / SDE III</span>
              </div>
              <div className="text-[0.65em] text-slate-600">Seattle, WA | alex@berkeley.edu | AWS Architecture</div>
            </div>
          )}

          {templateId === 'apple-design-systems' && (
            <div className="text-left pb-1 border-b border-neutral-300 font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[1.2em] text-[#1d1d1f]">Alex Chen</span>
                <span className="text-[0.6em] text-neutral-400 font-medium tracking-wide">CUPERTINO</span>
              </div>
              <div className="text-[0.65em] text-neutral-500">San Francisco, CA · alex@berkeley.edu · Design Technologist</div>
            </div>
          )}

          {templateId === 'mit-research' && (
            <div className="text-center pb-1 border-b-2 border-slate-900 font-serif">
              <div className="font-bold text-[1.15em] tracking-wide text-slate-950 uppercase">ALEX CHEN</div>
              <div className="text-[0.62em] text-[#750014] font-sans font-semibold">CSAIL &amp; AI LAB · NEURIPS/ICLR</div>
              <div className="text-[0.6em] text-slate-600 font-mono">Cambridge, MA • alex@csail.mit.edu</div>
            </div>
          )}

          {templateId === 'meta-production' && (
            <div className="text-left pb-1 border-b-2 border-[#0064e0] font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[1.2em] text-slate-950">Alex Chen</span>
                <span className="text-[0.6em] font-mono font-bold text-[#0064e0]">E6 / INFRA</span>
              </div>
              <div className="text-[0.65em] text-slate-600 font-mono">Menlo Park, CA • alex@berkeley.edu • 3B+ DAU Systems</div>
            </div>
          )}

          {templateId === 'netflix-senior' && (
            <div className="text-left pb-1 border-b-2 border-[#e50914] font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[1.2em] text-slate-950 uppercase">Alex Chen</span>
                <span className="text-[0.6em] font-mono font-bold text-[#e50914]">STAFF SWE</span>
              </div>
              <div className="text-[0.65em] text-slate-600 font-mono">Los Gatos, CA | Context Not Control | Resiliency</div>
            </div>
          )}

          {templateId === 'frontier-ai-agent' && (
            <div className="text-left pb-1 border-b-2 border-[#10a37f] font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[1.2em] text-slate-950">Alex Chen</span>
                <span className="text-[0.6em] font-mono font-bold text-[#10a37f]">MCP &amp; AGENTS</span>
              </div>
              <div className="text-[0.65em] text-slate-600 font-mono">San Francisco, CA • alex@berkeley.edu • LangGraph</div>
            </div>
          )}

          {templateId === 'stripe-developer' && (
            <div className="text-left pb-1 border-b-2 border-[#635bff] font-sans">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[1.2em] text-slate-950">Alex Chen</span>
                <span className="text-[0.6em] font-mono font-bold text-[#635bff]">PAYMENTS / 99.999%</span>
              </div>
              <div className="text-[0.65em] text-slate-600 font-mono">San Francisco, CA • alex@berkeley.edu • API Design</div>
            </div>
          )}
        </div>

        {/* 2. Document Sections (Whole Resume Layout) */}
        <div className="space-y-1 flex-1 pt-1 overflow-hidden">
          {/* Summary / Objective */}
          <div className="space-y-0.5">
            <div className="text-[0.72em] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.2">
              Career Objective &amp; Summary
            </div>
            <div className="text-[0.62em] text-slate-600 line-clamp-1 leading-tight">
              Curious software engineer with strong background in distributed systems, modern web architecture, and clean APIs.
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-0.5">
            <div className="text-[0.72em] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.2">
              Education
            </div>

            {templateId === 'classic-resume' ? (
              // 5-Column Table
              <div className="w-full border border-slate-300 rounded text-[0.6em] overflow-hidden my-0.5 bg-white">
                <div className="grid grid-cols-5 bg-slate-100 font-bold p-0.5 text-center border-b border-slate-300 text-slate-900">
                  <span>Degree</span>
                  <span>College</span>
                  <span>Board</span>
                  <span>Year</span>
                  <span>Score</span>
                </div>
                <div className="grid grid-cols-5 p-0.5 text-center text-slate-700 bg-white">
                  <span>B.S. CS</span>
                  <span>UC Berkeley</span>
                  <span>Univ</span>
                  <span>2026</span>
                  <span>3.92</span>
                </div>
              </div>
            ) : (
              <div className="text-[0.65em] flex justify-between font-semibold text-slate-900 leading-tight">
                <span>UC Berkeley — B.S. in Computer Science</span>
                <span className="text-slate-500 font-normal">GPA 3.92 • 2026</span>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="space-y-0.5">
            <div className="text-[0.72em] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.2">
              Experience
            </div>
            <div className="text-[0.65em] text-slate-700 leading-tight">
              <div className="flex justify-between font-semibold text-slate-950">
                <span>Stripe • Software Engineering Intern</span>
                <span className="text-slate-500 font-normal">Summer 2025</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 text-[0.95em]">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                <span className="truncate">Architected idempotent webhook retry queue reducing latency by 38%</span>
              </div>
            </div>
          </div>

          {/* Flagship Projects Section */}
          <div className="space-y-0.5">
            <div className="text-[0.72em] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.2">
              Key Projects
            </div>
            <div className="text-[0.65em] text-slate-700 leading-tight">
              <div className="flex justify-between font-semibold text-slate-950">
                <span>CloudMesh KV Engine</span>
                <span className="text-indigo-700 font-normal">[Go, Raft, Docker]</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 text-[0.95em]">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                <span className="truncate">48k writes/sec across 5-node cluster with zero data loss</span>
              </div>
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="space-y-0.5">
            <div className="text-[0.72em] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.2">
              Technical Skills &amp; Competencies
            </div>
            <div className="text-[0.62em] text-slate-700 leading-tight truncate">
              <strong>Languages &amp; DB:</strong> TypeScript, Go, Python, PostgreSQL, Redis, SQL
            </div>
            <div className="text-[0.62em] text-slate-700 leading-tight truncate">
              <strong>Frameworks &amp; Tools:</strong> React, Node.js, Next.js, Docker, Kubernetes, AWS
            </div>
          </div>

          {/* Certifications & Extracurricular / Declaration */}
          <div className="space-y-0.5">
            <div className="text-[0.72em] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.2">
              {templateId === 'classic-resume' ? 'Declaration' : 'Certifications & Honors'}
            </div>
            {templateId === 'classic-resume' ? (
              <div className="text-[0.58em] text-slate-500 italic leading-none truncate">
                I hereby declare that the information provided is true and correct to the best of my knowledge.
              </div>
            ) : (
              <div className="text-[0.62em] text-slate-700 flex justify-between leading-none">
                <span>AWS Certified Solutions Architect</span>
                <span className="text-slate-500">CalHacks 1st Place</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Document Footer & ATS Verification Bar */}
        <div className="pt-1 border-t border-slate-200 flex justify-between items-center text-[0.65em] text-slate-500 font-mono">
          <span>ATS 1-Col Standard</span>
          <span className="text-emerald-700 font-bold">100% Readable</span>
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
            className="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center space-x-1.5 border border-slate-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Whole Resume</span>
          </button>
        </div>
      )}
    </div>
  );
};
