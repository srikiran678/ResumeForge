import React from 'react';
import { X, ShieldCheck, Download } from 'lucide-react';
import { JobApplication } from '../../types';
import { ResumeDocument } from '../resume/ResumeDocument';
import { downloadResumePDF } from '../resume/ResumePDF';

interface SnapshotViewerProps {
  application: JobApplication;
  isOpen: boolean;
  onClose: () => void;
}

export const SnapshotViewer: React.FC<SnapshotViewerProps> = ({ application, isOpen, onClose }) => {
  if (!isOpen) return null;

  const snapshot = application.resumeSnapshot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 text-left border border-forge-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forge-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-forge-900">
                  Immutable Submission Snapshot — {application.company}
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  Submitted Version v{application.resumeVersion || '1.0'}
                </span>
              </div>
              <p className="text-[11px] text-forge-500">
                Preserved automatically on {application.applicationDate || 'Application Date'}. Any subsequent resume edits do not alter this historical record.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {snapshot && (
              <button
                onClick={() => downloadResumePDF(snapshot)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Snapshot PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-forge-400 hover:text-forge-700 hover:bg-forge-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 bg-forge-100/60 rounded-lg my-3 border border-forge-200">
          {snapshot ? (
            <div className="max-w-[750px] mx-auto shadow-md">
              <ResumeDocument resume={snapshot} scale={1} />
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-forge-500">
              No snapshot recorded for this application yet. Snapshots are created automatically when application status moves to "Applied".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
