import React from 'react';
import axios from 'axios';
import { X, RefreshCw, Briefcase } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export function LogModal({ showLogModal, setShowLogModal, logLoading, logs }) {
    if (!showLogModal) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
            <div className="card-surface w-full max-w-5xl h-[80vh] p-10 relative flex flex-col" style={{ borderRadius: 'var(--radius-sm)' }}>
                <div className="flex justify-between items-start mb-8">
                    <div><h2 className="text-3xl font-black tracking-tighter">Audit Control Center</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Remote Access / Last 100 System Activities</p></div>
                    <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-white/5" style={{ borderRadius: 'var(--radius-sm)' }}><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/5 bg-black/40" style={{ borderRadius: 'var(--radius-sm)' }}>
                    {logLoading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                            <RefreshCw className="animate-spin text-indigo-500" size={32} />
                            <div className="text-[10px] font-black uppercase tracking-[0.2em]">Connecting to Site...</div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#161619] text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 z-10">
                                <tr>
                                    <th className="px-6 py-4">Action / Event</th>
                                    <th className="px-6 py-4">Context</th>
                                    <th className="px-6 py-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] font-medium text-slate-400">
                                {logs.map((log, idx) => (
                                    <tr key={idx} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                                        <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{log.activity || log.action || log.description || 'System Event'}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{log.module || log.context || log.log_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-600 italic">{new Date(log.created_at || log.timestamp || log.datetime).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr><td colSpan="3" className="py-20 text-center text-slate-700 italic">No remote telemetry data available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export function BridgeModal({ showBridgeModal, setShowBridgeModal, bridgeForm, setBridgeForm, clients, products, handleSaveBridge }) {
    if (!showBridgeModal) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
            <div className="card-surface w-full max-w-2xl p-10 relative space-y-8" style={{ borderRadius: 'var(--radius-sm)' }}>
                <div className="flex justify-between items-start">
                    <div><h2 className="text-2xl font-black tracking-tighter">{bridgeForm.id ? 'Edit Site Connection' : 'New Site Connection'}</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Setting up system link</p></div>
                    <button onClick={() => setShowBridgeModal(false)} className="p-2 hover:bg-white/5" style={{ borderRadius: 'var(--radius-sm)' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSaveBridge} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <CustomDropdown
                            label="Customer"
                            placeholder="Select Customer..."
                            value={bridgeForm.client_id}
                            onChange={val => setBridgeForm({ ...bridgeForm, client_id: val })}
                            options={clients.map(c => ({ value: c.id, label: c.name }))}
                        />
                        <CustomDropdown
                            label="Software System"
                            placeholder="Select System..."
                            value={bridgeForm.product_id}
                            onChange={val => {
                                const p = products.find(p => String(p.id) === String(val));
                                const prefix = p ? `${p.name.toLowerCase()}_` : '';
                                setBridgeForm({ ...bridgeForm, product_id: val, db_name: prefix });
                            }}
                            options={products.map(p => ({ value: p.id, label: p.name }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Database Name</label>
                            <input value={bridgeForm.db_name} onChange={e => setBridgeForm({ ...bridgeForm, db_name: e.target.value })} 
                               className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-white/10" 
                               style={{ borderRadius: 'var(--radius-sm)' }}
                               placeholder="e.g. site_db" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Tags (Comma Separated)</label>
                            <input value={bridgeForm.tags} onChange={e => setBridgeForm({ ...bridgeForm, tags: e.target.value })} 
                               className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-white/10" 
                               style={{ borderRadius: 'var(--radius-sm)' }}
                               placeholder="e.g. LIVE, PRODUCTION, REGION-A" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest px-1">Connection Key</label>
                        <input value={bridgeForm.connection_string_name} onChange={e => setBridgeForm({ ...bridgeForm, connection_string_name: e.target.value })} 
                           className="w-full bg-black/40 border border-white/5 px-5 py-4 text-[10px] font-mono outline-none" 
                           style={{ borderRadius: 'var(--radius-sm)' }}
                           placeholder="e.g. LIVE_CREDENTIALS" />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 text-[11px] font-black uppercase tracking-widest transition-all" style={{ borderRadius: 'var(--radius-sm)' }}>
                        {bridgeForm.id ? 'Save Connection' : 'Create Connection'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function ClientModal({ showClientModal, setShowClientModal, clientForm, setClientForm, API_BASE, fetchData }) {
    if (!showClientModal) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
            <div className="card-surface w-full max-w-md p-10 relative space-y-8 animate-in-slide-up border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.15)] bg-[#111114]/90" style={{ borderRadius: 'var(--radius-sm)' }}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]" style={{ borderRadius: 'var(--radius-md)' }}><Briefcase size={22} /></div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-white">Register Client</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Initialize New Managed Entity</p>
                        </div>
                    </div>
                    <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-white/5 text-slate-500 hover:text-white transition-colors" style={{ borderRadius: 'var(--radius-sm)' }}><X size={20} /></button>
                </div>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (clientForm.name) {
                        try {
                            await axios.post(`${API_BASE}/clients`, clientForm);
                            setShowClientModal(false);
                            fetchData();
                        } catch(e) { alert("Failed to register client"); }
                    }
                }} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Legal Entity Name</label>
                        <input 
                            autoFocus 
                            required 
                            value={clientForm.name} 
                            onChange={e => setClientForm({ ...clientForm, name: e.target.value })} 
                            className="w-full bg-black/40 border border-white/5 px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700 text-white" 
                            style={{ borderRadius: 'var(--radius-sm)' }}
                            placeholder="e.g. SOT, PCEA JoyValley" 
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 py-4 text-[11px] font-black uppercase tracking-widest transition-all text-slate-400" style={{ borderRadius: 'var(--radius-sm)' }}>Cancel</button>
                        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-4 text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] text-white" style={{ borderRadius: 'var(--radius-sm)' }}>Register Site</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
