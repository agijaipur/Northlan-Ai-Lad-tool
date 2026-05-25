'use client';

import { Sparkles, Users, FileText, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app we'd call an API to clear the cookie. 
    // For MVP, we can clear the cookie via document.cookie in client or just delete it.
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    toast.success('Logged out');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AI CRM
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'}`}>
            <Users className="w-5 h-5" />
            Leads
          </Link>
          <Link href="/dashboard/proposals" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/dashboard/proposals' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'}`}>
            <FileText className="w-5 h-5" />
            Proposals
          </Link>
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/dashboard/settings' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'}`}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-zinc-600 hover:bg-red-50 hover:text-red-700 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 md:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <span className="font-bold">AI CRM</span>
            </div>
            <button onClick={handleLogout} className="text-zinc-500">
              <LogOut className="w-5 h-5" />
            </button>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
