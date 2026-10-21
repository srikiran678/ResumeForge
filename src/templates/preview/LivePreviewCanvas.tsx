import React from 'react';
import { ResumeData } from '../../data/types';
import { ResumeDocument } from './ResumeDocument';

export interface LivePreviewCanvasProps {
  resume: ResumeData;
  scale?: number;
  overlay?: React.ReactNode;
  className?: string;
}

export const LivePreviewCanvas: React.FC<LivePreviewCanvasProps> = ({
  resume,
  scale = 1,
  overlay,
  className = "relative flex justify-center items-start min-h-full py-8 px-4"
}) => {
  return (
    <div className={className}>
      <div className="relative w-full max-w-[850px]">
        <ResumeDocument resume={resume} scale={scale} />
        {overlay && (
          <div className="absolute inset-0 pointer-events-none">
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
};
