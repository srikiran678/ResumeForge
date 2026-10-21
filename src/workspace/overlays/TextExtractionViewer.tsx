import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { ResumeData } from '../../data/types';
import { generateRawTextStream } from '../ats/textExtractor';

interface TextExtractionViewerProps {
  resume: ResumeData;
}

export const TextExtractionViewer: React.FC<TextExtractionViewerProps> = ({ resume }) => {
  const [copied, setCopied] = useState(false);
  const rawText = generateRawTextStream(resume);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-forge-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-forge-100 gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-forge-800" />
            <h3 className="text-sm font-bold text-forge-900">ATS Raw Text Extraction Stream</h3>
          </div>
          <p className="text-xs text-forge-500 mt-0.5">
            This is the exact linear reading order parsed by ATS robots and screen readers.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm transition-colors self-start sm:self-auto shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied for Notepad!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy for Notepad Test</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={rawText}
          rows={14}
          className="w-full font-mono text-[11px] leading-relaxed p-3 bg-forge-950 text-emerald-400 rounded-lg border border-forge-800 focus:outline-none select-all overflow-y-auto"
        />
        <div className="mt-2 text-[11px] text-forge-500 flex items-center justify-between">
          <span>
            Length: <strong>{rawText.split(/\s+/).filter(Boolean).length} words</strong> | Lines:{' '}
            <strong>{rawText.split('\n').length}</strong>
          </span>
          <span className="italic">100% Selectable real text</span>
        </div>
      </div>
    </div>
  );
};
