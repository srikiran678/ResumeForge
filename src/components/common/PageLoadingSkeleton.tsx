import React from 'react';

export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header bar placeholder */}
      <div className="h-16 border-b border-slate-200/80 dark:border-white/[0.08] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="size-9 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="size-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="size-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Main content structural skeleton */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-72 rounded-md bg-slate-200/70 dark:bg-slate-850 animate-pulse" />
          </div>
          <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Grid cards placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c101b] space-y-3 shadow-layer-sm"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="size-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
              <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-3 w-32 rounded bg-slate-200/70 dark:bg-slate-850 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Large section placeholder */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c101b] space-y-4 shadow-layer-sm">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="space-y-2.5">
            <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
            <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
            <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
