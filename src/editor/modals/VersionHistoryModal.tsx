import React, { useState } from 'react';
import { History, RotateCcw, Plus, X, Calendar, FileText, Check } from 'lucide-react';
import { ResumeData, ResumeVersion } from '../../types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  resume: ResumeData;
  versions: ResumeVersion[];
  onCreateVersion: (name?: string, note?: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onClose: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  resume,
  versions,
  onCreateVersion,
  onRestoreVersion,
  onClose,
}) => {
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionNote, setNewVersionNote] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateVersion(newVersionName || undefined, newVersionNote || undefined);
    setNewVersionName('');
    setNewVersionNote('');
    setShowCreateForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 text-left border border-forge-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forge-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-forge-100 flex items-center justify-center text-forge-800">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-forge-900">Resume Version History</h2>
              <p className="text-[11px] text-forge-500">
                Current active version: <strong>v{resume.meta.version}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-forge-400 hover:text-forge-700 hover:bg-forge-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="py-3 flex justify-between items-center">
          <p className="text-xs text-forge-600">
            Keep snapshots before applying major job tailoring or structural changes.
          </p>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Snapshot</span>
          </button>
        </div>

        {/* Snapshot creation form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="bg-forge-50 p-3 rounded-lg border border-forge-200 mb-3 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Snapshot Name (e.g. Pre-Stripe Tailoring)"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                className="text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={newVersionNote}
                onChange={(e) => setNewVersionNote(e.target.value)}
                className="text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-2.5 py-1 text-xs text-forge-600 hover:bg-forge-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-forge-900 text-white rounded font-medium"
              >
                Save Version
              </button>
            </div>
          </form>
        )}

        {/* Versions list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {versions.length === 0 ? (
            <div className="py-12 text-center text-forge-400 text-xs">
              No historical versions saved yet for this resume. Click "Create Snapshot" to save one.
            </div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver.id}
                className="p-3 rounded-lg border border-forge-200 bg-white hover:border-forge-300 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-forge-900">{ver.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-forge-100 text-forge-700 font-mono">
                      v{ver.versionNumber}
                    </span>
                  </div>
                  {ver.note && <p className="text-[11px] text-forge-600">{ver.note}</p>}
                  <div className="flex items-center space-x-3 text-[10px] text-forge-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(ver.createdAt).toLocaleString()}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Template: {ver.data.meta.template}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (confirm(`Restore ${ver.name}? Your current unsaved edits will be replaced.`)) {
                        onRestoreVersion(ver.id);
                        onClose();
                      }
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-forge-700 bg-forge-100 hover:bg-forge-200 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
