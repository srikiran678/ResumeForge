import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isDestructive?: boolean;
  requiredConfirmationText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isDestructive,
  requiredConfirmationText,
  onConfirm,
  onCancel
}) => {
  const effectiveVariant = isDestructive ? 'danger' : variant;
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputText('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isConfirmed = requiredConfirmationText 
    ? inputText.trim() === requiredConfirmationText 
    : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#121316] rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
              effectiveVariant === 'danger' 
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60'
            }`}>
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 id="confirm-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {message}
        </p>

        {requiredConfirmationText && (
          <div className="space-y-1.5 pt-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Type <span className="font-mono font-bold text-rose-600 dark:text-rose-400 select-all">"{requiredConfirmationText}"</span> to confirm:
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={requiredConfirmationText}
              className="w-full text-xs font-mono p-2.5 bg-slate-50 dark:bg-[#181922] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={!isConfirmed}
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              effectiveVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
