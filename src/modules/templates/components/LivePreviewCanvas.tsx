import React from 'react';
import { ResumeData } from '@/data/types';
import { ResumeDocument } from './ResumeDocument';
import { ZoomControls } from './ZoomControls';

export interface LivePreviewCanvasProps {
  resume: ResumeData;
  scale?: number;
  overlay?: React.ReactNode;
  showControls?: boolean;
  onScaleChange?: (newScale: number) => void;
  className?: string;
}

export const LivePreviewCanvas: React.FC<LivePreviewCanvasProps> = ({
  resume,
  scale = 1,
  overlay,
  showControls = false,
  onScaleChange,
  className = "relative flex flex-col items-center justify-start min-h-full py-8 px-4"
}) => {
  const [internalScale, setInternalScale] = React.useState<number>(scale);

  React.useEffect(() => {
    setInternalScale(scale);
  }, [scale]);

  const updateScale = (val: number | ((prev: number) => number)) => {
    const next = typeof val === 'function' ? val(internalScale) : val;
    const clamped = Math.min(1.5, Math.max(0.5, Math.round(next * 100) / 100));
    setInternalScale(clamped);
    if (onScaleChange) onScaleChange(clamped);
  };

  return (
    <div className={className}>
      {showControls && (
        <div className="mb-4 sticky top-2 z-20">
          <ZoomControls
            scale={internalScale}
            onZoomIn={() => updateScale((s) => s + 0.1)}
            onZoomOut={() => updateScale((s) => s - 0.1)}
            onResetZoom={() => updateScale(1)}
            onFitWidth={() => updateScale(0.9)}
          />
        </div>
      )}

      <div className="relative w-full max-w-[850px] transition-transform duration-150">
        <ResumeDocument resume={resume} scale={internalScale} />
        {overlay && (
          <div className="absolute inset-0 pointer-events-none">
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
};
