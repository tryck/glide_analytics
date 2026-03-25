import React from 'react';
import { Globe, Activity, AlertCircle, ChevronRight } from 'lucide-react';

export default function Dashboard({ bridges }) {
   const bridgesList = Array.isArray(bridges) ? bridges : [];
   const stats = [
      { label: 'Global Reach', value: bridgesList.reduce((a, b) => a + (b.stats?.customers || 0), 0), icon: Globe, color: '#7c3aed' },
      { label: 'Active Modules', value: bridgesList.filter(b => b.status === 'Online').length, icon: Activity, color: '#10b981' },
      { label: 'System Errors', value: bridgesList.filter(b => b.status === 'Offline').length, icon: AlertCircle, color: '#ef4444' },
   ];
   return (
      <div className="p-10 space-y-8 animate-in-fade font-['Lexend']">
         <div className="grid grid-cols-3 gap-6">
            {stats.map(s => (
               <div key={s.label} className="card-surface group relative">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-sm font-semibold text-white mb-0.5">{s.label}</h3>
                        <p className="text-[11px] text-[#a0a0a5]">System telemetry data</p>
                     </div>
                     <span className="flex items-center gap-1.5 text-[11px] text-[#a0a0a5]">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                         Live
                     </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                      <div className="text-3xl font-bold text-white tracking-tight">{s.value.toLocaleString()}</div>
                      <div className="text-[11px] text-[#10b981] font-medium leading-none">↑ 12%</div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="card-surface p-0 overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
               <div>
                  <h3 className="text-[15px] font-bold text-white">Infrastructure Status</h3>
                  <p className="text-[11px] text-[#a0a0a5]">Website traffic and engagement</p>
               </div>
               <button className="text-[11px] font-semibold text-white px-4 py-2 bg-white/5 rounded-md hover:bg-white/10 transition-all">Full Report</button>
            </div>
            
            <div className="divide-y divide-[var(--color-border)]">
               {bridgesList.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-all group">
                     <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${b.status === 'Online' ? 'bg-[#10b981]' : 'bg-[#ef4444] animate-pulse'}`} />
                        <div>
                           <div className="text-[13px] font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">{b.name}</div>
                           <div className="text-[11px] text-[#a0a0a5] mt-0.5">{b.stats?.license || 'Scanning Network...'}</div>
                        </div>
                     </div>
                     <div className="flex gap-10 text-right items-center">
                        {Object.entries(b.stats || {}).map(([label, val]) => (
                           label !== 'license' && (
                              <div key={label}>
                                 <div className="text-[10px] text-[#606065] font-semibold uppercase tracking-wider mb-1">{label}</div>
                                 <div className="text-sm font-bold text-white tabular-nums">{val}</div>
                              </div>
                           )
                        ))}
                        <ChevronRight size={16} className="text-[#606065] group-hover:text-white transition-all transform group-hover:translate-x-1" />
                     </div>
                  </div>
               ))}
               {bridgesList.length === 0 && (
                  <div className="py-20 text-center text-[#606065] text-xs font-medium uppercase tracking-widest">No nodes detected in network</div>
               )}
            </div>
         </div>
      </div>
   );
}
