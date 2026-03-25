import React from 'react';
import { Puzzle } from 'lucide-react';

export default function GenericView({ view }) {
   return (
      <div className="p-20 text-center animate-in-fade space-y-4">
         <div className="w-16 h-16 bg-[#1a1a1c] border border-[var(--color-border)] rounded-2xl mx-auto flex items-center justify-center text-[#2a2a2c]">
            <Puzzle size={32} strokeWidth={1} />
         </div>
         <div>
            <h2 className="text-xl font-bold text-white capitalize">{view} Protocol</h2>
            <p className="text-sm text-[#a0a0a5] mt-2">Section is currently in stasis. Operational data incoming.</p>
         </div>
      </div>
   );
}
