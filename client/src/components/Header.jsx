import React, { useState } from 'react';
import { Moon, Sun, RefreshCw, Calendar } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function Header({
   fetchData,
   setRefreshToggle,
   theme,
   onToggleTheme,
   title = 'System Control',
   subtitle = 'Centralized administration and monitoring',
   fiscalYear,
   setFiscalYear
}) {
   const [isRefreshing, setIsRefreshing] = useState(false);

   const currentYear = new Date().getFullYear();
   const availableYears = Array.from({ length: 10 }, (_, i) => ({
      value: currentYear - i,
      label: `${currentYear - i} Fiscal Year`
   }));

   const handleGlobalRefresh = async () => {
      setIsRefreshing(true);
      if (fetchData) await fetchData();
      if (setRefreshToggle) setRefreshToggle(prev => prev + 1);
      // Artificial delay for better UX visibility of the animation
      setTimeout(() => setIsRefreshing(false), 600);
   };

   return (
      <header className="h-[60px] border-b border-[var(--color-border)] flex items-center justify-between px-10 sticky top-0 bg-[var(--color-bg-header)] backdrop-blur-xl z-[60] fixed right-0 left-[230px] shadow-[var(--color-topbar-shadow)]">
         <div className="min-w-0 flex items-center gap-3">
            <div className="leading-tight min-w-0">
               <h1 className="text-[18px] font-black text-[var(--color-text-strong)] tracking-tight truncate uppercase">{title}</h1>
               {/* <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{subtitle}</p> */}
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="w-[180px]">
               <CustomDropdown
                  options={availableYears}
                  value={fiscalYear}
                  onChange={val => setFiscalYear(parseInt(val))}
                  placeholder="Select Year..."
               />
            </div>

            <div className="flex items-center gap-2 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-soft)]">
               <button onClick={onToggleTheme} className="btn-action flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5" title="Toggle theme" aria-label="Toggle light and dark theme">
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
               </button>
               <button onClick={handleGlobalRefresh} className="btn-action px-2.5 py-1.5" aria-label="Refresh and Synchronize">
                  <RefreshCw size={16} className={`text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all ${isRefreshing ? 'animate-spin' : ''}`} />
               </button>
            </div>
         </div>
      </header>
   );
}
