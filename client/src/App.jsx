import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Globe, Server, Activity, Shield, PieChart, Bell, Search,
  MessageSquare, Plus, RefreshCw, X, Trash2, Settings,
  LayoutDashboard, LogOut, Sun, Moon, Database, Key,
  ChevronRight, ChevronDown, Calendar, User, Eye, AlertCircle,
  ExternalLink, Pencil, Briefcase, Boxes, MoreVertical, MapPin
} from 'lucide-react';

const API_BASE = '/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/login`, { username, password });
      if (res.data.success) onLogin(res.data.token);
    } catch (err) { setError('Invalid credentials'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0c0c0e] flex items-center justify-center">
      <div className="card-surface w-full max-w-md p-10 border-white/5 bg-[#111114]/80 backdrop-blur-2xl">
        <div className="text-center mb-10">
           <div className="text-4xl font-black text-white tracking-tighter mb-2">uix.</div>
           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Infrastructure Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Operator ID</label>
              <input required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" placeholder="admin" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Access Protocol</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" placeholder="••••••••" />
           </div>
           {error && <div className="text-[10px] text-rose-500 font-bold bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">{error}</div>}
           <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all">
              {loading ? <RefreshCw className="animate-spin inline-block mr-2" size={14} /> : 'Authorize Session'}
           </button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ activeView, setView, onLogout, setSelectedProduct, setSelectedBridge, setSelectedTableIdx }) {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'handshakes', label: 'Sites', icon: MapPin },
    { id: 'products', label: 'Software Products', icon: Boxes },
    { id: 'clients', label: 'Clients', icon: Briefcase },
  ];
  return (
    <div className="w-[240px] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="text-2xl font-black text-[var(--color-text-primary)] tracking-tighter cursor-pointer" onClick={() => { setView('dashboard'); setSelectedProduct(null); setSelectedBridge(null); setSelectedTableIdx(null); }}>uix.</div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menu.map(i => (
          <div key={i.id} onClick={() => { setView(i.id); setSelectedProduct(null); setSelectedBridge(null); setSelectedTableIdx(null); }} className={`flex items-center gap-3 sidebar-item ${activeView === i.id ? 'active' : ''}`}>
            <i.icon size={18} />
            <span>{i.label}</span>
          </div>
        ))}
      </nav>
      <div className="p-6 mt-auto border-t border-[var(--color-border)]">
        <button onClick={onLogout} className="flex items-center gap-3 text-slate-500 hover:text-rose-500 text-xs font-bold transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

