import { useState, useCallback } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useToast } from '@/components/common/Toast';
import { parseDesignerIntent, executeDesignerMutation } from './designerIntentRouter';
import { DesignerExecutionResult, DesignerPromptChip } from './types';
import confetti from 'canvas-confetti';

export function useAIDesigner() {
  const { currentResume, updateCurrentResume, createVersionSnapshot } = useWorkspace();
  const { showToast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<DesignerExecutionResult | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<any | null>(null);

  const applyPrompt = useCallback(
    async (promptText: string) => {
      const query = promptText.trim();
      if (!query || !currentResume) return;

      setIsProcessing(true);
      try {
        // 1. Create a safe in-memory snapshot before mutating state
        const snapshot = JSON.parse(JSON.stringify(currentResume));
        setUndoSnapshot(snapshot);

        // Optional: Save checkpoint version milestone
        createVersionSnapshot(
          `AI Designer: ${query.slice(0, 25)}...`,
          'Automated snapshot prior to Live AI Resume Designer prompt'
        );

        // 2. Parse Intent (Hybrid Router: 0ms client-side execution)
        const intent = parseDesignerIntent(query, currentResume);

        // 3. Execute Mutation
        const { updatedResume, changes } = executeDesignerMutation(currentResume, intent);

        // 4. Update Resume in Workspace State
        updateCurrentResume(() => updatedResume);

        const result: DesignerExecutionResult = {
          success: true,
          message: intent.explanation,
          changes,
          previousStateSnapshot: snapshot,
          quotaUsed: false,
        };

        setLastResult(result);
        setPrompt('');

        // 5. User Feedback
        showToast(intent.explanation, 'success');
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.85 } });
      } catch (err: any) {
        console.error('AI Designer execution error:', err);
        showToast(err.message || 'Failed to apply design modification', 'error');
      } finally {
        setIsProcessing(false);
      }
    },
    [currentResume, updateCurrentResume, createVersionSnapshot, showToast]
  );

  const revertLastMutation = useCallback(() => {
    if (!undoSnapshot) {
      showToast('No previous modification to undo', 'info');
      return;
    }

    updateCurrentResume(() => undoSnapshot);
    setUndoSnapshot(null);
    setLastResult(null);
    showToast('Reverted to previous design state', 'info');
  }, [undoSnapshot, updateCurrentResume, showToast]);

  const applyChip = useCallback(
    (chip: DesignerPromptChip) => {
      applyPrompt(chip.prompt);
    },
    [applyPrompt]
  );

  return {
    prompt,
    setPrompt,
    isProcessing,
    lastResult,
    canUndo: !!undoSnapshot,
    applyPrompt,
    revertLastMutation,
    applyChip,
  };
}
