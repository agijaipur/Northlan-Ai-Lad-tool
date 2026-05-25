'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Save, Key, Lock, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('Northan AI');
  const [companyEmail, setCompanyEmail] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP, store in localStorage
    localStorage.setItem('crm-settings', JSON.stringify({ companyName, companyEmail, defaultCurrency }));
    toast.success('Settings saved successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (adminPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    // In a real app this would update a database. For MVP, just show confirmation.
    toast.success('Password change would be applied in production.');
    setAdminPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-500" />
          Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your CRM preferences and account settings.</p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" />
            General Settings
          </h2>
        </div>
        <form onSubmit={handleSaveGeneral} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Company Email</label>
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="contact@yourcompany.com"
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Default Currency</label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            Change Password
          </h2>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter new password"
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Key className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* API Key Info */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-500" />
            API Configuration
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-indigo-800 dark:text-indigo-300">
              <strong>OpenAI API Key</strong> is configured via your <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded text-xs">.env.local</code> file on the server.
              To change it, update the <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded text-xs">OPENAI_API_KEY</code> variable and restart the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
