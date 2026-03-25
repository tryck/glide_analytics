import React from 'react';
import { PieChart, RefreshCw } from 'lucide-react';

export default function Header({ fetchData }) {
   return (
      <header className="h-[60px] border-b border-[var(--color-border)] flex items-center justify-between px-10 sticky top-0 bg-[var(--color-bg-header)] backdrop-blur-md z-[60] fixed right-0 left-[260px]">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] border border-[#7c3aed]/20"><PieChart size={18} /></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">System Control</h2>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
               <span className="text-[11px] font-medium text-[#a0a0a5]">Production Shield Active</span>
            </div>
            {fetchData && (
                <button onClick={fetchData} className="p-2 text-[#707075] hover:text-white transition-all">
                    <RefreshCw size={16} />
                </button>
            )}
         </div>
      </header>
   );
}
