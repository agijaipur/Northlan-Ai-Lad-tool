import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LeadStatus = 'New' | 'Reviewing' | 'Proposal Drafted' | 'Sent' | 'Closed' | 'Rejected';

export interface Lead {
  id: string;
  businessName: string;
  websiteUrl: string;
  contactName: string;
  contactEmail: string;
  projectType: string;
  estimatedBudget: string;
  notes: string;
  submissionDate: string;
  status: LeadStatus;
  aiSummary?: string;
  aiProposalDraft?: string;
}

interface LeadState {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'submissionDate' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (leadData) => set((state) => ({
        leads: [
          {
            ...leadData,
            id: crypto.randomUUID(),
            submissionDate: new Date().toISOString(),
            status: 'New',
          },
          ...state.leads,
        ],
      })),
      updateLeadStatus: (id, status) => set((state) => ({
        leads: state.leads.map(lead => lead.id === id ? { ...lead, status } : lead),
      })),
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(lead => lead.id === id ? { ...lead, ...updates } : lead),
      })),
      deleteLead: (id) => set((state) => ({
        leads: state.leads.filter(lead => lead.id !== id),
      })),
    }),
    {
      name: 'crm-leads-storage',
    }
  )
);
