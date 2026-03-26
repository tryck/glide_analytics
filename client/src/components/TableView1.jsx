import React from 'react';
import { Plus, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';

export default function TableView1() {
   return (
      <div className="p-10 space-y-8 animate-in-fade font-['Lexend']">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-semibold text-[var(--color-text-strong)]">Posts & Articles</h1>
               <p className="text-[11px] text-[var(--color-text-muted)] mt-1 tracking-wider font-semibold">Content Hub Infrastructure</p>
            </div>
            <button className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-text-strong)] px-5 py-2.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 border border-transparent hover:border-[var(--color-border-glow)]">
               <Plus size={16} /> New Post
            </button>
         </div>

         <div className="card-surface p-0 overflow-hidden">
            <div className="divide-y divide-[var(--color-border)]">
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-[var(--color-table-row-hover)] transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-10 bg-[var(--color-bg-card-soft)] border border-[var(--color-border)] rounded-md flex items-center justify-center">
                           <ImageIcon size={16} className="text-[var(--color-accent)]" />
                        </div>
                        <div>
                           <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-all cursor-pointer">Modern Architecture Patterns in Scalable Microservices</h3>
                           <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] text-[var(--color-text-muted)] font-semibold tracking-wider">Mark Ashton</span>
                              <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                              <span className="text-[10px] text-[var(--color-text-muted)] font-semibold tracking-wider">Dev</span>
                              <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                              <span className="text-[10px] text-[var(--color-text-secondary)] font-medium leading-none">Oct 24, 2025</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all"><Pencil size={14} /></button>
                        <button className="p-2 text-[var(--color-text-secondary)] hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
