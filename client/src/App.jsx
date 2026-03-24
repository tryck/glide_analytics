import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Globe, Server, Activity, Shield, PieChart, Bell, Search,
   MessageSquare, Plus, RefreshCw, X, Trash2, Settings,
   LayoutDashboard, LogOut, Sun, Moon, Database, Key,
   ChevronRight, ChevronDown, Calendar, User, Eye, AlertCircle,
   ExternalLink, Pencil, Briefcase, Boxes, MoreVertical, MapPin,
   Lock as LockIcon, Unlock as UnlockIcon,
   FileText, Image, FileCode, Palette, Puzzle, Users
} from 'lucide-react';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
   ? 'http://localhost:3001/api'
   : '/api';

function CustomDropdown({ options, value, onChange, placeholder, label }) {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const selectedOption = options.find(o => String(o.value) === String(value));
   const containerRef = React.useRef(null);

   const filteredOptions = options.filter(o =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
   );

   useEffect(() => {
      const handleClickOutside = (e) => {
         if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   useEffect(() => {
      if (!isOpen) setSearchTerm('');
   }, [isOpen]);

   return (
      <div className="space-y-2 relative" ref={containerRef}>
         {label && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>}
         <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs flex items-center justify-between cursor-pointer transition-all hover:bg-white/[0.03] ${isOpen ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : ''}`}
         >
            <span className={selectedOption ? 'text-white font-medium' : 'text-slate-500'}>
               {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
         </div>

         {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1e]/95 border border-white/10 rounded-2xl overflow-hidden z-[200] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in-fade backdrop-blur-3xl">
               {options.length > 5 && (
                  <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                     <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                           autoFocus
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                           className="w-full bg-black/20 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-[11px] outline-none focus:border-indigo-500/30 transition-all font-medium"
                           placeholder="Filter options..."
                           onClick={e => e.stopPropagation()}
                        />
                     </div>
                  </div>
               )}
               <div className="max-h-[220px] overflow-y-auto custom-scrollbar p-1.5">
                  {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
                     <div
                        key={opt.value}
                        onClick={(e) => {
                           e.stopPropagation();
                           onChange(opt.value);
                           setIsOpen(false);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between group ${String(opt.value) === String(value) ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                     >
                        <span>{opt.label}</span>
                        {String(opt.value) === String(value) && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />}
                     </div>
                  )) : (
                     <div className="py-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest italic px-4">No matches found</div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

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
      } catch (err) { setError('Invalid credentials or access denied.'); }
      setLoading(false);
   };

   return (
      <div className="fixed inset-0 bg-[var(--color-bg-main)] flex items-center justify-center overflow-hidden font-['Lexend']">
         <div className="card-surface w-full max-w-[400px] p-12 border-[var(--color-border)] bg-[var(--color-bg-card)] relative z-10 animate-in-fade">
            <div className="text-center mb-10">
               <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Admin Portal</h2>
               <p className="text-[11px] text-[#a0a0a5] uppercase tracking-wider font-semibold">DigitalGlide Analytics</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#606065] uppercase tracking-wider">Operator Identity</label>
                  <input required value={username} onChange={e => setUsername(e.target.value)} className="input-field" placeholder="Username" />
               </div>
               
               <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#606065] uppercase tracking-wider">Access Protocol</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
               </div>
               
               {error && (
                  <div className="text-[11px] text-rose-400 font-bold text-center bg-rose-500/5 py-3 rounded-md border border-rose-500/10">
                     {error}
                  </div>
               )}
               
               <button type="submit" disabled={loading} className="w-full bg-[var(--color-accent)] hover:opacity-90 text-white py-4 rounded-md text-[13px] font-bold transition-all active:scale-[0.98]">
                  {loading ? <RefreshCw className="animate-spin inline-block mr-2" size={14} /> : 'Authorize Connection'}
               </button>
            </form>
         </div>
      </div>
   );
}

function Sidebar({ activeView, setView, onLogout, setSelectedProduct, setSelectedBridge, setSelectedTableIdx }) {
   const menuGroups = [
      {
         title: 'CORE SYSTEMS',
         items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'handshakes', label: 'Nodes', icon: MapPin },
            { id: 'clients', label: 'Registry', icon: Briefcase },
            { id: 'products', label: 'Artifacts', icon: Boxes },
         ]
      },
      {
         title: 'MANAGEMENT',
         items: [
            { id: 'posts', label: 'Posts', icon: FileText },
            { id: 'media', label: 'Media', icon: Image },
            { id: 'pages', label: 'Pages', icon: FileCode },
            { id: 'comments', label: 'Comments', icon: MessageSquare },
         ]
      },
      {
         title: 'INFRASTRUCTURE',
         items: [
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'plugins', label: 'Plugins', icon: Puzzle },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
         ]
      }
   ];

   return (
      <aside className="w-[260px] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] h-screen flex flex-col fixed left-0 top-0 z-50 font-['Lexend'] overflow-y-auto custom-scrollbar">
         <div className="p-8 pb-4 text-2xl font-black text-white tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => { setView('dashboard'); setSelectedProduct(null); setSelectedBridge(null); setSelectedTableIdx(null); }}>
             <span>DigitalGlide</span>
         </div>
         
         <div className="flex-1 space-y-8 pb-10">
            {menuGroups.map(group => (
               <div key={group.title}>
                  <div className="nav-group-title">{group.title}</div>
                  <nav className="space-y-0.5">
                     {group.items.map(i => (
                        <div key={i.id} onClick={() => { setView(i.id); setSelectedProduct(null); setSelectedBridge(null); setSelectedTableIdx(null); }} className={`sidebar-item ${activeView === i.id ? 'active' : ''}`}>
                           <i.icon size={17} className={activeView === i.id ? 'text-white' : 'text-[#707075]'} />
                           <span>{i.label}</span>
                        </div>
                     ))}
                  </nav>
               </div>
            ))}
         </div>
         
         <div onClick={onLogout} className="mt-auto px-6 py-5 border-t border-[var(--color-border)] flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all bg-white/[0.01]">
             <div className="w-9 h-9 rounded-full bg-[#555] flex items-center justify-center text-white font-bold text-sm shadow-sm">R</div>
             <div className="flex flex-col flex-1 truncate">
                 <span className="text-[13px] font-semibold text-white leading-none">Root Admin</span>
                 <span className="text-[11px] text-[#707075] font-normal truncate">admin@digitalglide.io</span>
             </div>
             <LogOut size={14} className="text-[#707075]" />
         </div>
      </aside>
   );
}

function Dashboard({ bridges }) {
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

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
   const [view, setView] = useState('dashboard');
   const [bridges, setBridges] = useState([]);
   const [clients, setClients] = useState([]);
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showBridgeModal, setShowBridgeModal] = useState(false);
   const [bridgeForm, setBridgeForm] = useState({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '', tags: '' });
   const [showClientModal, setShowClientModal] = useState(false);
   const [clientForm, setClientForm] = useState({ name: '' });

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
         setProducts(Array.isArray(res.data) ? res.data : []);
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
         console.log("[Target] Site Data Source:", API_BASE);
         const [b, c, p] = await Promise.all([
            axios.get(`${API_BASE}/analysis`),
            axios.get(`${API_BASE}/clients`),
            axios.get(`${API_BASE}/products`)
         ]);
         console.log("Analysis Data:", b.data);
         console.log("Clients Data:", c.data);
         console.log("Products Data:", p.data);
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
         setBridgeForm({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '', tags: '' });
         fetchData();
      } catch (e) { alert("Action Failed"); }
   };

   const toggleLock = async (id) => {
      try {
         await axios.post(`${API_BASE}/sites/${id}/toggle-lock`);
         fetchData();
      } catch (e) { alert("Lock Toggle Failed: " + (e.response?.data?.error || e.message)); }
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
         <div className="flex h-full w-full absolute inset-0 animate-in-slide-up bg-[var(--color-bg-main)] z-50 font-['Lexend']">
            {/* Middle Column: Node List */}
            <div className="w-[300px] border-r border-[var(--color-border)] p-8 space-y-8 flex flex-col bg-[var(--color-bg-sidebar)]">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedBridge(null)} className="p-2 bg-white/5 border border-[var(--color-border)] rounded-md text-[#707075] hover:text-white transition-all"><ChevronRight size={16} className="rotate-180" /></button>
                  <div className="truncate">
                     <h2 className="text-[15px] font-bold text-white truncate max-w-[180px]">{selectedBridge.name}</h2>
                     <p className="text-[11px] font-semibold text-[#a0a0a5] uppercase tracking-wider mt-0.5">Tunnel Active</p>
                  </div>
               </div>

               {bridgeProduct ? (
                  <div className="space-y-6 flex-1">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-[#606065] uppercase tracking-wider">Schema Mapping</label>
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
                     <p className="text-[10px] font-bold text-[#606065] uppercase tracking-wider mb-2">Db Identity</p>
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
                           <h3 className="text-4xl font-black tracking-tighter text-gradient uppercase">Node View: {bridgeProduct.field_mapping.tables[selectedTableIdx].name}</h3>
                           <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em]">{selectedBridge.name} / Real-time Telemetry Data</p>
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
                           <div className="text-[11px] font-black uppercase tracking-[0.4em]">Syncing Remote Stream...</div>
                        </div>
                     ) : (
                        <div className="flex-1 border border-white/[0.03] rounded-[2.5rem] overflow-hidden bg-[#0a0a0c]/60 backdrop-blur-2xl flex flex-col shadow-2xl">
                           <div className="overflow-auto flex-1 custom-scrollbar">
                              <table className="w-full text-left border-collapse">
                                 <thead className="sticky top-0 bg-[#0a0a0c] border-b border-white/[0.05] z-10">
                                    <tr>
                                       {bridgeTableData && bridgeTableData.length > 0 ? Object.keys(bridgeTableData[0]).map(k => (
                                          <th key={k} className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{k}</th>
                                       )) : <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Field Mapping...</th>}
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/[0.02]">
                                    {bridgeTableData?.map((row, rIdx) => (
                                       <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors group">
                                          {Object.values(row).map((val, vIdx) => (
                                             <td key={vIdx} className="px-8 py-5 text-[12px] font-medium text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px] tabular-nums group-hover:text-white transition-colors">
                                                {val === null ? <span className="text-slate-800 italic">null</span> : val.toString()}
                                             </td>
                                          ))}
                                       </tr>
                                    ))}
                                    {(!bridgeTableData || bridgeTableData.length === 0) && (
                                       <tr><td colSpan="100" className="py-32 text-center opacity-20 text-[12px] font-black uppercase tracking-[0.5em]">No signal telemetry returned.</td></tr>
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
                        <h3 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Deep Tunnel Protocol</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 max-w-sm mx-auto leading-relaxed">Select a functional architecture block from the left to engage real-time data inspection.</p>
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
      <div className="flex min-h-screen bg-[var(--color-bg-main)] text-white">
         <Sidebar
            activeView={view}
            setView={setView}
            onLogout={handleLogout}
            setSelectedProduct={setSelectedProduct}
            setSelectedBridge={setSelectedBridge}
            setSelectedTableIdx={setSelectedTableIdx}
         />
         <div className="flex-1 ml-[260px] relative font-['Lexend']">
            <header className="h-[60px] border-b border-[var(--color-border)] flex items-center justify-between px-10 sticky top-0 bg-[var(--color-bg-header)] backdrop-blur-md z-40">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-md bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] border border-[#7c3aed]/20"><PieChart size={18} /></div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-tight">System Control</h2>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                     <span className="text-[11px] font-medium text-[#a0a0a5]">Production Shield Active</span>
                  </div>
                  <button onClick={fetchData} className="p-2 text-[#707075] hover:text-white transition-all">
                     <RefreshCw size={16} />
                  </button>
               </div>
            </header>

            {view === 'dashboard' && <Dashboard bridges={bridges} />}

            {view === 'media' && (
               <div className="p-10 space-y-8 animate-in-fade font-['Lexend']">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-2xl font-bold text-white">Media Library</h1>
                        <p className="text-[11px] text-[#a0a0a5] mt-1 uppercase tracking-wider font-semibold">Asset Infrastructure</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="relative group">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707075] group-focus-within:text-white transition-colors" size={14} />
                           <input placeholder="Search assets..." className="bg-white/5 border border-[var(--color-border)] rounded-md pl-9 pr-4 py-2 text-xs outline-none focus:border-[#7c3aed] transition-all w-64" />
                        </div>
                        <button className="bg-[#7c3aed] hover:opacity-90 text-white px-5 py-2 rounded-md text-xs font-bold transition-all">Upload New</button>
                     </div>
                  </div>

                  <div className="flex gap-8 items-start">
                     <div className="flex-1 grid grid-cols-4 gap-4">
                        {[1,2,3,4,5,6,7,8].map(i => (
                           <div key={i} className="group relative aspect-square bg-[#1a1a1c] border border-[var(--color-border)] rounded-lg overflow-hidden cursor-pointer hover:border-[#3a3a3c] transition-all shadow-sm">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                 <p className="text-[10px] font-bold text-white truncate">asset_banner_{i}.png</p>
                                 <p className="text-[8px] text-[#a0a0a5] mt-0.5 uppercase tracking-widest">1.2 MB • PNG</p>
                              </div>
                              <div className="w-full h-full flex items-center justify-center text-[#2a2a2c] group-hover:text-[#7c3aed] transition-colors">
                                 <Image size={48} strokeWidth={1} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {view === 'posts' && (
               <div className="p-10 space-y-8 animate-in-fade font-['Lexend']">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-2xl font-bold text-white">Posts & Articles</h1>
                        <p className="text-[11px] text-[#a0a0a5] mt-1 uppercase tracking-wider font-semibold">Content Hub Infrastructure</p>
                     </div>
                     <button className="bg-[#7c3aed] hover:opacity-90 text-white px-5 py-2.5 rounded-md text-xs font-bold transition-all flex items-center gap-2">
                        <Plus size={16} /> New Post
                     </button>
                  </div>

                  <div className="card-surface p-0 overflow-hidden">
                     <div className="divide-y divide-[var(--color-border)]">
                        {[1,2,3,4,5].map(i => (
                           <div key={i} className="flex items-center justify-between p-5 hover:bg-white/[0.01] transition-all group">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-10 bg-[#1a1a1c] border border-[var(--color-border)] rounded-md flex items-center justify-center">
                                    <Image size={16} className="text-[#2a2a2c]" />
                                 </div>
                                 <div>
                                    <h3 className="text-[13px] font-bold text-white group-hover:text-[#7c3aed] transition-all cursor-pointer">Modern Architecture Patterns in Scalable Microservices</h3>
                                    <div className="flex items-center gap-3 mt-1.5">
                                       <span className="text-[10px] text-[#606065] font-semibold uppercase tracking-wider">Mark Ashton</span>
                                       <div className="w-1 h-1 rounded-full bg-[#3a3a3c]" />
                                       <span className="text-[10px] text-[#606065] font-semibold uppercase tracking-wider">Dev</span>
                                       <div className="w-1 h-1 rounded-full bg-[#3a3a3c]" />
                                       <span className="text-[10px] text-[#a0a0a5] font-medium leading-none">Oct 24, 2025</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                 <button className="p-2 text-[#707075] hover:text-[#7c3aed] transition-all"><Pencil size={14} /></button>
                                 <button className="p-2 text-[#707075] hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {['pages', 'comments', 'appearance', 'plugins', 'users', 'settings'].includes(view) && (
               <div className="p-20 text-center animate-in-fade space-y-4">
                  <div className="w-16 h-16 bg-[#1a1a1c] border border-[var(--color-border)] rounded-2xl mx-auto flex items-center justify-center text-[#2a2a2c]">
                     <Puzzle size={32} strokeWidth={1} />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-white capitalize">{view} Protocol</h2>
                     <p className="text-sm text-[#a0a0a5] mt-2">Section is currently in stasis. Operational data incoming.</p>
                  </div>
               </div>
            )}

            {view === 'handshakes' && !selectedBridge && (
               <div className="p-12 space-y-12 animate-in-fade">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-1">Network Nodes</h1>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Active Pipeline Connections</p>
                     </div>
                     <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all">Analytics</button>
                        <button onClick={() => {
                           setBridgeForm({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: 'RDS_MAIN', tags: '' });
                           setShowBridgeModal(true);
                        }} className="px-8 py-3 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Add New Node</button>
                     </div>
                  </div>

                  <div className="flex items-center gap-8 border-b border-white/[0.03] pb-1">
                     {['All Nodes', 'Active', 'Down', 'Experimental'].map((tab, idx) => (
                        <button key={tab} className={`pb-5 text-[11px] font-black uppercase tracking-widest px-1 relative ${idx === 0 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                           {tab} <span className="ml-1 opacity-40 font-bold">({idx === 0 ? bridges.length : 0})</span>
                           {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                        </button>
                     ))}
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="relative group">
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
                        <input placeholder="Filter Network Nodes..." className="bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-12 pr-6 py-3.5 text-xs outline-none focus:bg-white/[0.04] focus:border-indigo-500/20 transition-all w-[360px] font-medium" />
                     </div>
                  </div>

                  <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-card)]">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-white/[0.02] text-[11px] font-bold text-[#606065] uppercase tracking-wider border-b border-[var(--color-border)]">
                           <tr>
                              <th className="px-6 py-4 w-10"><input type="checkbox" className="opacity-20" /></th>
                              <th className="px-6 py-4">Node Identity</th>
                              <th className="px-6 py-4">Database</th>
                              <th className="px-6 py-4">Tags</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 w-20"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                           {bridges.map(b => (
                              <tr key={b.id} className="cursor-pointer hover:bg-white/[0.02] transition-all duration-300 group" onClick={() => {
                                 setSelectedBridge(b);
                                 const p = products.find(prod => String(prod.id) === String(b.product_id));
                                 setSelectedTableIdx((p?.field_mapping?.tables?.length > 0) ? 0 : null);
                              }}>
                                 <td className="px-10 py-8" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="opacity-5 group-hover:opacity-20 transition-opacity" /></td>
                                 <td className="px-6 py-8">
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/5 group-hover:border-indigo-500/10 transition-all duration-500">
                                          <Server size={20} />
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tabular-nums">{b.name}</span>
                                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 opacity-60">{b.stats?.license || 'Syncing...'}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-8 font-mono text-[11px] text-slate-500 tracking-tight">
                                    {b.db_name || 'LEGACY_RDS'}
                                 </td>
                                 <td className="px-6 py-8 font-medium">
                                    <div className="flex flex-wrap gap-2">
                                       {(b.tags || '').split(',').filter(t => t.trim()).map((tag, tIdx) => (
                                          <span key={tIdx} className="px-2.5 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-[8px] font-black uppercase text-indigo-400 tracking-widest group-hover:border-indigo-500/30 transition-all">{tag.trim()}</span>
                                       ))}
                                       {(!b.tags || b.tags.trim() === '') && <span className="text-[10px] text-slate-800 italic opacity-20">—</span>}
                                    </div>
                                 </td>
                                 <td className="px-6 py-8">
                                    <div className={`status-pill ${b.status === 'Online'
                                       ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
                                       : 'bg-rose-500/5 border-rose-500/10 text-rose-500'
                                       }`}>
                                       <div className={`w-2 h-2 rounded-full ${b.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)] animate-pulse'}`} />
                                       {b.status === 'Online' ? 'Operational' : 'Disconnected'}
                                    </div>
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                       <button onClick={(e) => { e.stopPropagation(); fetchLogs(b.id); }} className="btn-action" title="Telemetry Logs"><Eye size={16} /></button>
                                        {products.find(p => String(p.id) === String(b.product_id))?.field_mapping?.lock_config && (
                                           <button onClick={(e) => { e.stopPropagation(); toggleLock(b.id); }} className={`btn-action ${b.stats?.license === 'Locked' ? 'text-amber-500 bg-amber-500/5' : ''}`} title={b.stats?.license === 'Locked' ? 'Unlock System' : 'Lock System'}>
                                              {b.stats?.license === 'Locked' ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
                                           </button>
                                        )}
                                       <button onClick={(e) => {
                                          e.stopPropagation();
                                          setBridgeForm({
                                             id: b.id,
                                             client_id: b.client_id?.toString() || '',
                                             product_id: b.product_id?.toString() || '',
                                             db_name: b.db_name || '',
                                             connection_string_name: b.connection_string_name || '',
                                             tags: b.tags || ''
                                          });
                                          setShowBridgeModal(true);
                                       }} className="btn-action hover:text-indigo-400" title="Modify Config"><Pencil size={16} /></button>
                                       <button onClick={(e) => { e.stopPropagation(); deleteBridge(b.id); }} className="btn-action hover:text-rose-500 hover:bg-rose-500/5" title="Purge Connection"><Trash2 size={16} /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                           {bridges.length === 0 && (
                              <tr><td colSpan="6" className="py-24 text-center text-slate-700 italic text-[11px] font-black uppercase tracking-[0.5em] opacity-30">No active signal markers found.</td></tr>
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
                        <div><h2 className="text-3xl font-black tracking-tighter">Audit Control Center</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Remote Access / Last 100 System Activities</p></div>
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
               <div className="p-12 space-y-12 animate-in-fade">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase text-white">Software Registry</h1>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Artifact Repository & Metric Mappings</p>
                     </div>
                     <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Configuration</button>
                        <button className="px-8 py-3 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Init Artifact</button>
                     </div>
                  </div>

                  <div className="flex items-center gap-8 border-b border-white/[0.03] pb-1">
                     {['All Artifacts', 'Production', 'Staging', 'Legacy'].map((tab, idx) => (
                        <button key={tab} className={`pb-5 text-[11px] font-black uppercase tracking-widest px-1 relative ${idx === 0 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                           {tab} <span className="ml-1 opacity-40 font-bold">({idx === 0 ? products.length : 0})</span>
                           {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                        </button>
                     ))}
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="relative group">
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
                        <input placeholder="Filter Registry Artifacts..." className="bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-12 pr-6 py-3.5 text-xs outline-none focus:bg-white/[0.04] focus:border-indigo-500/20 transition-all w-[360px] font-medium" />
                     </div>
                  </div>

                  <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-card)]">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-white/[0.02] text-[11px] font-bold text-[#606065] uppercase tracking-wider border-b border-[var(--color-border)]">
                           <tr>
                              <th className="px-6 py-4 w-10"><input type="checkbox" className="opacity-20" /></th>
                              <th className="px-6 py-4">Product Identity</th>
                              <th className="px-6 py-4">Schema Metrics</th>
                              <th className="px-6 py-4">Nodes</th>
                              <th className="px-6 py-4 text-right px-10">Deployment</th>
                              <th className="px-6 py-4 w-20"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                           {products.map(p => (
                              <tr key={p.id} className="cursor-pointer hover:bg-white/[0.02] transition-all duration-300 group" onClick={() => handleEditProduct(p)}>
                                 <td className="px-10 py-8" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="opacity-5 group-hover:opacity-20" /></td>
                                 <td className="px-6 py-8 font-bold">
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-600 group-hover:text-amber-400 group-hover:bg-amber-500/5 group-hover:border-amber-500/10 transition-all duration-500">
                                          <Boxes size={20} />
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase">{p.name}</span>
                                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 opacity-60 truncate max-w-[240px]">{p.description}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-8">
                                    <div className="flex flex-wrap gap-2">
                                       {(p.field_mapping?.tables || []).map((t, idx) => (
                                          <span key={idx} className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:border-white/10 transition-all">{t.name}</span>
                                       ))}
                                       {(!p.field_mapping?.tables || p.field_mapping.tables.length === 0) && <span className="text-[9px] text-slate-800 italic uppercase font-black opacity-20">No Metrics Engaged</span>}
                                    </div>
                                 </td>
                                 <td className="px-6 py-8 font-mono text-[11px] text-slate-500 tracking-tight">
                                    {bridges.filter(b => b.product_id === p.id).length} ENGAGED NODES
                                 </td>
                                 <td className="px-6 py-8 text-right px-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                       Operational
                                    </div>
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <button className="btn-action opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
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
                              const newM = { ...selectedProduct.field_mapping, tables: [...(selectedProduct.field_mapping?.tables || []), { name: 'new_table', metrics: [] }] };
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
                                    newT[selectedTableIdx].metrics = [...(newT[selectedTableIdx].metrics || []), { label: 'New Metric', where: '' }];
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
                            setClientForm({ name: '' });
                            setShowClientModal(true);
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
                                          {bridges.filter(b => b.client_id === c.id).length} Active Connections
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
                        <div><h2 className="text-2xl font-black tracking-tighter">{bridgeForm.id ? 'Edit Site Connection' : 'New Site Connection'}</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Setting up system link</p></div>
                        <button onClick={() => setShowBridgeModal(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={20} /></button>
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
                              <input value={bridgeForm.db_name} onChange={e => setBridgeForm({ ...bridgeForm, db_name: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none focus:border-white/10" placeholder="e.g. site_db" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Tags (Comma Separated)</label>
                              <input value={bridgeForm.tags} onChange={e => setBridgeForm({ ...bridgeForm, tags: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none focus:border-white/10" placeholder="e.g. LIVE, PRODUCTION, REGION-A" />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest px-1">Connection Key</label>
                           <input value={bridgeForm.connection_string_name} onChange={e => setBridgeForm({ ...bridgeForm, connection_string_name: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-mono outline-none" placeholder="e.g. LIVE_CREDENTIALS" />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                           {bridgeForm.id ? 'Save Connection' : 'Create Connection'}
                        </button>
                     </form>
                  </div>
               </div>
            )}
            {showClientModal && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
                  <div className="card-surface w-full max-w-md p-10 relative space-y-8 animate-in-slide-up border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.15)] bg-[#111114]/90">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]"><Briefcase size={22} /></div>
                           <div>
                              <h2 className="text-2xl font-black tracking-tighter text-white">Register Client</h2>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Initialize New Managed Entity</p>
                           </div>
                        </div>
                        <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                     </div>
                     <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (clientForm.name) {
                           await axios.post(`${API_BASE}/clients`, clientForm);
                           setShowClientModal(false);
                           fetchData();
                        }
                     }} className="space-y-6 pt-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Legal Entity Name</label>
                           <input 
                              autoFocus 
                              required 
                              value={clientForm.name} 
                              onChange={e => setClientForm({ ...clientForm, name: e.target.value })} 
                              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700 text-white" 
                              placeholder="e.g. SOT, PCEA JoyValley" 
                           />
                        </div>

                        <div className="flex gap-3 pt-4">
                           <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-slate-400">Cancel</button>
                           <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] text-white">Register Site</button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
export default App;
