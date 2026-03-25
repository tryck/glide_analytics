import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';

export default function MediaView() {
   return (
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
                        <ImageIcon size={48} strokeWidth={1} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
