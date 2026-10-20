import React from 'react';
import { ShieldCheck, Sparkles, Check, Lock, AlertCircle } from 'lucide-react';
import { StorageService } from '../../lib/storage';

interface AIPrivacyModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export const AIPrivacyModal: React.FC<AIPrivacyModalProps> = ({ isOpen, onAccept, onCancel }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    StorageService.setAcceptedAIPrivacy(true);
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-left border border-forge-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-forge-900">AI Privacy Notice & Consent</h2>
            <p className="text-xs text-forge-500">ResumeForge Honest Career AI Architecture</p>
          </div>
        </div>

        <div className="text-xs text-forge-700 space-y-3 mb-5 leading-relaxed bg-forge-50 p-4 rounded-lg border border-forge-100">
          <p>
            Before activating AI assistance, please review our transparent data handling principles:
          </p>
          <ul className="space-y-2 text-forge-600">
            <li className="flex items-start space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Controlled Transmission:</strong> Only the specific bullet point or job description you choose to improve is processed.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Zero Hallucination Rule:</strong> AI is strictly prohibited from inventing fake companies, job titles, degrees, dates, metrics, or unverified skills.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Server-Side Security:</strong> All AI processing runs through secure backend edge functions. Your API keys are never exposed in browser scripts.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <span>
                <strong>Fair Usage:</strong> You are granted 20 free AI calls per day, resetting at midnight.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-forge-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-forge-600 hover:text-forge-900 rounded-lg hover:bg-forge-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <span>I Understand & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
};
