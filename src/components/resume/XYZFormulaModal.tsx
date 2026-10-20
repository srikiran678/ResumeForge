import React, { useState } from 'react';
import { Sparkles, X, Check, ArrowRight, Zap, Target } from 'lucide-react';
import { MasterProfile } from '../../types';

interface XYZFormulaModalProps {
  isOpen: boolean;
  onApply: (bullet: string) => void;
  onClose: () => void;
  masterProfile?: MasterProfile;
  initialBullet?: string;
}

export const XYZFormulaModal: React.FC<XYZFormulaModalProps> = ({
  isOpen,
  onApply,
  onClose,
  masterProfile,
  initialBullet = '',
}) => {
  const [accomplishedX, setAccomplishedX] = useState(
    initialBullet ? initialBullet.replace(/^[A-Z][a-z]+ed\s+/i, '').replace(/\.$/, '') : 'an asynchronous telemetry ingestion microservice'
  );
  const [measuredY, setMeasuredY] = useState('reducing processing latency by 32% across 10,000 req/sec');
  const [byDoingZ, setByDoingZ] = useState(
    `utilizing ${masterProfile?.skills?.languages?.[0] || 'Go'} concurrency patterns and PostgreSQL indexing`
  );
  const [selectedVerb, setSelectedVerb] = useState('Engineered');

  if (!isOpen) return null;

  const VERBS = ['Engineered', 'Architected', 'Spearheaded', 'Optimized', 'Streamlined', 'Implemented'];

  const compiledBullet = `${selectedVerb} ${accomplishedX.trim()}, as measured by ${measuredY.trim()}, by ${byDoingZ.trim().replace(/^by\s+/i, '')}.`;

  const handleApply = () => {
    onApply(compiledBullet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-[#121316] rounded-2xl shadow-2xl max-w-xl w-full p-6 text-left border border-slate-200 dark:border-white/[0.08] space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/[0.07]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google XYZ Bullet Formula Generator</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                "Accomplished [X], as measured by [Y], by doing [Z]"
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verb selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            1. Power Action Verb
          </label>
          <div className="flex flex-wrap gap-1.5">
            {VERBS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectedVerb(v)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedVerb === v
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Input X: Accomplished */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            2. Accomplished [X] (What technical objective did you deliver?)
          </label>
          <input
            type="text"
            value={accomplishedX}
            onChange={(e) => setAccomplishedX(e.target.value)}
            placeholder="e.g. an offline-first OCR label recognition pipeline"
            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-slate-50 dark:bg-[#08090a] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#08090a] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Input Y: Measured by */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            3. Measured by [Y] (Quantifiable latency, throughput, scale, or accuracy)
          </label>
          <input
            type="text"
            value={measuredY}
            onChange={(e) => setMeasuredY(e.target.value)}
            placeholder="e.g. cutting query response times by 40% for 600+ campus users"
            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-slate-50 dark:bg-[#08090a] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#08090a] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Input Z: By doing */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            4. By Doing [Z] (Verifiable tools, libraries, or architecture from your profile)
          </label>
          <input
            type="text"
            value={byDoingZ}
            onChange={(e) => setByDoingZ(e.target.value)}
            placeholder="e.g. deploying containerized FastAPI microservices on AWS with CI/CD"
            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-slate-50 dark:bg-[#08090a] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#08090a] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Live Compiled Result */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
            Generated Google XYZ Bullet:
          </span>
          <p className="text-xs text-emerald-950 dark:text-emerald-200 font-semibold leading-relaxed">
            • {compiledBullet}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-white/[0.07]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply to Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
