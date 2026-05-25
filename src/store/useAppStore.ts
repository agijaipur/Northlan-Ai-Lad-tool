import { create } from 'zustand';

interface AppState {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  documentContent: string;
  setDocumentContent: (content: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  documentContent: '<p>Start writing here, or use the AI to generate content...</p>',
  setDocumentContent: (content) => set({ documentContent: content }),
  error: null,
  setError: (error) => set({ error }),
}));
