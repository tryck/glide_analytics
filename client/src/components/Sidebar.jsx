import React from 'react';
import {
   LayoutDashboard, MapPin, Briefcase, Boxes, FileText, Image, FileCode,
   MessageSquare, Palette, Puzzle, Users, Settings, LogOut, CreditCard
} from 'lucide-react';

export default function Sidebar({ activeView, setView, onLogout, setSelectedProduct, setSelectedBridge, setSelectedTableIdx }) {
   const handleNavigate = (targetView) => {
      setView(targetView);
      setSelectedProduct(null);
      setSelectedBridge(null);
      setSelectedTableIdx(null);
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
            { id: 'handshakes', label: 'Sites', icon: MapPin },
            { id: 'clients', label: 'Clients', icon: Briefcase },
            { id: 'products', label: 'Products', icon: Boxes },
            { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
            // { id: 'posts', label: 'Posts', icon: FileText },
            // { id: 'media', label: 'Media', icon: Image },
            // { id: 'pages', label: 'Pages', icon: FileCode },
            // { id: 'comments', label: 'Comments', icon: MessageSquare },
         ]
      },
      {
         title: 'ADMIN',
         items: [
            // { id: 'appearance', label: 'Appearance', icon: Palette },
            // { id: 'plugins', label: 'Plugins', icon: Puzzle },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
         ]
      }
   ];

   return (
      <aside className="w-[260px] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] h-screen flex flex-col fixed left-0 top-0 z-50 font-['Lexend'] overflow-hidden ">
         <div className="h-[60px] px-5 border-b border-[var(--color-border)] flex items-center">
            <div className="w-full  cursor-pointer transition-all" onClick={() => handleNavigate('dashboard')}>
               <div className="flex items-center gap-2.5">
                  {/* <div className="w-7 h-7 rounded-md bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-accent)] flex items-center justify-center text-[10px] font-bold">
                     DG
                  </div> */}
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
                        <div key={i.id} onClick={() => handleNavigate(i.id)} className={`sidebar-item ${activeView === i.id ? 'active' : ''}`}>
                           <i.icon size={17} className={activeView === i.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />
                           <span>{i.label}</span>
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
