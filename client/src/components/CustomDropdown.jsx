import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function CustomDropdown({ options, value, onChange, placeholder, label }) {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const selectedOption = options.find(o => String(o.value) === String(value));
   const containerRef = useRef(null);

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
         {label && <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">{label}</label>}
         <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full bg-black/40 border border-white/5 px-5 py-4 text-xs flex items-center justify-between cursor-pointer transition-all hover:bg-white/[0.03] ${isOpen ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : ''}`}
            style={{ borderRadius: 'var(--radius-md)' }}
         >
            <span className={selectedOption ? 'text-white font-medium' : 'text-slate-500'}>
               {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
         </div>

         {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1e]/95 border border-white/10 overflow-hidden z-[200] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in-fade backdrop-blur-3xl" style={{ borderRadius: 'var(--radius-lg)' }}>
               {options.length > 5 && (
                  <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                     <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                           autoFocus
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                           className="w-full bg-black/20 border border-white/5 pl-9 pr-4 py-2 text-[11px] outline-none focus:border-indigo-500/30 transition-all font-medium"
                           style={{ borderRadius: 'var(--radius-sm)' }}
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
                        className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-all flex items-center justify-between group ${String(opt.value) === String(value) ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                        style={{ borderRadius: 'var(--radius-sm)' }}
                     >
                        <span>{opt.label}</span>
                        {String(opt.value) === String(value) && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />}
                     </div>
                  )) : (
                     <div className="py-8 text-center text-[10px] text-slate-600 font-bold tracking-widest italic px-4">No matches found</div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
