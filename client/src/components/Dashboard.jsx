import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Globe, Activity, AlertCircle, ChevronRight, ShieldCheck, Zap, Server, TrendingUp, Search } from 'lucide-react';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, var(--color-panel-soft) 25%, var(--color-panel-strong) 50%, var(--color-panel-soft) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${props => props.radius || 'var(--radius-md)'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

const ChartCard = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
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

const CustomLineChart = ({ data, categories }) => {
   const width = 800;
   const height = 300;
   const padding = 40;
   
   // Combine all values to find max for scale
   const allValues = data.flatMap(d => d.values);
   const max = (Math.max(...allValues) || 1) * 1.2;
   
   const getX = (index) => padding + (index / (categories.length - 1)) * (width - 2 * padding);
   const getY = (value) => height - padding - (value / max) * (height - 2 * padding);

   return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
         <defs>
            {data.map((serie, idx) => (
               <linearGradient key={idx} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={serie.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={serie.color} stopOpacity="0" />
               </linearGradient>
            ))}
         </defs>

         {/* Grid Lines */}
         {[0, 0.25, 0.5, 0.75, 1].map(p => {
            const y = getY(max * p / 1.2);
            return (
               <g key={p}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={padding - 10} y={y + 3} fontSize="10" fill="var(--color-text-muted)" textAnchor="end" className="font-medium">
                     {Math.round(max * p / 1.2).toLocaleString()}
                  </text>
               </g>
            );
         })}

         {/* X Axis Labels */}
         {categories.map((cat, i) => (
            <text key={i} x={getX(i)} y={height - 10} fontSize="10" fill="var(--color-text-muted)" textAnchor="middle" className="font-bold tracking-widest">
               {cat}
            </text>
         ))}

         {/* Areas and Lines */}
         {data.map((serie, idx) => {
            const points = serie.values.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
            const areaPoints = `${getX(0)},${height - padding} ${points} ${getX(serie.values.length - 1)},${height - padding}`;
            
            return (
               <g key={idx}>
                  <path d={`M ${areaPoints}`} fill={`url(#gradient-${idx})`} />
                  <path d={`M ${points}`} fill="none" stroke={serie.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" />
                  {serie.values.map((v, i) => (
                     <g key={i} className="group/dot">
                        <circle cx={getX(i)} cy={getY(v)} r="5" fill={serie.color} className="opacity-0 group-hover/dot:opacity-100 transition-opacity cursor-pointer" />
                        <rect x={getX(i) - 30} y={getY(v) - 30} width="60" height="20" rx="4" fill="var(--color-panel-strong)" className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none" />
                        <text x={getX(i)} y={getY(v) - 16} fontSize="10" fill="#fff" textAnchor="middle" className="opacity-0 group-hover/dot:opacity-100 transition-opacity font-bold">{v.toLocaleString()}</text>
                     </g>
                  ))}
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
            <span className="text-[8px] font-bold text-slate-500 tracking-widest">Nodes</span>
         </div>
      </div>
   );
};

export default function Dashboard({ bridges, products, loading: parentLoading }) {
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   
   useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
   }, []);

   const bridgesList = Array.isArray(bridges) ? bridges : [];
   const productsList = Array.isArray(products) ? products : [];
   const activeBridges = bridgesList.filter(b => b.status === 'Online');
   const offlineBridges = bridgesList.filter(b => b.status === 'Offline');

   const filteredBridges = bridgesList.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.stats?.license || '').toLowerCase().includes(searchQuery.toLowerCase())
   );

   const stats = [
      { label: 'Global Traffic', value: bridgesList.reduce((a, b) => a + (b.stats?.customers || 0), 0), icon: Globe, color: '#8b5cf6' },
      { label: 'Network Nodes', value: bridgesList.length, icon: Server, color: '#3b82f6' },
      { label: 'License Integrity', value: `${((activeBridges.length / (bridgesList.length || 1)) * 100).toFixed(0)}%`, icon: ShieldCheck, color: '#10b981' },
      { label: 'Critical Faults', value: offlineBridges.length, icon: AlertCircle, color: '#ef4444' },
   ];

   const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];
   const licenseData = productsList.map((p, idx) => {
      const count = bridgesList.filter(b => String(b.product_id) === String(p.id)).length;
      return {
         name: p.name,
         value: count,
         color: colors[idx % colors.length]
      };
   }).filter(d => d.value > 0);

   // If no data, show some fallback or empty state handled by chart
   if (licenseData.length === 0 && productsList.length > 0) {
       // fallback if no bridges yet but products exist
   }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const financialData = [
       { 
          label: 'Subscription Bill', 
          color: '#8b5cf6', 
          values: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 89000] 
       },
       { 
          label: 'Payment Received', 
          color: '#10b981', 
          values: [42000, 48000, 50000, 58000, 53000, 65000, 70000, 66000, 73000, 80000, 76000, 87000] 
       }
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
                        <div className="w-10 h-10 bg-[var(--color-panel-strong)] flex items-center justify-center border border-[var(--color-border)]" style={{ color: s.color, borderRadius: 'var(--radius-md)' }}>
                           <Icon size={20} />
                        </div>
                        <h3 className="text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)]">{s.label}</h3>
                     </div>
                     <div className="flex items-baseline justify-between relative z-10">
                        <div className="text-3xl font-black text-[var(--color-text-strong)] tracking-tight tabular-nums">{s.value.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold px-2 py-0.5 ${idx === 3 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`} style={{ borderRadius: 'var(--radius-xl)' }}>
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
                      <h3>Financial Flow Analysis</h3>
                      <p>Subscription billing vs actual payments collected per month</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-indigo-500" />
                         <span className="text-[10px] font-black tracking-widest text-[var(--color-text-muted)]">Bills</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-emerald-500" />
                         <span className="text-[10px] font-black tracking-widest text-[var(--color-text-muted)]">Payments</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black tracking-widest pl-4 border-l border-[var(--color-border)]">
                         <TrendingUp size={14} /> +12.4% MoM
                      </div>
                   </div>
                </div>
                <div className="h-[300px] w-full mt-6">
                   <CustomLineChart data={financialData} categories={months} />
                </div>
             </ChartCard>

            <ChartCard>
               <div>
                  <h3>Product Ecosystem</h3>
                  <p>Deployment volume per product</p>
               </div>
               <div className="h-[250px] w-full flex flex-col items-center justify-center">
                  <CustomDonutChart data={licenseData} />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 w-full px-4 overflow-y-auto max-h-[100px] custom-scrollbar">
                     {licenseData.map(d => (
                        <div key={d.name} className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-[9px] font-bold text-slate-500 truncate max-w-[80px]">{d.name}</span>
                           </div>
                           <span className="text-[10px] font-black text-white italic">{d.value}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </ChartCard>
         </div>
         
         <div className="card-surface p-0 overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
            <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-panel-soft)]">
               <div>
                  <h3 className="text-lg font-black text-[var(--color-text-strong)] tracking-tight">Active Node Registry</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-bold tracking-[0.2em] mt-1">Real-time infrastructure health and telemetry</p>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="relative group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                     <input 
                        type="text" 
                        placeholder="Search nodes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/20 border border-white/5 py-3.5 pl-12 pr-6 text-[10px] font-bold tracking-widest outline-none focus:border-indigo-500/50 transition-all w-72"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                     />
                  </div>
                  <button className="text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-500/5 px-8 py-4 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all" style={{ borderRadius: 'var(--radius-sm)' }}>Consolidate Report</button>
               </div>
            </div>
            
            <div className="divide-y divide-[var(--color-border)]">
               {filteredBridges.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-6 hover:bg-[var(--color-panel-soft)] transition-all group cursor-pointer">
                     <div className="flex items-center gap-6">
                        <div className="relative">
                           <div className={`w-3 h-3 rounded-full ${b.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                           {b.status === 'Online' && <div className="absolute inset-0 bg-emerald-500 blur-[6px] animate-pulse rounded-full opacity-50" />}
                        </div>
                        <div>
                           <div className="text-[14px] font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{b.name}</div>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold text-slate-500 tracking-widest">{b.stats?.license || 'Standard Edition'}</span>
                              <span className="text-slate-700">•</span>
                              <span className="text-[9px] font-bold text-slate-600 tracking-widest">v2.4.1-rc</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-10 text-right items-center">
                        {Object.entries(b.stats || {}).map(([label, val]) => (
                           label !== 'license' && (
                              <div key={label} className="min-w-[80px]">
                                 <div className="text-[9px] text-[var(--color-text-muted)] font-black tracking-[0.2em] mb-1">{label}</div>
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
               {filteredBridges.length === 0 && bridgesList.length > 0 && (
                  <div className="py-24 text-center border-t border-[var(--color-border)]">
                     <Search size={48} className="mx-auto mb-6 text-slate-800" />
                     <p className="text-[11px] font-black tracking-[0.6em] text-slate-700">No nodes matching "{searchQuery}"</p>
                  </div>
               )}
               {bridgesList.length === 0 && (
                  <div className="py-24 text-center border-t border-[var(--color-border)]">
                     <Zap size={48} className="mx-auto mb-6 text-slate-800" />
                     <p className="text-[11px] font-black tracking-[0.6em] text-slate-700">No nodes detected in global network</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
