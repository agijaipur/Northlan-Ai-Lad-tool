import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Northan AI
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Documentation
          </a>
          <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            Deploy
          </a>
        </nav>
      </div>
    </header>
  );
}
