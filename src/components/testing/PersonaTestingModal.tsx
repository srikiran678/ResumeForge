import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Star, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData } from '../../types';
import { PersonaTestingService, PersonaReview, HUMAN_PERSONAS } from '../../lib/personaTesting';

interface PersonaTestingModalProps {
  isOpen: boolean;
  resume: ResumeData;
  onClose: () => void;
  onApplyFix: (fixType: string) => void;
}

export const PersonaTestingModal: React.FC<PersonaTestingModalProps> = ({
  isOpen,
  resume,
  onClose,
  onApplyFix,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState(HUMAN_PERSONAS[0].id);

  if (!isOpen) return null;

  const reviews = PersonaTestingService.evaluateWithAllPersonas(resume);
  const activeReview = reviews.find((r) => r.personaId === selectedPersonaId) || reviews[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 text-left border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">Human Testing Agents Studio</h3>
                <span className="text-[10px] px-2 py-0.2 bg-purple-100 text-purple-800 rounded-full font-bold uppercase">
                  Simulated Personas
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live feedback from real hiring managers, student mentors, and engineering switchers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona Selectors Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 pb-2">
          {HUMAN_PERSONAS.map((p) => {
            const isSelected = selectedPersonaId === p.id;
            const rev = reviews.find((r) => r.personaId === p.id);

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaId(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${p.avatarColor}`}
                  >
                    {p.avatarInitials}
                  </div>
                  <span className="font-bold text-xs truncate">{p.name.split(' ')[0]}</span>
                </div>
                <div className="text-[10px] truncate opacity-75">{p.role.split(' at ')[0]}</div>
                <div className="mt-1 font-mono text-[11px] font-bold text-emerald-400">
                  {rev?.score}% Rating
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Detail View */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs">
          {/* Persona Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">{activeReview.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-medium">{activeReview.role}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{activeReview.background}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shrink-0 w-full sm:w-auto">
              <div className="text-2xl font-black text-slate-900">{activeReview.score}%</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                {activeReview.verdict}
              </span>
            </div>
          </div>

          {/* Persona Human Quote */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs italic text-purple-950 flex items-start space-x-2.5">
            <MessageSquare className="w-4 h-4 text-purple-600 mt-0.5 shrink-0 not-italic" />
            <div>
              <strong className="not-italic font-bold block mb-0.5 text-purple-900">
                "{activeReview.humanQuote}"
              </strong>
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 flex items-center space-x-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>What {activeReview.name.split(' ')[0]} Liked</span>
            </h4>
            <div className="space-y-1.5">
              {activeReview.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-950 flex items-start space-x-2"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Critiques & 1-Click Fixes */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Recommended Improvements</span>
            </h4>
            <div className="space-y-2">
              {activeReview.actionableCritiques.map((critique, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{critique.problem}</div>
                    <div className="text-[11px] text-slate-600">{critique.suggestion}</div>
                  </div>

                  <button
                    onClick={() => {
                      onApplyFix(critique.actionableFixType);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-950 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs shrink-0 flex items-center space-x-1"
                  >
                    <span>Apply Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-400">
            Personas test readability, ATS text flow, and impact metrics.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
