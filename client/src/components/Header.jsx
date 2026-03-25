import React from 'react';
import { PieChart, RefreshCw, Moon, Sun } from 'lucide-react';

export default function Header({ fetchData, theme, onToggleTheme, title = 'System Control', subtitle = 'Centralized administration and monitoring' }) {
   return (
      <header className="h-[60px] border-b border-[var(--color-border)] flex items-center justify-between px-10 sticky top-0 bg-[var(--color-bg-header)] backdrop-blur-xl z-[60] fixed right-0 left-[260px] shadow-[var(--color-topbar-shadow)]">
         <div className="min-w-0 flex items-center gap-3">
            {/* <div className="w-8 h-8 rounded-md bg-[var(--color-accent)]/12 flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-accent)]/25 shrink-0">
               <PieChart size={16} />
            </div> */}
            <div className="leading-tight min-w-0">
               <h1 className="text-[22px] font-semibold pl-6 text-[var(--color-text-strong)] tracking-tight truncate">{title}</h1>
               {/* <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 truncate">{subtitle}</p> */}
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-panel-soft)]">
               <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
               <span className="text-[10px] font-medium text-[var(--color-text-muted)]">Production Active</span>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-soft)]">
               <button onClick={onToggleTheme} className="btn-action flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5" title="Toggle theme" aria-label="Toggle light and dark theme">
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
               </button>
               {fetchData && (
                  <button onClick={fetchData} className="btn-action px-2.5 py-1.5" aria-label="Refresh data">
                     <RefreshCw size={16} />
                  </button>
               )}
            </div>
         </div>
      </header>
   );
}
