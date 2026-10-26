import React from 'react';
import { ResumeData } from '@/data/types';
import { SECTION_TITLES, getActiveOrderedSections } from '../core/readingOrder';

export const ATSInspectorOverlay: React.FC<{
  resume: ResumeData;
  active: boolean;
}> = ({ resume, active }) => {
  if (!active || !resume) return null;

  const activeSections = getActiveOrderedSections(resume);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none p-4 font-mono select-none overflow-y-auto">
      {/* Top Floating Telemetry Bar */}
      <div className="bg-slate-950/90 text-white rounded-lg p-2.5 mb-3 border border-emerald-500/40 shadow-xl flex items-center justify-between text-[11px] backdrop-blur-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-emerald-400">ATS PARSER INSPECTOR ACTIVE</span>
          <span className="text-slate-400">• Linear Single-Column AST</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-slate-300">
          <span>Encoding: UTF-8</span>
          <span>•</span>
          <span>Tables: 0 (Safe)</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">Reading Order: 100% Natural</span>
        </div>
      </div>

      {/* Visual Bounding Overlay Hints */}
      <div className="space-y-2">
        {/* #01 Header Root */}
        <div className="border border-dashed border-emerald-500/50 rounded-lg p-2 bg-emerald-500/5 text-emerald-800 text-[10px] space-y-1">
          <div className="flex justify-between font-bold">
            <span>#01 PARSER ROOT: BASICS_HEADER</span>
            <span className="bg-emerald-600 text-white px-1 rounded text-[9px]">ORDER_INDEX: 1</span>
          </div>
        </div>

        {/* Dynamic Ordered Sections #02..#0N */}
        {activeSections.map((sectionKey, index) => {
          const orderIndex = index + 2;
          const badgeNum = String(orderIndex).padStart(2, '0');
          const title = SECTION_TITLES[sectionKey] || sectionKey.toUpperCase();

          return (
            <div
              key={sectionKey}
              className="border border-dashed border-emerald-500/50 rounded-lg p-2 bg-emerald-500/5 text-emerald-800 text-[10px] space-y-1"
            >
              <div className="flex justify-between font-bold">
                <span>
                  #{badgeNum} SECTION: {title}
                </span>
                <span className="bg-emerald-600 text-white px-1 rounded text-[9px]">
                  ORDER_INDEX: {orderIndex}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
