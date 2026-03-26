import React, { useState } from 'react';
import {
   LayoutDashboard, MapPin, Briefcase, Boxes, FileText, Image, FileCode,
   MessageSquare, Palette, Puzzle, Users, Settings, LogOut, CreditCard,
   ChevronDown, ChevronRight, Box
} from 'lucide-react';

export default function Sidebar({
   activeView, setView, onLogout,
   setSelectedProduct, setSelectedBridge, setSelectedTableIdx,
   products, bridges, clients, setSubscriptionFilterProduct, subscriptionFilterProduct,
   setSelectedClientId, setRefreshToggle
}) {
   const [isSubsOpen, setIsSubsOpen] = useState(false);

   const handleNavigate = (targetView) => {
      setView(targetView);
      setSelectedProduct(null);
      setSelectedBridge(null);
      setSelectedTableIdx(null);
      setSubscriptionFilterProduct(null);
      setSelectedClientId(null);
      setRefreshToggle(prev => prev + 1);
   };

   const handleSelectProductFilter = (prod) => {
      setView('subscriptions');
      setSubscriptionFilterProduct(prod);
      setSelectedProduct(null);
      setSelectedBridge(null);
      setSelectedTableIdx(null);
      setSelectedClientId(null);
      setRefreshToggle(prev => prev + 1);
   };

   const menuGroups = [
      {
         title: 'OVERVIEW',
         items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
         ]
      },
      {
         title: 'MANAGEMENT',
         items: [
            {
               id: 'subscriptions',
               label: 'Subscriptions',
               icon: CreditCard,
               hasSubmenu: true,
               isOpen: isSubsOpen,
               onToggle: (e) => {
                  e.stopPropagation();
                  setIsSubsOpen(!isSubsOpen);
               }
            },
            { id: 'clients', label: 'Clients', icon: Briefcase, count: Array.isArray(clients) ? clients.length : 0 },
            { id: 'products', label: 'Products', icon: Boxes, count: Array.isArray(products) ? products.length : 0 },

            { id: 'handshakes', label: 'Sites', icon: MapPin, count: Array.isArray(bridges) ? bridges.length : 0 },
         ]
      },
      {
         title: 'ADMIN',
         items: [
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
         ]
      }
   ];

   const toCamelCase = (str) => {
      return str
         .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return word.toUpperCase();
         })
         .replace(/\s+/g, '');
   };

   const getProductSiteCount = (pid) => {
      if (!Array.isArray(bridges)) return 0;
      return bridges.filter(b => String(b.product_id) === String(pid)).length;
   };

   return (
      <aside className="w-[260px] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] h-screen flex flex-col fixed left-0 top-0 z-50 font-['Lexend'] overflow-hidden ">
         <div className="h-[60px] px-5 border-b border-[var(--color-border)] flex items-center">
            <div className="w-full cursor-pointer transition-all" onClick={() => handleNavigate('dashboard')}>
               <div className="flex items-center gap-2.5">
                  <div className="min-w-0">
                     <div className="p-4 text-[16px] font-bold text-[var(--color-text-strong)] leading-none truncate">DigitalGlide</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 py-5 space-y-6 overflow-y-auto hide-scrollbar">
            {menuGroups.map(group => (
               <div key={group.title}>
                  <div className="nav-group-title py-3">{group.title}</div>
                  <nav className="space-y-1">
                     {group.items.map(i => (
                        <div key={i.id}>
                           <div
                              onClick={() => handleNavigate(i.id)}
                              className={`sidebar-item flex items-center justify-between group ${activeView === i.id ? 'active' : ''}`}
                           >
                              <div className="flex items-center gap-3">
                                 <i.icon size={17} className={activeView === i.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />
                                 <span>{i.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 {i.count !== undefined && (
                                    <span className="text-[10px] font-bold bg-white/5 text-slate-500 px-1.5 py-0.5 rounded-md group-hover:bg-white/10 transition-colors">
                                       {i.count}
                                    </span>
                                 )}
                                 {i.hasSubmenu && (
                                    <div className="p-1 hover:bg-white/5 rounded-md transition-all" onClick={i.onToggle}>
                                       {i.isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                                    </div>
                                 )}
                              </div>
                           </div>

                           {i.hasSubmenu && i.isOpen && (
                              <div className="ml-9 mt-1 space-y-1 border-l-2 border-[var(--color-border)]">
                                 {Array.isArray(products) && products.map(prod => {
                                    const count = getProductSiteCount(prod.id);
                                    return (
                                       <div
                                          key={prod.id}
                                          onClick={() => handleSelectProductFilter(prod)}
                                          className={`sidebar-subitem py-2 px-4 text-[11px] font-bold tracking-widest cursor-pointer transition-all hover:text-white flex items-center justify-between ${subscriptionFilterProduct?.id === prod.id ? 'text-indigo-400' : 'text-slate-500'}`}
                                       >
                                          <span>{toCamelCase(prod.name)}</span>
                                          {count > 0 && (
                                             <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black tabular-nums transition-all ${subscriptionFilterProduct?.id === prod.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-700'}`}>
                                                {count}
                                             </span>
                                          )}
                                       </div>
                                    );
                                 })}
                                 {(!products || products.length === 0) && (
                                    <div className="py-2 px-4 text-[9px] uppercase tracking-widest text-slate-700 italic">No products available</div>
                                 )}
                              </div>
                           )}
                        </div>
                     ))}
                  </nav>
               </div>
            ))}
         </div>

         <div onClick={onLogout} className="mt-auto mx-4 mb-4 px-4 py-3 border border-[var(--color-border)] rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[var(--color-sidebar-hover)] hover:border-[var(--color-border-glow)] transition-all bg-[var(--color-panel-soft)]">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)] text-white font-bold text-sm shadow-sm flex items-center justify-center">RA</div>
            <div className="flex flex-col flex-1 truncate">
               <span className="text-[12px] font-semibold text-[var(--color-text-primary)] leading-none">Root Admin</span>
               <span className="text-[10px] text-[var(--color-text-muted)] font-normal truncate">admin@digitalglide.io</span>
            </div>
            <LogOut size={14} className="text-[var(--color-text-secondary)]" />
         </div>
      </aside>
   );
}
