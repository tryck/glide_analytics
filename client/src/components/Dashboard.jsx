import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Globe, Activity, AlertCircle, ChevronRight, ShieldCheck, Zap, Server, TrendingUp } from 'lucide-react';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, var(--color-panel-soft) 25%, var(--color-panel-strong) 50%, var(--color-panel-soft) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${props => props.radius || '12px'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

const ChartCard = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-text-strong);
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
  }
`;

const CustomAreaChart = ({ data }) => {
   const max = (Math.max(...data.map(d => d.v)) || 1) * 1.2;
   const width = 500;
   const height = 200;
   
   const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.v / max) * height;
      return `${x},${y}`;
   }).join(' ');

   const areaPoints = `0,${height} ${points} ${width},${height}`;

   return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
         <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
               <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
         </defs>
         <path d={`M ${points}`} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
         <path d={`M ${areaPoints}`} fill="url(#areaGradient)" />
         {data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d.v / max) * height;
            return (
               <g key={i} className="group/dot">
                  <circle cx={x} cy={y} r="4" fill="#8b5cf6" className="opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                  <text x={x} y={y - 10} fontSize="8" fill="#fff" textAnchor="middle" className="opacity-0 group-hover/dot:opacity-100 transition-opacity font-bold">{d.v}</text>
               </g>
            );
         })}
      </svg>
   );
};

const CustomDonutChart = ({ data }) => {
   let total = data.reduce((a, b) => a + b.value, 0);
   let cumulativePercent = 0;

   return (
      <div className="relative w-48 h-48 flex items-center justify-center">
         <svg viewBox="0 0 32 32" className="w-full h-full rotate-[-90deg]">
            {data.map((d, i) => {
               const percent = (d.value / (total || 1)) * 100;
               const offset = 100 - cumulativePercent;
               cumulativePercent += percent;
               return (
                  <circle 
                     key={i}
                     r="16" cx="16" cy="16"
                     fill="transparent"
                     stroke={d.color}
                     strokeWidth="4"
                     strokeDasharray={`${percent} ${100 - percent}`}
                     strokeDashoffset={offset}
                  />
               );
            })}
            <circle r="12" cx="16" cy="16" fill="var(--color-bg-card)" />
         </svg>
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{total}</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Licenses</span>
         </div>
      </div>
   );
};

export default function Dashboard({ bridges, loading: parentLoading }) {
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
   }, []);

   const bridgesList = Array.isArray(bridges) ? bridges : [];
   const activeBridges = bridgesList.filter(b => b.status === 'Online');
   const offlineBridges = bridgesList.filter(b => b.status === 'Offline');

   const stats = [
      { label: 'Global Traffic', value: bridgesList.reduce((a, b) => a + (b.stats?.customers || 0), 0), icon: Globe, color: '#8b5cf6' },
      { label: 'Network Nodes', value: bridgesList.length, icon: Server, color: '#3b82f6' },
      { label: 'License Integrity', value: `${((activeBridges.length / (bridgesList.length || 1)) * 100).toFixed(0)}%`, icon: ShieldCheck, color: '#10b981' },
      { label: 'Critical Faults', value: offlineBridges.length, icon: AlertCircle, color: '#ef4444' },
   ];

   const licenseData = [
      { name: 'Enterprise', value: 45, color: '#8b5cf6' },
      { name: 'Standard', value: 30, color: '#3b82f6' },
      { name: 'Trial', value: 15, color: '#f59e0b' },
      { name: 'Legacy', value: 10, color: '#64748b' },
   ];

   const historyData = [
      { t: '00:00', v: 400 }, { t: '04:00', v: 300 }, { t: '08:00', v: 600 },
      { t: '12:00', v: 800 }, { t: '16:00', v: 700 }, { t: '20:00', v: 900 },
      { t: '23:59', v: 1100 },
   ];

   if (loading || parentLoading) {
      return (
         <div className="p-10 space-y-8 animate-in-fade font-['Lexend']">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[1,2,3,4].map(i => <Skeleton key={i} height="120px" radius="16px" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <Skeleton height="350px" className="lg:col-span-2" radius="20px" />
               <Skeleton height="350px" radius="20px" />
            </div>
            <Skeleton height="400px" radius="24px" />
         </div>
      );
   }

   return (
      <div className="p-10 space-y-8 animate-in-fade font-['Lexend']">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, idx) => {
               const Icon = s.icon;
               return (
                  <div key={s.label} className="card-surface p-6 group hover:translate-y-[-4px] transition-all relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Icon size={80} />
                     </div>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-panel-strong)] flex items-center justify-center border border-[var(--color-border)]" style={{ color: s.color }}>
                           <Icon size={20} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{s.label}</h3>
                     </div>
                     <div className="flex items-baseline justify-between relative z-10">
                        <div className="text-3xl font-black text-[var(--color-text-strong)] tracking-tight tabular-nums">{s.value.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${idx === 3 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {idx === 3 ? '+2' : '↑ 14%'}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard className="lg:col-span-2">
               <div className="flex justify-between items-start">
                  <div>
                     <h3>Network Flow Persistence</h3>
                     <p>Aggregate logical bandwidth across all active site nodes</p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                     <TrendingUp size={14} /> High Throughput
                  </div>
               </div>
               <div className="h-[250px] w-full mt-4 flex items-end">
                  <CustomAreaChart data={historyData} />
               </div>
               <div className="flex justify-between px-2 mt-4">
                  {historyData.map(d => <span key={d.t} className="text-[8px] font-black text-slate-700 uppercase">{d.t}</span>)}
               </div>
            </ChartCard>

            <ChartCard>
               <div>
                  <h3>License Distribution</h3>
                  <p>Client tier segmentation</p>
               </div>
               <div className="h-[250px] w-full flex flex-col items-center justify-center">
                  <CustomDonutChart data={licenseData} />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 w-full px-4">
                     {licenseData.map(d => (
                        <div key={d.name} className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-[9px] font-bold text-slate-500 uppercase">{d.name}</span>
                           </div>
                           <span className="text-[10px] font-black text-white italic">{d.value}%</span>
                        </div>
                     ))}
                  </div>
               </div>
            </ChartCard>
         </div>
         
         <div className="card-surface p-0 overflow-hidden rounded-[24px]">
            <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-panel-soft)]">
               <div>
                  <h3 className="text-lg font-black text-[var(--color-text-strong)] uppercase tracking-tight">Active Node Registry</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-[0.2em] mt-1">Real-time infrastructure health and telemetry</p>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/5 px-6 py-3 rounded-xl border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">Consolidate Report</button>
            </div>
            
            <div className="divide-y divide-[var(--color-border)]">
               {bridgesList.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-6 hover:bg-[var(--color-panel-soft)] transition-all group cursor-pointer">
                     <div className="flex items-center gap-6">
                        <div className="relative">
                           <div className={`w-3 h-3 rounded-full ${b.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                           {b.status === 'Online' && <div className="absolute inset-0 bg-emerald-500 blur-[6px] animate-pulse rounded-full opacity-50" />}
                        </div>
                        <div>
                           <div className="text-[14px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{b.name}</div>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{b.stats?.license || 'Standard Edition'}</span>
                              <span className="text-slate-700">•</span>
                              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">v2.4.1-rc</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-10 text-right items-center">
                        {Object.entries(b.stats || {}).map(([label, val]) => (
                           label !== 'license' && (
                              <div key={label} className="min-w-[80px]">
                                 <div className="text-[9px] text-[var(--color-text-muted)] font-black uppercase tracking-[0.2em] mb-1">{label}</div>
                                 <div className="text-[15px] font-black text-white tabular-nums tracking-tighter italic">{val.toLocaleString()}</div>
                              </div>
                           )
                        ))}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                           <ChevronRight size={18} className="text-indigo-400" />
                        </div>
                     </div>
                  </div>
               ))}
               {bridgesList.length === 0 && (
                  <div className="py-24 text-center border-t border-[var(--color-border)]">
                     <Zap size={48} className="mx-auto mb-6 text-slate-800" />
                     <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700">No nodes detected in global network</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
