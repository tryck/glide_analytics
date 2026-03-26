import React, { useState } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';

export default function Login({ onLogin, API_BASE }) {
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
               <p className="text-[11px] text-[#a0a0a5] tracking-wider font-semibold">DigitalGlide Analytics</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#606065] tracking-wider">Operator Identity</label>
                  <input required value={username} onChange={e => setUsername(e.target.value)} className="input-field" placeholder="Username" />
               </div>
               
               <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#606065] tracking-wider">Access Protocol</label>
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
