'use client';

import { useState } from 'react';
import { useLeadStore } from '@/store/useLeadStore';
import { Sparkles, Loader2, FileText, Download, Copy, ChevronDown, ChevronUp, User, Globe, Mail, Briefcase, DollarSign, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Editor from '@/components/Editor';

export default function ProposalsPage() {
  const { leads, updateLead } = useLeadStore();
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [editingProposals, setEditingProposals] = useState<Record<string, string>>({});

  const handleGenerateProposal = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setGeneratingId(leadId);
    setExpandedLeadId(leadId);
    const toastId = toast.loading('AI is generating proposal from lead details...');

    try {
      const prompt = `Generate a complete professional proposal for the following client and project:

CLIENT INFORMATION:
- Business Name: ${lead.businessName}
- Contact Person: ${lead.contactName}
- Email: ${lead.contactEmail}
- Website: ${lead.websiteUrl || 'Not provided'}

PROJECT DETAILS:
- Project Type: ${lead.projectType}
- Estimated Budget: ${lead.estimatedBudget || 'Not specified'}
- Requirements/Notes: ${lead.notes || 'No additional notes'}
- Submission Date: ${format(new Date(lead.submissionDate), 'MMMM d, yyyy')}

Based on the Project Type "${lead.projectType}", create a detailed proposal with these sections:
1. Project Overview — what the project entails based on the project type
2. Scope of Work — detailed deliverables tailored to "${lead.projectType}"
3. Suggested Services — based on the project type, suggest relevant services
4. Estimated Timeline — realistic timeline with milestones
5. Pricing Breakdown — based on the budget of ${lead.estimatedBudget || 'market rates'}
6. Terms & Next Steps

Format in clean HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong>. Do NOT use markdown code blocks.`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, actionType: 'proposal' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      setEditingProposals(prev => ({ ...prev, [leadId]: data.text }));
      updateLead(leadId, { aiProposalDraft: data.text, status: 'Proposal Drafted' });
      toast.success('Proposal generated successfully!', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate proposal', { id: toastId });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleCopyProposal = (leadId: string) => {
    const proposal = editingProposals[leadId] || leads.find(l => l.id === leadId)?.aiProposalDraft;
    if (!proposal) return;

    // Strip HTML to plain text for copying
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = proposal;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    navigator.clipboard.writeText(plainText);
    toast.success('Proposal text copied to clipboard!');
  };

  const handleExportPDF = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    const proposal = editingProposals[leadId] || lead?.aiProposalDraft;
    if (!proposal || !lead) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to export PDF');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proposal - ${lead.businessName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a2e; line-height: 1.6; }
          h1 { color: #4338ca; border-bottom: 2px solid #4338ca; padding-bottom: 10px; }
          h2 { color: #312e81; margin-top: 30px; }
          h3 { color: #3730a3; }
          ul { padding-left: 20px; }
          li { margin-bottom: 5px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-size: 28px; }
          .header p { color: #64748b; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Proposal for ${lead.businessName}</h1>
          <p>Prepared on ${format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        ${proposal}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Reviewing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Proposal Drafted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Sent': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Closed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">AI Proposal Generator</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select a lead to auto-generate a professional proposal based on their project type and details.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">No leads yet</h3>
          <p className="text-sm text-zinc-500 mt-1">Add leads from the Leads page first, then come back to generate proposals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map(lead => {
            const isExpanded = expandedLeadId === lead.id;
            const isGenerating = generatingId === lead.id;
            const currentProposal = editingProposals[lead.id] || lead.aiProposalDraft;

            return (
              <div key={lead.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                {/* Lead Summary Row */}
                <div
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-11 w-11 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-lg">
                      {lead.businessName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{lead.businessName}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{lead.projectType || 'N/A'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{lead.estimatedBudget || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleGenerateProposal(lead.id); }}
                      disabled={isGenerating}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {currentProposal ? 'Regenerate' : 'Generate Proposal'}
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-zinc-200 dark:border-zinc-800">
                    {/* Lead Details Grid */}
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-950/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <User className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">Contact:</span> {lead.contactName || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Mail className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">Email:</span> {lead.contactEmail || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Globe className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">Website:</span> {lead.websiteUrl || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Briefcase className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">Project:</span> {lead.projectType || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">Budget:</span> {lead.estimatedBudget || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <StickyNote className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">Date:</span> {format(new Date(lead.submissionDate), 'MMM d, yyyy')}
                      </div>
                      {lead.notes && (
                        <div className="col-span-full flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                          <StickyNote className="w-4 h-4 text-zinc-400 mt-0.5" />
                          <div><span className="font-medium">Notes:</span> {lead.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Proposal Area */}
                    <div className="p-5">
                      {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                          <Loader2 className="w-8 h-8 animate-spin mb-3" />
                          <p className="text-sm font-medium">AI is drafting your proposal...</p>
                          <p className="text-xs mt-1">This may take a few seconds</p>
                        </div>
                      ) : currentProposal ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Editable Proposal Draft</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCopyProposal(lead.id)}
                                className="flex items-center gap-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Copy className="w-3 h-3" /> Copy Text
                              </button>
                              <button
                                onClick={() => handleExportPDF(lead.id)}
                                className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
                              >
                                <Download className="w-3 h-3" /> Export PDF
                              </button>
                            </div>
                          </div>
                          <Editor
                            content={currentProposal}
                            onChange={(content) => {
                              setEditingProposals(prev => ({ ...prev, [lead.id]: content }));
                              updateLead(lead.id, { aiProposalDraft: content });
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-12 text-zinc-400">
                          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">Click &quot;Generate Proposal&quot; to create a proposal based on this lead&apos;s project type.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
