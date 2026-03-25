import React from 'react';
import {
   LayoutDashboard, MapPin, Briefcase, Boxes, FileText, Image, FileCode,
   MessageSquare, Palette, Puzzle, Users, Settings, LogOut
} from 'lucide-react';

export default function Sidebar({ activeView, setView, onLogout, setSelectedProduct, setSelectedBridge, setSelectedTableIdx }) {
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
