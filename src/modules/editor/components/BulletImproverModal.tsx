import React, { useState } from 'react';
import { Sparkles, Check, X, Edit3, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AISuggestion } from '@/types';

interface BulletImproverModalProps {
  isOpen: boolean;
  originalBullet: string;
  suggestions: AISuggestion[];
  loading: boolean;
  onAccept: (suggestedText: string) => void;
  onClose: () => void;
}

export const BulletImproverModal: React.FC<BulletImproverModalProps> = ({
  isOpen,
  originalBullet,
  suggestions,
  loading,
  onAccept,
  onClose,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (sug: AISuggestion) => {
    setEditingId(sug.id);
    setEditText(sug.suggested);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onAccept(editText.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 text-left border border-forge-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forge-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-forge-900">Honest Bullet Improver</h2>
              <p className="text-[11px] text-forge-500">Evidence-traced phrasing enhancements (Zero hallucination)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-forge-400 hover:text-forge-700 hover:bg-forge-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original Bullet */}
        <div className="my-3 bg-forge-50 p-3 rounded-lg border border-forge-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-forge-500 mb-1">Original Bullet:</div>
          <p className="text-xs text-forge-900 font-medium">{originalBullet}</p>
        </div>

        {/* Content list / Loading */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-forge-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-forge-600">
                Evaluating against Master Profile evidence & action verbs...
              </p>
            </div>
          ) : (
            suggestions.map((sug) => {
              const isEditing = editingId === sug.id;
              const isSupported = sug.evidenceStatus === 'Supported';
              const isRephrased = sug.evidenceStatus === 'Rephrased';
              const isUnsupported = sug.evidenceStatus === 'Unsupported';

              return (
                <div
                  key={sug.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnsupported
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-forge-200 hover:border-forge-300 shadow-sm'
                  }`}
                >
                  {/* Status badge & Reason */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isSupported
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isRephrased
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isSupported ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Supported by Master Profile</span>
                        </>
                      ) : isRephrased ? (
                        <>
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span>Rephrased Action Verbs</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>Unsupported Claims</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Suggestion text */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-xs p-2.5 border border-forge-300 rounded-md focus:ring-2 focus:ring-forge-900 focus:outline-none"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-forge-600 hover:bg-forge-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 text-xs bg-forge-900 text-white rounded font-medium"
                        >
                          Apply Custom Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-forge-900 font-semibold leading-relaxed mb-2.5">
                      {sug.suggested}
                    </p>
                  )}

                  {/* Why it is better */}
                  <div className="text-[11px] text-forge-600 bg-forge-50/80 p-2.5 rounded-md mb-2 border border-forge-100">
                    <div>
                      <strong className="text-forge-800">Why it's better: </strong>
                      {sug.reason}
                    </div>
                    <div className="mt-1 text-forge-500">
                      <strong className="text-forge-700">Verifiable Evidence: </strong>
                      {sug.evidence}
                    </div>
                  </div>

                  {/* Actions: Accept, Reject, Edit */}
                  {!isEditing && (
                    <div className="flex items-center justify-between pt-1 border-t border-forge-100">
                      <button
                        onClick={() => handleStartEdit(sug)}
                        className="flex items-center space-x-1 text-[11px] text-forge-600 hover:text-forge-900 font-medium px-2 py-1 rounded hover:bg-forge-100"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit wording</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={onClose}
                          className="flex items-center space-x-1 text-[11px] text-forge-500 hover:text-rose-600 font-medium px-2.5 py-1 rounded hover:bg-rose-50"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>

                        <button
                          disabled={isUnsupported}
                          onClick={() => {
                            onAccept(sug.suggested);
                            onClose();
                          }}
                          title={
                            isUnsupported
                              ? 'Unsupported claims cannot be accepted automatically'
                              : 'Accept and replace bullet'
                          }
                          className="flex items-center space-x-1 px-3 py-1 text-xs font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
