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
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stats.map((s, idx) => {
               const Icon = s.icon;
               return (
                  <div key={s.label} className="card-surface group relative overflow-hidden">
                     <div className="absolute inset-x-0 top-0 h-[2px] opacity-70" style={{ backgroundColor: s.color }} />
                     <div className="flex justify-between items-start mb-5">
                        <div>
                           <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{s.label}</h3>
                           <p className="text-[11px] text-[var(--color-text-muted)]">System telemetry data</p>
                        </div>
                        <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-soft)] flex items-center justify-center" style={{ color: s.color }}>
                           <Icon size={17} />
                        </div>
                     </div>
                     <div className="flex items-baseline justify-between">
                        <div className="text-3xl font-semibold text-[var(--color-text-strong)] tracking-tight tabular-nums">{s.value.toLocaleString()}</div>
                        <div className={`text-[11px] font-semibold leading-none ${idx === 2 ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                           {idx === 2 ? '↓ 4%' : '↑ 12%'}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
         
         <div className="card-surface p-0 overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-panel-soft)]">
               <div>
                  <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Infrastructure Status</h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Website traffic and engagement</p>
               </div>
               <button className="text-[11px] font-medium text-[var(--color-text-primary)] px-4 py-2 rounded-md transition-all border border-[var(--color-border)] hover:border-[var(--color-border-glow)] bg-[var(--color-panel-soft)] hover:bg-[var(--color-sidebar-hover)]">Full Report</button>
            </div>
            
            <div className="divide-y divide-[var(--color-border)]">
               {bridgesList.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-5 hover:bg-[var(--color-panel-soft)] transition-all group">
                     <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${b.status === 'Online' ? 'bg-[#10b981]' : 'bg-[#ef4444] animate-pulse'}`} />
                        <div>
                           <div className="text-[13px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{b.name}</div>
                           <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{b.stats?.license || 'Scanning Network...'}</div>
                        </div>
                     </div>
                     <div className="flex gap-8 text-right items-center">
                        {Object.entries(b.stats || {}).map(([label, val]) => (
                           label !== 'license' && (
                              <div key={label}>
                                 <div className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mb-1">{label}</div>
                                 <div className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">{val}</div>
                              </div>
                           )
                        ))}
                        <ChevronRight size={16} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-all transform group-hover:translate-x-1" />
                     </div>
                  </div>
               ))}
               {bridgesList.length === 0 && (
                  <div className="py-20 text-center text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-widest">No nodes detected in network</div>
               )}
            </div>
         </div>
      </div>
   );
}
