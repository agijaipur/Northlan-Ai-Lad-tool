'use client';

import { useState } from 'react';
import { useLeadStore, LeadStatus } from '@/store/useLeadStore';
import { Plus, Search, Filter, MoreVertical, FileText } from 'lucide-react';
import { format } from 'date-fns';
import LeadSlideOver from '@/components/LeadSlideOver';

export default function DashboardPage() {
  const { leads, deleteLead } = useLeadStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleOpenNewLead = () => {
    setSelectedLeadId(null);
    setIsSlideOverOpen(true);
  };

  const handleOpenLeadDetails = (id: string) => {
    setSelectedLeadId(id);
    setIsSlideOverOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Leads Overview</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage and qualify your incoming project leads.</p>
        </div>
        <button 
          onClick={handleOpenNewLead}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Lead
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-50 dark:bg-zinc-950/50">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-zinc-900 text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
              className="block w-full sm:w-auto pl-3 pr-8 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-zinc-900 text-sm outline-none transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Proposal Drafted">Proposal Drafted</option>
              <option value="Sent">Sent</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Business / Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Project Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Budget</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                    No leads found. Create a new lead to get started.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => handleOpenLeadDetails(lead.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                          {lead.businessName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{lead.businessName}</div>
                          <div className="text-sm text-zinc-500">{lead.contactName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">{lead.projectType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">{lead.estimatedBudget}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {format(new Date(lead.submissionDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadSlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)} 
        leadId={selectedLeadId} 
      />
    </div>
  );
}
