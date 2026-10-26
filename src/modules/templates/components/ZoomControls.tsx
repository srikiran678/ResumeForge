import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

export interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitWidth?: () => void;
  minScale?: number;
  maxScale?: number;
  currentPage?: number;
  totalPages?: number;
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitWidth,
  minScale = 0.5,
  maxScale = 1.5,
  currentPage = 1,
  totalPages = 1,
  className = '',
}) => {
  const percentage = Math.round(scale * 100);

  return (
    <div
      className={`inline-flex items-center space-x-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-forge-200 dark:border-white/[0.08] rounded-xl px-2.5 py-1.5 shadow-sm text-xs select-none ${className}`}
      aria-label="Preview canvas zoom and pagination controls"
    >
      <button
        type="button"
        onClick={onZoomOut}
        disabled={scale <= minScale}
        className="p-1 rounded-lg text-forge-600 dark:text-slate-300 hover:bg-forge-100 dark:hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onResetZoom}
        className="px-2 py-0.5 rounded-md font-mono font-semibold text-forge-800 dark:text-slate-100 hover:bg-forge-100 dark:hover:bg-white/[0.08] transition-colors"
        title="Reset Zoom (100%)"
        aria-label="Reset Zoom"
      >
        {percentage}%
      </button>

      <button
        type="button"
        onClick={onZoomIn}
        disabled={scale >= maxScale}
        className="p-1 rounded-lg text-forge-600 dark:text-slate-300 hover:bg-forge-100 dark:hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      {onFitWidth && (
        <button
          type="button"
          onClick={onFitWidth}
          className="p-1 rounded-lg text-forge-600 dark:text-slate-300 hover:bg-forge-100 dark:hover:bg-white/[0.08] transition-colors"
          title="Fit to Width"
          aria-label="Fit to Width"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={onResetZoom}
        className="p-1 rounded-lg text-forge-600 dark:text-slate-300 hover:bg-forge-100 dark:hover:bg-white/[0.08] transition-colors"
        title="Reset"
        aria-label="Reset"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {totalPages > 1 && (
        <div className="pl-2 border-l border-forge-200 dark:border-white/[0.08] text-forge-500 dark:text-slate-400 font-mono text-[11px]">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};