function Dashboard({ bridges }) {
  const bridgesList = Array.isArray(bridges) ? bridges : [];
  const stats = [
    { label: 'Network Reach', value: bridgesList.reduce((a, b) => a + (b.stats?.customers || 0), 0), icon: Globe, color: 'text-indigo-500' },
    { label: 'Active Sites', value: bridgesList.filter(b => b.status === 'Online').length, icon: Activity, color: 'text-emerald-500' },
    { label: 'Site Interruptions', value: bridgesList.filter(b => b.status === 'Offline').length, icon: AlertCircle, color: 'text-rose-500' },
  ];
  return (
    <div className="p-10 space-y-8 animate-in-fade">
      <div className="grid grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.label} className="card-surface p-8">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${s.color}`}><s.icon size={24} /></div>
            </div>
            <div className="text-3xl font-black tracking-tighter">{s.value.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card-surface p-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Product Deployment Status</h3>
        <div className="space-y-4">
          {bridgesList.map(b => (
            <div key={b.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${b.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 pulse'}`} />
                <div>
                  <div className="text-xs font-bold tracking-tight">{b.name}</div>
                  <div className="text-[9px] text-slate-500 font-medium uppercase mt-0.5">{b.stats?.license || 'Scanning...'}</div>
                </div>
              </div>
              <div className="flex gap-8 text-right">
                {Object.entries(b.stats || {}).map(([label, val]) => (
                  label !== 'license' && (
                    <div key={label}>
                      <div className="text-[9px] text-slate-600 font-bold uppercase">{label}</div>
                      <div className="text-xs font-bold">{val}</div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [view, setView] = useState('dashboard');
  const [bridges, setBridges] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [bridgeForm, setBridgeForm] = useState({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '' });
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBridge, setSelectedBridge] = useState(null);
  const [selectedTableIdx, setSelectedTableIdx] = useState(null);
  const [bridgeTableData, setBridgeTableData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Global Auth Config
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (view === 'handshakes' && selectedBridge && selectedTableIdx !== null) {
      const p = products.find(prod => String(prod.id) === String(selectedBridge.product_id));
      const tableName = p?.field_mapping?.tables?.[selectedTableIdx]?.name;
      if (tableName) {
        setDataLoading(true);
        axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}`)
          .then(res => setBridgeTableData(res.data))
          .catch(() => setBridgeTableData([]))
          .finally(() => setDataLoading(false));
      }
    } else {
      setBridgeTableData(null);
    }
  }, [view, selectedBridge, selectedTableIdx, products]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSelectedProduct(null);
    setSelectedBridge(null);
    setSelectedTableIdx(null);
  };

  const syncProduct = async (updatedProd) => {
    try {
       await axios.put(`${API_BASE}/products/${updatedProd.id}`, updatedProd);
       const res = await axios.get(`${API_BASE}/products`);
       setProducts(res.data);
       const fresh = res.data.find(p => p.id === updatedProd.id);
       if (selectedProduct && selectedProduct.id === fresh.id) setSelectedProduct(fresh);
       if (selectedBridge) {
          // If we were editing a product through a bridge, we don't need to do anything special here as the bridge's link is via product_id
       }
    } catch (e) { alert("Sync Failed"); }
  }

  const [logs, setLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logLoading, setLogLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [b, c, p] = await Promise.all([
        axios.get(`${API_BASE}/analysis`),
        axios.get(`${API_BASE}/clients`),
        axios.get(`${API_BASE}/products`)
      ]);
      setBridges(Array.isArray(b.data) ? b.data : []);
      setClients(Array.isArray(c.data) ? c.data : []);
      setProducts(Array.isArray(p.data) ? p.data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchLogs = async (id) => {
    setLogLoading(true);
    setShowLogModal(true);
    try {
      const res = await axios.get(`${API_BASE}/client-products/${id}/logs`);
      setLogs(res.data);
    } catch (e) { alert("Failed to reach remote logs"); }
    setLogLoading(false);
  };

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const handleEditProduct = async (prod) => {
    setSelectedProduct(prod);
    setSelectedTableIdx(null);
  };

  const handleSaveBridge = async (e) => {
    e.preventDefault();
    try {
      if (bridgeForm.id) {
        await axios.put(`${API_BASE}/client-products/${bridgeForm.id}`, bridgeForm);
      } else {
        await axios.post(`${API_BASE}/client-products`, bridgeForm);
      }
      setShowBridgeModal(false);
      setBridgeForm({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '' });
      fetchData();
    } catch (e) { alert("Action Failed"); }
  };

  const deleteBridge = async (id) => {
    if (confirm("Disconnect Pipeline?")) {
      await axios.delete(`${API_BASE}/client-products/${id}`);
      fetchData();
    }
  };

  const renderBridgeTunnel = () => {
    if (!selectedBridge) return null;
    const bridgeProduct = products.find(p => String(p.id) === String(selectedBridge.product_id));
    
    return (
       <div className="flex h-full w-full absolute inset-0 animate-in-slide-up bg-[#0c0c0e] z-50">
          {/* Middle Column: Node List */}
          <div className="w-[300px] border-r border-white/5 p-8 space-y-8 flex flex-col">
             <div className="flex items-center gap-4">
                <button onClick={() => setSelectedBridge(null)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><ChevronRight size={18} className="rotate-180" /></button>
                <div><h2 className="text-lg font-black tracking-tight">{selectedBridge.name}</h2><p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Handshake Tunnel</p></div>
             </div>

             {bridgeProduct ? (
                <div className="space-y-4 flex-1">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active Mapping Shell</label>
                      <button onClick={() => {
                         const newM = { ...bridgeProduct.field_mapping, tables: [...(bridgeProduct.field_mapping?.tables || []), {name: 'new_table', metrics: []}] };
                         syncProduct({ ...bridgeProduct, field_mapping: newM });
                      }} className="p-1 hover:text-indigo-400 text-slate-600 transition-colors"><Plus size={16} /></button>
                   </div>
                   <div className="space-y-1">
                      {(bridgeProduct.field_mapping?.tables || []).map((t, idx) => (
                         <div key={idx} onClick={() => setSelectedTableIdx(idx)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${selectedTableIdx === idx ? 'bg-indigo-600 text-white' : 'hover:bg-white/[0.03] text-slate-400'}`}>
                            <div className="flex items-center gap-3">
                               <Database size={14} className={selectedTableIdx === idx ? 'text-white' : 'text-slate-600'} />
                               <span className="text-xs font-bold">{t.name || 'unnamed_table'}</span>
                            </div>
                            {selectedTableIdx === idx && <ChevronRight size={14} />}
                         </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="flex-1 text-center py-20 opacity-20">No product mapping found for this node.</div>
             )}

             <div className="pt-8 border-t border-white/5">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Db Tunnel</p>
                   <p className="text-[10px] font-mono font-bold text-indigo-400">{selectedBridge.db_name}</p>
                </div>
             </div>
          </div>

          {/* Right Column: Live Data */}
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
             {selectedTableIdx !== null && bridgeProduct?.field_mapping?.tables?.[selectedTableIdx] ? (
                <div className="space-y-8 animate-in-fade h-full flex flex-col">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black tracking-tighter">Site View: {bridgeProduct.field_mapping.tables[selectedTableIdx].name}</h3>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest">{selectedBridge.name} / Interrogating Last 20 Records</p>
                      </div>
                      <button onClick={() => {
                         const tableName = bridgeProduct.field_mapping.tables[selectedTableIdx].name;
                         setDataLoading(true);
                         axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}`)
                           .then(res => setBridgeTableData(res.data))
                           .finally(() => setDataLoading(false));
                      }} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white"><RefreshCw size={18} className={dataLoading ? 'animate-spin' : ''} /></button>
                   </div>

                   {dataLoading ? (
                      <div className="flex-1 flex items-center justify-center opacity-20"><RefreshCw size={48} className="animate-spin" /></div>
                   ) : (
                      <div className="flex-1 border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] flex flex-col">
                         <div className="overflow-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                               <thead className="sticky top-0 bg-[#111114] border-b border-white/5 z-10">
                                  <tr>
                                     {bridgeTableData && bridgeTableData.length > 0 ? Object.keys(bridgeTableData[0]).map(k => (
                                        <th key={k} className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">{k}</th>
                                     )) : <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Physical Schema Mapping...</th>}
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-white/[0.03]">
                                  {bridgeTableData?.map((row, rIdx) => (
                                     <tr key={rIdx} className="hover:bg-white/[0.01] transition-colors">
                                        {Object.values(row).map((val, vIdx) => (
                                           <td key={vIdx} className="px-6 py-4 text-[11px] font-medium text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                              {val === null ? <span className="text-slate-700 italic">null</span> : val.toString()}
                                           </td>
                                        ))}
                                     </tr>
                                  ))}
                                  {(!bridgeTableData || bridgeTableData.length === 0) && (
                                     <tr><td colSpan="100" className="py-20 text-center opacity-20 text-[10px] font-bold uppercase tracking-[0.3em]">No remote telemetry returned</td></tr>
                                  )}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   )}
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                   <div className="p-8 rounded-full bg-white/5"><Database size={48} /></div>
                   <div className="text-center">
                      <h3 className="text-xl font-black tracking-tight">Interrogation Portal</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Select a database node to view real-time table telemetry from this relay.</p>
                   </div>
                </div>
             )}
          </div>
       </div>
    );
  };

  if (!isAuthenticated) return <Login onLogin={(tok) => { 
    localStorage.setItem('token', tok); 
    axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    setIsAuthenticated(true); 
  }} />;

  return (
    <div className="flex min-h-screen bg-[#0c0c0e] text-white">
      <Sidebar 
        activeView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        setSelectedProduct={setSelectedProduct}
        setSelectedBridge={setSelectedBridge}
        setSelectedTableIdx={setSelectedTableIdx}
      />
      <div className="flex-1 ml-[240px] relative">
        <header className="h-[80px] border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#0c0c0e]/80 backdrop-blur-xl z-40">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10"><PieChart size={20} /></div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">SOC / Infrastructure Monitoring</div>
           </div>
           <button onClick={fetchData} className="p-3 rounded-2xl hover:bg-white/5 transition-colors text-slate-500 hover:text-white"><RefreshCw size={18} /></button>
        </header>

        {view === 'dashboard' && <Dashboard bridges={bridges} />}
        
        {view === 'handshakes' && !selectedBridge && (
          <div className="p-8 space-y-8 animate-in-fade">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight">Active Sites</h1>
                <div className="flex gap-2">
                   <button className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 hover:bg-white/5 transition-all">Connection Status</button>
                   <button onClick={() => {
                        setBridgeForm({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '' });
                        setShowBridgeModal(true);
                   }} className="px-5 py-2.5 bg-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Add New Site</button>
                </div>
             </div>

             <div className="flex items-center gap-6 border-b border-white/5 pb-1">
               {['All Nodes', 'Active', 'Down', 'Experimental'].map((tab, idx) => (
                 <button key={tab} className={`pb-4 text-xs font-bold tracking-tight px-1 relative ${idx === 0 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                    {tab} <span className="ml-1 opacity-40 font-medium">({idx === 0 ? bridges.length : 0})</span>
                    {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                 </button>
               ))}
             </div>

             <div className="flex items-center gap-3">
                <div className="relative group">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
                   <input placeholder="Search Handshakes..." className="bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-6 py-2.5 text-xs outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all w-[300px]" />
                </div>
             </div>

             <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                      <tr>
                         <th className="px-8 py-5 w-10"><input type="checkbox" className="opacity-30" /></th>
                         <th className="px-6 py-5">Site Instance</th>
                         <th className="px-6 py-5">Connection Hash</th>
                         <th className="px-6 py-5">Bridge Status</th>
                         <th className="px-8 py-5 w-20"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/[0.03]">
                      {bridges.map(b => (
                         <tr key={b.id} className="cursor-pointer hover:bg-white/[0.02] transition-colors group" onClick={() => { 
                            setSelectedBridge(b); 
                            const p = products.find(prod => String(prod.id) === String(b.product_id));
                            setSelectedTableIdx((p?.field_mapping?.tables?.length > 0) ? 0 : null); 
                         }}>
                            <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="opacity-10 group-hover:opacity-30" /></td>
                            <td className="px-6 py-6 font-bold">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                                     <Activity size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-xs">{b.name}</span>
                                     <span className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-tighter">{b.stats?.license || 'Scanning Network...'}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6 font-mono text-[10px] text-slate-500">
                               {b.db_name || 'LOCAL_DB'}
                            </td>
                            <td className="px-6 py-6">
                               <div className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  b.status === 'Online' 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                               }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${b.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse'}`} />
                                  {b.status === 'Online' ? 'Healthy' : 'Interrupted'}
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={(e) => { e.stopPropagation(); fetchLogs(b.id); }} className="p-2 text-slate-700 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="View Logs"><Eye size={16} /></button>
                                  <button onClick={(e) => {
                                      e.stopPropagation();
                                      setBridgeForm({ 
                                          id: b.id, 
                                          client_id: b.client_id?.toString() || '', 
                                          product_id: b.product_id?.toString() || '', 
                                          db_name: b.db_name || '', 
                                          connection_string_name: b.connection_string_name || '' 
                                      });
                                      setShowBridgeModal(true);
                                  }} className="p-2 text-slate-700 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all" title="Edit Handshake"><Pencil size={16} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteBridge(b.id); }} className="p-2 text-slate-700 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-all" title="Disconnect Pipeline"><Trash2 size={16} /></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                      {bridges.length === 0 && (
                         <tr><td colSpan="5" className="py-20 text-center text-slate-700 italic text-xs">No active sites connected yet.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {view === 'handshakes' && renderBridgeTunnel()}

        {showLogModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
            <div className="card-surface w-full max-w-5xl h-[80vh] p-10 relative flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div><h2 className="text-3xl font-black tracking-tighter">Audit Control Center</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Remote Access / Last 100 System Directives</p></div>
                <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/5 rounded-2xl bg-black/40">
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
        )}

        {view === 'products' && !selectedProduct && (
          <div className="p-8 space-y-8 animate-in-fade">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black tracking-tight">Software Products</h1>
              <div className="flex gap-2">
                 <button className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 hover:bg-white/5 transition-all">Batch Edit</button>
                 <button className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 hover:bg-white/5 transition-all">Settings</button>
                 <button className="px-5 py-2.5 bg-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">New Product</button>
              </div>
            </div>

            <div className="flex items-center gap-6 border-b border-white/5 pb-1">
              {['All', 'Active', 'Inactive', 'Legacy'].map((tab, idx) => (
                <button key={tab} className={`pb-4 text-xs font-bold tracking-tight px-1 relative ${idx === 0 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                   {tab} <span className="ml-1 opacity-40 font-medium">({idx === 0 ? products.length : 0})</span>
                   {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
               <div className="relative group">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input placeholder="Search Products..." className="bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-6 py-2.5 text-xs outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all w-[300px]" />
               </div>
            </div>

            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                     <tr>
                        <th className="px-8 py-5 w-10"><input type="checkbox" className="opacity-30" /></th>
                        <th className="px-6 py-5">Product Title</th>
                        <th className="px-6 py-5">Core Metrics</th>
                        <th className="px-6 py-5">Deployments</th>
                        <th className="px-6 py-5 text-right px-8">Status</th>
                        <th className="px-8 py-5 w-20"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                     {products.map(p => (
                        <tr key={p.id} className="cursor-pointer hover:bg-white/[0.02] transition-colors group" onClick={() => handleEditProduct(p)}>
                           <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="opacity-10 group-hover:opacity-30" /></td>
                           <td className="px-6 py-6 font-bold">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                                    <Database size={18} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs">{p.name}</span>
                                    <span className="text-[10px] text-slate-500 font-medium mt-0.5 truncate max-w-[200px]">{p.description}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-6 font-medium">
                              <div className="flex flex-wrap gap-1">
                                 {(p.field_mapping?.tables || []).map((t, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-white/[0.03] rounded-md text-[8px] font-bold text-slate-500 uppercase">{t.name}</span>
                                 ))}
                                 {(!p.field_mapping?.tables || p.field_mapping.tables.length === 0) && <span className="text-[8px] text-slate-700 italic">No Metrics</span>}
                              </div>
                           </td>
                           <td className="px-6 py-6 font-mono text-[10px] text-slate-500">
                             {bridges.filter(b => b.product_id === p.id).length} Handshakes
                           </td>
                           <td className="px-6 py-6 text-right px-8">
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                             </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2 text-slate-700 hover:text-white hover:bg-white/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {view === 'products' && selectedProduct && (
           <div className="flex h-full w-full absolute inset-0 animate-in-slide-up bg-[#0c0c0e] z-50">
              {/* Product Sub-Sidebar / Table Names (Middle Column) */}
              <div className="w-[300px] border-r border-white/5 p-8 space-y-8 flex flex-col">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><ChevronRight size={18} className="rotate-180" /></button>
                    <div><h2 className="text-lg font-black tracking-tight">{selectedProduct.name}</h2><p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Configuration Shell</p></div>
                 </div>

                 <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Database Tables</label>
                       <button onClick={() => {
                          const newM = { ...selectedProduct.field_mapping, tables: [...(selectedProduct.field_mapping?.tables || []), {name: 'new_table', metrics: []}] };
                          syncProduct({ ...selectedProduct, field_mapping: newM });
                       }} className="p-1 hover:text-indigo-400 text-slate-600 transition-colors"><Plus size={16} /></button>
                    </div>
                    <div className="space-y-1">
                       {(selectedProduct.field_mapping?.tables || []).map((t, idx) => (
                          <div key={idx} onClick={() => setSelectedTableIdx(idx)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${selectedTableIdx === idx ? 'bg-indigo-600 text-white' : 'hover:bg-white/[0.03] text-slate-400'}`}>
                             <div className="flex items-center gap-3">
                                <Database size={14} className={selectedTableIdx === idx ? 'text-white' : 'text-slate-600'} />
                                <span className="text-xs font-bold">{t.name || 'unnamed_table'}</span>
                             </div>
                             {selectedTableIdx === idx && <ChevronRight size={14} />}
                          </div>
                       ))}
                       {(selectedProduct.field_mapping?.tables || []).length === 0 && (
                          <p className="text-[10px] text-slate-700 italic px-4 py-8 text-center border-2 border-dashed border-white/5 rounded-3xl">No tables defined.</p>
                       )}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <button onClick={() => { /* Delete Product Logic */ }} className="flex items-center gap-3 text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-widest transition-colors"><Trash2 size={16} /> Delete Product</button>
                 </div>
              </div>

              {/* Table Metrics / Field Mapping (Right Column) */}
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                 {selectedTableIdx !== null ? (
                    <div className="max-w-4xl space-y-12 animate-in-fade">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <h3 className="text-2xl font-black tracking-tighter">Table: {selectedProduct.field_mapping.tables[selectedTableIdx].name}</h3>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest">Field Definitions & Analytics Filters</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => {
                                const newT = [...selectedProduct.field_mapping.tables];
                                newT[selectedTableIdx].metrics = [...(newT[selectedTableIdx].metrics || []), {label: 'New Metric', where: ''}];
                                syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                             }} className="bg-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Add Field Metric</button>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Logical Table Name (DB Mapping)</label>
                             <input value={selectedProduct.field_mapping.tables[selectedTableIdx].name} onChange={e => {
                                const newT = [...selectedProduct.field_mapping.tables];
                                newT[selectedTableIdx].name = e.target.value;
                                syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                             }} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-sm font-mono outline-none focus:border-indigo-500/30 transition-all" />
                          </div>

                          <div className="pt-8 space-y-6">
                             <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Mapped Metrics</h4>
                             <div className="space-y-3">
                                {(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).map((m, mIdx) => (
                                   <div key={mIdx} className="grid grid-cols-12 gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-3xl group">
                                      <div className="col-span-5 space-y-2">
                                         <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Label</label>
                                         <input value={m.label} onChange={e => {
                                            const newT = [...selectedProduct.field_mapping.tables];
                                            newT[selectedTableIdx].metrics[mIdx].label = e.target.value;
                                            syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                         }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
                                      </div>
                                      <div className="col-span-6 space-y-2">
                                         <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Where (SQL Filter)</label>
                                         <input value={m.where} onChange={e => {
                                            const newT = [...selectedProduct.field_mapping.tables];
                                            newT[selectedTableIdx].metrics[mIdx].where = e.target.value;
                                            syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                         }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono outline-none" placeholder="deleted_at IS NULL" />
                                      </div>
                                      <div className="col-span-1 flex items-end justify-center pb-2">
                                         <button onClick={() => {
                                            const newT = [...selectedProduct.field_mapping.tables];
                                            newT[selectedTableIdx].metrics = newT[selectedTableIdx].metrics.filter((_, i) => i !== mIdx);
                                            syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                         }} className="p-3 text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                      </div>
                                   </div>
                                ))}
                                {(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).length === 0 && (
                                   <div className="py-12 text-center opacity-30 italic text-xs">No metrics configured for this table.</div>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                       <div className="p-8 rounded-full bg-white/5"><Database size={48} /></div>
                       <div className="text-center">
                          <h3 className="text-xl font-black tracking-tight">Table Details</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Select a database table to manage its schema mapping.</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {view === 'clients' && (
          <div className="p-8 space-y-8 animate-in-fade">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight">Clients & Entities</h1>
                <div className="flex gap-2">
                   <button className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 hover:bg-white/5 transition-all">Export Directory</button>
                   <button onClick={() => {
                      const name = prompt("Enter Client Entity Name:");
                      if (name) {
                         axios.post(`${API_BASE}/clients`, { name }).then(() => fetchData());
                      }
                   }} className="px-5 py-2.5 bg-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Register New Client</button>
                </div>
             </div>

             <div className="flex items-center gap-6 border-b border-white/5 pb-1">
               {['Managed', 'Onboarding', 'Platinum', 'Archived'].map((tab, idx) => (
                 <button key={tab} className={`pb-4 text-xs font-bold tracking-tight px-1 relative ${idx === 0 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                    {tab} <span className="ml-1 opacity-40 font-medium">({idx === 0 ? clients.length : 0})</span>
                    {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                 </button>
               ))}
             </div>

             <div className="flex items-center gap-3">
                <div className="relative group">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
                   <input placeholder="Search Client Directory..." className="bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-6 py-2.5 text-xs outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all w-[300px]" />
                </div>
             </div>

             <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                      <tr>
                         <th className="px-8 py-5 w-10"><input type="checkbox" className="opacity-30" /></th>
                         <th className="px-6 py-5">Client Entity</th>
                         <th className="px-6 py-5">Active Deployments</th>
                         <th className="px-6 py-5">Management Status</th>
                         <th className="px-8 py-5 w-20"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/[0.03]">
                      {clients.map(c => (
                         <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6"><input type="checkbox" className="opacity-10 group-hover:opacity-30" /></td>
                            <td className="px-6 py-6 font-bold">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-500 transition-colors">
                                     <Briefcase size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-xs">{c.name}</span>
                                     <span className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-widest">ID: {c.id.toString().padStart(4, '0')}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6 font-medium">
                               <div className="flex items-center gap-2">
                                  <div className="px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-[10px] font-bold text-slate-400">
                                     {bridges.filter(b => b.client_id === c.id).length} Active Handshakes
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                  Managed Entity
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-2 text-slate-700 hover:text-white hover:bg-white/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                            </td>
                         </tr>
                      ))}
                      {clients.length === 0 && (
                         <tr><td colSpan="5" className="py-20 text-center text-slate-700 italic text-xs">No client entities registered.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}


        {showBridgeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
            <div className="card-surface w-full max-w-2xl p-10 relative space-y-8">
              <div className="flex justify-between items-start">
                <div><h2 className="text-2xl font-black tracking-tighter">{bridgeForm.id ? 'Refine Site Link' : 'New Site Connection'}</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Linking Remote System Instance</p></div>
                <button onClick={() => setShowBridgeModal(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveBridge} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Target Client</label>
                    <select value={bridgeForm.client_id} onChange={e => setBridgeForm({...bridgeForm, client_id: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none">
                      <option value="">Select Client...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Software System</label>
                    <select value={bridgeForm.product_id} onChange={e => setBridgeForm({...bridgeForm, product_id: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none">
                      <option value="">Select Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Remote Db Name</label>
                    <input value={bridgeForm.db_name} onChange={e => setBridgeForm({...bridgeForm, db_name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none" placeholder="e.g. glide_prod" />
                 </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest px-1">ENV Bridge Override Key</label>
                  <input value={bridgeForm.connection_string_name} onChange={e => setBridgeForm({...bridgeForm, connection_string_name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-mono outline-none" placeholder="e.g. CLIENT_SQL_KEY" />
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                  {bridgeForm.id ? 'Synchronize Handshake' : 'Initiate Secure Bridge'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
