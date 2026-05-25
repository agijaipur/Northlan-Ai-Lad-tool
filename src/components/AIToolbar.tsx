'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function AIToolbar() {
  const [prompt, setPrompt] = useState('');
  const { isGenerating, setIsGenerating, documentContent, setDocumentContent } = useAppStore();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const toastId = toast.loading('AI is thinking...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: documentContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      // Append generated content to the end or replace based on context? 
      // For simplicity, let's append it cleanly.
      const newContent = documentContent + (documentContent.endsWith('</p>') ? '' : '<br/>') + data.text;
      setDocumentContent(newContent);
      setPrompt('');
      toast.success('Content generated!', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-3 text-zinc-800 dark:text-zinc-200 font-medium">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <span>Ask AI Assistant</span>
      </div>
      <form onSubmit={handleGenerate} className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Write an introduction about space exploration..."
          disabled={isGenerating}
          className="w-full pl-4 pr-12 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-zinc-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button 
          type="button"
          onClick={() => setPrompt("Summarize the current text")}
          className="whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Summarize
        </button>
        <button 
          type="button"
          onClick={() => setPrompt("Improve the grammar and tone of the text")}
          className="whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Improve Grammar
        </button>
        <button 
          type="button"
          onClick={() => setPrompt("Continue writing from where the text left off")}
          className="whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Continue Writing
        </button>
      </div>
    </div>
  );
}
