'use client';

import { useState, useEffect } from 'react';
import { useLeadStore, LeadStatus } from '@/store/useLeadStore';
import { X, Sparkles, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import Editor from './Editor';

interface LeadSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
}

export default function LeadSlideOver({ isOpen, onClose, leadId }: LeadSlideOverProps) {
  const { leads, addLead, updateLead, updateLeadStatus } = useLeadStore();
  const lead = leads.find((l) => l.id === leadId);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectType, setProjectType] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [notes, setNotes] = useState('');

  // AI State
  const [aiSummary, setAiSummary] = useState('');
  const [aiProposalDraft, setAiProposalDraft] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);

  useEffect(() => {
    if (lead) {
      setBusinessName(lead.businessName);
      setWebsiteUrl(lead.websiteUrl);
      setContactName(lead.contactName);
      setContactEmail(lead.contactEmail);
      setProjectType(lead.projectType);
      setEstimatedBudget(lead.estimatedBudget);
      setNotes(lead.notes);
      setAiSummary(lead.aiSummary || '');
      setAiProposalDraft(lead.aiProposalDraft || '');
    } else {
      // Reset
      setBusinessName('');
      setWebsiteUrl('');
      setContactName('');
      setContactEmail('');
      setProjectType('');
      setEstimatedBudget('');
      setNotes('');
      setAiSummary('');
      setAiProposalDraft('');
    }
  }, [lead, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadId) {
      updateLead(leadId, {
        businessName, websiteUrl, contactName, contactEmail, projectType, estimatedBudget, notes,
        aiSummary, aiProposalDraft
      });
      toast.success('Lead updated');
    } else {
      addLead({
        businessName, websiteUrl, contactName, contactEmail, projectType, estimatedBudget, notes
      });
      toast.success('New lead added');
      onClose();
    }
  };

  const handleGenerateSummary = async () => {
    if (!leadId) return;
    setIsGeneratingSummary(true);
    const toastId = toast.loading('AI is generating summary...');
    try {
      const prompt = `Generate a project summary, suggested services, estimated complexity, and rough timeline for the following lead:\nBusiness: ${businessName}\nProject Type: ${projectType}\nBudget: ${estimatedBudget}\nNotes: ${notes}`;
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, actionType: 'summary' }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      
      setAiSummary(data.text);
      updateLead(leadId, { aiSummary: data.text });
      toast.success('Summary generated!', { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!leadId) return;
    setIsGeneratingProposal(true);
    const toastId = toast.loading('AI is drafting proposal...');
    try {
      const prompt = `Write a professional proposal draft based on this summary:\n${aiSummary}\nAnd these notes:\n${notes}\nFormat in HTML for a rich text editor.`;
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, actionType: 'proposal' }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      
      setAiProposalDraft(data.text);
      updateLead(leadId, { aiProposalDraft: data.text, status: 'Proposal Drafted' });
      toast.success('Proposal drafted!', { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handleExportPDF = () => {
    // Basic print trick for MVP, or we can use jsPDF if needed
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-2xl transform transition-all ease-in-out duration-300">
          <div className="h-full flex flex-col bg-white dark:bg-zinc-950 shadow-xl overflow-y-scroll">
            <div className="px-4 py-6 sm:px-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-20">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50" id="slide-over-title">
                {leadId ? 'Lead Details' : 'New Lead'}
              </h2>
              <button
                type="button"
                className="rounded-md text-zinc-400 hover:text-zinc-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close panel</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="relative flex-1 px-4 py-6 sm:px-6">
              <form id="lead-form" onSubmit={handleSave} className="space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Business Name</label>
                    <input required type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Contact Name</label>
                    <input required type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Contact Email</label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Website URL</label>
                    <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Project Type</label>
                    <input type="text" value={projectType} onChange={e => setProjectType(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. Website Redesign" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Estimated Budget</label>
                    <input type="text" value={estimatedBudget} onChange={e => setEstimatedBudget(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. $5000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes / Requirements</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>

                {/* AI Section - Only show if it's an existing lead */}
                {leadId && (
                  <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        AI Analysis & Proposal
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500">Status:</span>
                        <select
                          value={lead?.status}
                          onChange={(e) => updateLeadStatus(leadId, e.target.value as LeadStatus)}
                          className="block w-auto pl-3 pr-8 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-zinc-900"
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Proposal Drafted">Proposal Drafted</option>
                          <option value="Sent">Sent</option>
                          <option value="Closed">Closed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">AI Requirement Summary</h4>
                        <button
                          type="button"
                          onClick={handleGenerateSummary}
                          disabled={isGeneratingSummary}
                          className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                        >
                          {isGeneratingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate Summary'}
                        </button>
                      </div>
                      {aiSummary ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800" dangerouslySetInnerHTML={{ __html: aiSummary }} />
                      ) : (
                        <p className="text-sm text-zinc-400 italic">No summary generated yet.</p>
                      )}
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">Proposal Draft</h4>
                        <div className="flex gap-2">
                          {aiProposalDraft && (
                            <button
                              type="button"
                              onClick={handleExportPDF}
                              className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-3 h-3" />
                              Export PDF
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleGenerateProposal}
                            disabled={isGeneratingProposal || !aiSummary}
                            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {isGeneratingProposal ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Draft Proposal'}
                          </button>
                        </div>
                      </div>
                      
                      {aiProposalDraft ? (
                        <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden print-area">
                          <Editor 
                            content={aiProposalDraft} 
                            onChange={(content) => {
                              setAiProposalDraft(content);
                              updateLead(leadId, { aiProposalDraft: content });
                            }} 
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-400 italic">
                          {!aiSummary ? 'Generate a summary first before drafting a proposal.' : 'No proposal drafted yet.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="flex-shrink-0 px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 sm:px-6 bg-zinc-50 dark:bg-zinc-900 sticky bottom-0 z-20 flex justify-end gap-3">
              <button
                type="button"
                className="bg-white dark:bg-zinc-800 py-2 px-4 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="lead-form"
                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
