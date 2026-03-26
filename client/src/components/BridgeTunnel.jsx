import React from 'react';
import axios from 'axios';
import { ChevronRight, Plus, Database, RefreshCw } from 'lucide-react';

export default function BridgeTunnel({ 
   selectedBridge, 
   setSelectedBridge, 
   products, 
   selectedTableIdx, 
   setSelectedTableIdx, 
   syncProduct, 
   bridgeTableData, 
   setBridgeTableData, 
   dataLoading, 
   setDataLoading, 
   API_BASE 
}) {
   if (!selectedBridge) return null;
   const bridgeProduct = products.find(p => String(p.id) === String(selectedBridge.product_id));

   return (
      <div className="flex h-full w-full absolute inset-0 animate-in-slide-up bg-[var(--color-bg-main)] z-50 font-['Lexend']">
         {/* Middle Column: Node List */}
         <div className="w-[300px] border-r border-[var(--color-border)] p-8 space-y-8 flex flex-col bg-[var(--color-bg-sidebar)]">
            <div className="flex items-center gap-4">
               <button onClick={() => setSelectedBridge(null)} className="p-2 bg-white/5 border border-[var(--color-border)] rounded-md text-[#707075] hover:text-white transition-all"><ChevronRight size={16} className="rotate-180" /></button>
               <div className="truncate">
                  <h2 className="text-[15px] font-bold text-white truncate max-w-[180px]">{selectedBridge.name}</h2>
                  <p className="text-[11px] font-semibold text-[#a0a0a5] tracking-wider mt-0.5">Tunnel Active</p>
               </div>
            </div>

            {bridgeProduct ? (
               <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-center">
                     <label className="text-[11px] font-bold text-[#606065] tracking-wider">Schema Mapping</label>
                     <button onClick={() => {
                        const newM = { ...bridgeProduct.field_mapping, tables: [...(bridgeProduct.field_mapping?.tables || []), { name: 'new_table', metrics: [] }] };
                        syncProduct({ ...bridgeProduct, field_mapping: newM });
                     }} className="p-1.5 text-[#707075] hover:text-white hover:bg-white/5 rounded-md transition-all"><Plus size={16} /></button>
                  </div>
                  <div className="space-y-1">
                     {(bridgeProduct.field_mapping?.tables || []).map((t, idx) => (
                        <div key={idx} onClick={() => setSelectedTableIdx(idx)} className={`flex items-center justify-between px-4 py-3 rounded-md cursor-pointer transition-all duration-200 ${selectedTableIdx === idx ? 'bg-white/5 text-white border-l-2 border-white' : 'hover:bg-white/[0.02] text-[#a0a0a5]'}`}>
                           <div className="flex items-center gap-3">
                              <Database size={14} className={selectedTableIdx === idx ? 'text-white' : 'text-[#707075]'} />
                              <span className="text-[13px] font-medium">{t.name || 'unnamed_table'}</span>
                           </div>
                           {selectedTableIdx === idx && <ChevronRight size={14} />}
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="flex-1 flex items-center justify-center opacity-20 italic text-xs">No mapping shell found.</div>
            )}

            <div className="pt-6 border-t border-[var(--color-border)]">
               <div className="p-4 bg-white/[0.02] rounded-lg border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold text-[#606065] tracking-wider mb-2">Db Identity</p>
                  <p className="text-[12px] font-mono text-[var(--color-accent)] break-all">{selectedBridge.db_name}</p>
               </div>
            </div>
         </div>

         {/* Right Column: Live Data */}
         <div className="flex-1 p-16 overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
            
            {selectedTableIdx !== null && bridgeProduct?.field_mapping?.tables?.[selectedTableIdx] ? (
               <div className="space-y-10 animate-in-fade h-full flex flex-col relative z-10">
                  <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <h3 className="text-4xl font-black tracking-tighter text-gradient">Node View: {bridgeProduct.field_mapping.tables[selectedTableIdx].name}</h3>
                        <p className="text-[11px] text-slate-500 font-black tracking-[0.3em]">{selectedBridge.name} / Real-time Telemetry Data</p>
                     </div>
                     <button onClick={() => {
                        const tableName = bridgeProduct.field_mapping.tables[selectedTableIdx].name;
                        setDataLoading(true);
                        axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}`)
                           .then(res => setBridgeTableData(res.data))
                           .finally(() => setDataLoading(false));
                     }} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white shadow-xl group"><RefreshCw size={20} className={dataLoading ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'} /></button>
                  </div>

                  {dataLoading ? (
                     <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-30">
                        <RefreshCw size={48} className="animate-spin text-indigo-500" />
                        <div className="text-[11px] font-black tracking-[0.4em]">Syncing Remote Stream...</div>
                     </div>
                  ) : (
                     <div className="flex-1 border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden bg-[var(--color-bg-card-soft)] backdrop-blur-2xl flex flex-col shadow-2xl">
                        <div className="overflow-auto flex-1 custom-scrollbar">
                           <table className="w-full text-left border-collapse">
                              <thead className="sticky top-0 bg-[var(--color-bg-card-soft)] border-b border-[var(--color-border)] z-10">
                                 <tr>
                                    {bridgeTableData && bridgeTableData.length > 0 ? Object.keys(bridgeTableData[0]).map(k => (
                                       <th key={k} className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] tracking-[0.2em]">{k}</th>
                                    )) : <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] tracking-[0.2em]">Field Mapping...</th>}
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--color-border)]/20">
                                 {bridgeTableData?.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-[var(--color-table-row-hover)] transition-colors group">
                                       {Object.values(row).map((val, vIdx) => (
                                          <td key={vIdx} className="px-8 py-5 text-[12px] font-medium text-[var(--color-text-muted)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px] tabular-nums group-hover:text-[var(--color-text-primary)] transition-colors">
                                             {val === null ? <span className="text-[var(--color-text-primary)] italic">null</span> : val.toString()}
                                          </td>
                                       ))}
                                    </tr>
                                 ))}
                                 {(!bridgeTableData || bridgeTableData.length === 0) && (
                                    <tr><td colSpan="100" className="py-32 text-center opacity-20 text-[12px] font-black tracking-[0.5em] text-[var(--color-text-primary)]">No signal telemetry returned.</td></tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-8 animate-in-fade">
                  <div className="p-10 rounded-full bg-white/[0.02] border border-indigo-500/10 shadow-2xl shadow-indigo-600/5"><Database size={64} className="text-indigo-400" /></div>
                  <div className="text-center">
                     <h3 className="text-3xl font-black tracking-tighter text-white mb-2">Deep Tunnel Protocol</h3>
                     <p className="text-[11px] font-black tracking-[0.4em] text-slate-500 max-w-sm mx-auto leading-relaxed">Select a functional architecture block from the left to engage real-time data inspection.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
