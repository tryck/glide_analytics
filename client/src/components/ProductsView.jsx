import React, { useState } from 'react';
import styled from 'styled-components';
import { BsSearch, BsFilter, BsPlus, BsCheck, BsThreeDotsVertical, BsBoxes, BsDatabase, BsChevronRight, BsTrash } from 'react-icons/bs';

const PageHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-text-strong);
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
`;

const Container = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
`;

const TableHeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: var(--color-input-placeholder);
    font-size: 0.9rem;
  }

  input {
    background: var(--color-input-bg);
    border: 1px solid var(--color-input-border);
    color: var(--color-input-text);
    padding: 0.5rem 1rem 0.5rem 2.2rem;
    border-radius: 8px;
    font-size: 0.85rem;
    outline: none;
    width: 220px;
    transition: border-color 0.2s;

    &::placeholder {
      color: var(--color-input-placeholder);
    }

    &:focus {
      border-color: var(--color-input-focus-border);
    }
  }
`;

const FilterBtn = styled.button`
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-input-text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: var(--color-panel-strong);
  }
`;

const AddBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #5b45c2);
  border: none;
  color: var(--color-text-strong);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-table-divider);
  }
  
  th {
    color: var(--color-table-head);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 1.2rem;
  }

  tbody tr {
    transition: background-color 0.2s;
    cursor: pointer;
    
    &:hover {
      background-color: var(--color-table-row-hover);
    }
    
    &:last-child td {
      border-bottom: none;
    }
  }
`;

const CheckboxBase = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.checked ? 'var(--color-accent)' : 'var(--color-input-border)'};
  background-color: ${props => props.checked ? 'var(--color-accent)' : 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  
  svg {
    color: var(--color-text-strong);
    font-size: 12px;
    opacity: ${props => props.checked ? 1 : 0};
  }
`;

const CustomCheckbox = ({ checked, onChange }) => (
  <CheckboxBase checked={checked} onClick={onChange}>
    <BsCheck strokeWidth={1} />
  </CheckboxBase>
);

const ProductIdentityCol = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .thumb {
    width: 44px;
    height: 32px;
    border-radius: 6px;
    background: var(--color-input-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
    border: 1px solid var(--color-input-border);
  }

  .info {
    .title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 0.2rem;
    }
    .excerpt {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.4rem;
  margin-bottom: 0.4rem;
  border: 1px solid rgba(255,255,255,0.05);

  background-color: rgba(91, 69, 194, 0.1);
  color: #a78bfa;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;

  background-color: rgba(16, 185, 129, 0.1);
  color: #34d399;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #34d399;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-table-divider);
  
  .info {
    color: var(--color-text-muted);
    font-size: 0.8rem;
  }
  
  .pages {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    
    button {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0.4rem 0.6rem;
      border-radius: 4px;
      
      &:hover {
        color: var(--color-text-primary);
      }
      
      &.circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        
        &.active {
          border: 1px solid var(--color-accent);
          color: var(--color-text-strong);
        }
        
        &:hover {
          background-color: var(--color-table-row-hover);
        }
      }
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ProductCard = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: transparent;
    transition: all 0.3s;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent);
    box-shadow: var(--color-shadow-lg);
    background: var(--color-panel-soft);
    &::before { background: var(--color-accent); }
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--color-panel-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: var(--color-accent);
  }

  .title-area {
    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text-strong);
      margin-bottom: 0.25rem;
    }
    p {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-h: 2.5rem;
    }
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    
    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }

  .selection-overlay {
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    z-index: 10;
  }
`;

export function ProductsView({ products, bridges, handleEditProduct }) {
   const [selected, setSelected] = useState([]);

   const toggleOne = (e, id) => {
      e.stopPropagation();
      if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
      else setSelected([...selected, id]);
   };

   return (
      <div className="p-12 animate-in-fade">
         <TableHeaderLine>
            <div>
               <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Software Registry</h1>
               <p className="text-slate-500 font-medium mt-2">Manage global product lifecycle and metric streams</p>
            </div>
            <ActionsContainer>
               <SearchBox>
                  <BsSearch />
                  <input type="text" placeholder="Search registry..." />
               </SearchBox>
               <AddBtn>
                  <BsPlus /> Init Artifact
               </AddBtn>
            </ActionsContainer>
         </TableHeaderLine>

         <ProductGrid>
            {products.map(p => (
               <ProductCard key={p.id} onClick={() => handleEditProduct(p)}>
                  <div className="selection-overlay">
                      <CustomCheckbox checked={selected.includes(p.id)} onChange={(e) => toggleOne(e, p.id)} />
                  </div>
                  
                  <div className="icon-wrapper">
                     <BsBoxes size={24} />
                  </div>

                  <div className="title-area">
                     <h3>{p.name}</h3>
                     <p>{p.description || 'Core system module with default logical mappings.'}</p>
                  </div>

                  <div className="meta">
                     <span>{bridges.filter(b => b.product_id === p.id).length} Nodes</span>
                     <span>•</span>
                     <span>{(p.field_mapping?.tables || []).length} Metrics</span>
                     <span><StatusBadge>Operational</StatusBadge></span>
                  </div>
               </ProductCard>
            ))}
         </ProductGrid>

         <PaginationRow>
            <div className="info">Total Registry Items: {products.length}</div>
            <div className="pages">
               <button>Prev</button>
               <button className="circle active">1</button>
               <button>Next</button>
            </div>
         </PaginationRow>
      </div>
   );
}
export function ProductEditView({ selectedProduct, setSelectedProduct, selectedTableIdx, setSelectedTableIdx, syncProduct }) {
   if (!selectedProduct) return null;

   return (
      <div className="flex h-full w-full absolute inset-0 animate-in-slide-up bg-[#09090b]/95 backdrop-blur-3xl z-[100] overflow-hidden font-['Lexend'] border-t border-white/5 shadow-[0_-50px_150px_-20px_rgba(0,0,0,0.8)]">
         {/* Sub-Sidebar: Table List */}
         <div className="w-[280px] border-r border-white/5 p-6 flex flex-col bg-[#111114]/80 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4 mb-8">
               <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all group"
               >
                  <BsChevronRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
               </button>
               <div className="truncate">
                  <h2 className="text-base font-black tracking-tight truncate text-white uppercase">{selectedProduct.name}</h2>
                  <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Configuration Shell</p>
               </div>
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Database Schema</label>
                  <button onClick={() => {
                     const newM = { ...selectedProduct.field_mapping, tables: [...(selectedProduct.field_mapping?.tables || []), { name: 'new_table', metrics: [] }] };
                     syncProduct({ ...selectedProduct, field_mapping: newM });
                  }} className="w-5 h-5 rounded bg-indigo-600/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><BsPlus size={16} /></button>
               </div>
               
               <div className="space-y-1.5">
                  <div 
                     onClick={() => setSelectedTableIdx(null)}
                     className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedTableIdx === null ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/[0.03] hover:border-white/10'}`}
                  >
                     <BsBoxes size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Product Core</span>
                  </div>

                  {(selectedProduct.field_mapping?.tables || []).map((t, idx) => (
                     <div 
                        key={idx} 
                        onClick={() => setSelectedTableIdx(idx)} 
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedTableIdx === idx ? 'bg-white/5 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-transparent border-white/5 text-slate-600 hover:bg-white/[0.03] hover:border-white/10'}`}
                     >
                        <div className="flex items-center gap-3">
                           <BsDatabase size={12} className={selectedTableIdx === idx ? 'text-indigo-400' : 'text-slate-700'} />
                           <span className={`text-[10px] font-bold ${selectedTableIdx === idx ? 'text-white' : 'group-hover:text-slate-300'}`}>{t.name || 'unnamed_table'}</span>
                        </div>
                        {selectedTableIdx === idx ? (
                           <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                        ) : (
                           <BsChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                     </div>
                  ))}
               </div>
            </div>

            <div className="pt-6 border-t border-white/5">
               <button className="flex items-center gap-3 text-slate-700 hover:text-rose-500 text-[9px] font-black uppercase tracking-widest transition-all"><BsTrash size={14} /> Decommission</button>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-[#09090b]/50">
            {selectedTableIdx !== null ? (
               <div className="max-w-4xl mx-auto space-y-10 animate-in-fade">
                  <div className="flex justify-between items-end">
                     <div>
                        <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic">TABLE: {selectedProduct.field_mapping.tables[selectedTableIdx].name}</h3>
                        <p className="text-[9px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-1 ml-1">Persistence Layer Mapping</p>
                     </div>
                     <button 
                        onClick={() => {
                           const newT = [...selectedProduct.field_mapping.tables];
                           newT[selectedTableIdx].metrics = [...(newT[selectedTableIdx].metrics || []), { label: 'New Metric', where: '' }];
                           syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                        }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
                     >
                        Inject Metric
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-2">Table Logic Identifier (SQL Mapping)</label>
                        <input 
                           value={selectedProduct.field_mapping.tables[selectedTableIdx].name} 
                           onChange={e => {
                              const newT = [...selectedProduct.field_mapping.tables];
                              newT[selectedTableIdx].name = e.target.value;
                              syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                           }} 
                           className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-indigo-400" 
                        />
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                           <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Telemetry Metrics</h4>
                           <span className="text-[8px] text-slate-700 font-bold uppercase tracking-wider">{(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).length} Filters Engaged</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                           {(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).map((m, mIdx) => (
                              <div key={mIdx} className="group relative bg-[#111114]/40 border border-white/5 rounded-2xl p-1 hover:border-white/20 transition-all">
                                 <div className="flex items-center gap-4 p-3">
                                    <div className="flex-1 space-y-3">
                                       <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-1.5">
                                             <label className="text-[8px] font-bold text-slate-700 uppercase tracking-widest ml-4">Label</label>
                                             <input value={m.label} onChange={e => {
                                                const newT = [...selectedProduct.field_mapping.tables];
                                                newT[selectedTableIdx].metrics[mIdx].label = e.target.value;
                                                syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                             }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[11px] font-bold outline-none text-white focus:border-indigo-500/30" />
                                          </div>
                                          <div className="space-y-1.5">
                                             <label className="text-[8px] font-bold text-slate-700 uppercase tracking-widest ml-4">SQL Filter (WHERE)</label>
                                             <input value={m.where} onChange={e => {
                                                const newT = [...selectedProduct.field_mapping.tables];
                                                newT[selectedTableIdx].metrics[mIdx].where = e.target.value;
                                                syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                             }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[11px] font-mono outline-none text-slate-500 focus:border-indigo-500/30" placeholder="status = 'active'" />
                                          </div>
                                       </div>
                                    </div>
                                    <button 
                                       onClick={() => {
                                          const newT = [...selectedProduct.field_mapping.tables];
                                          newT[selectedTableIdx].metrics = newT[selectedTableIdx].metrics.filter((_, i) => i !== mIdx);
                                          syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                       }} 
                                       className="w-10 h-10 flex items-center justify-center text-slate-800 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                       <BsTrash size={16} />
                                    </button>
                                 </div>
                              </div>
                           ))}
                           {(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).length === 0 && (
                              <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                 <BsBoxes size={32} className="mx-auto mb-4 opacity-5 text-indigo-500" />
                                 <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-800">No Analytics Defined</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="max-w-xl mx-auto space-y-12 animate-in-slide-up py-6">
                  <div className="text-center space-y-5">
                     <div className="relative inline-block">
                        <div className="absolute inset-0 bg-indigo-600/10 blur-[40px] rounded-full scale-150" />
                        <div className="relative z-10 p-8 rounded-3xl bg-[#111114] border border-white/10 shadow-xl">
                           <BsBoxes size={48} className="text-indigo-500" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Product Configuration</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-600">Global Schema Mapping Control</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[32px] space-y-8 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="space-y-8 relative z-10">
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                 <BsDatabase size={16} />
                              </div>
                              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">License Proxy Schema</h4>
                           </div>
                           
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2">Primary License Database (Override)</label>
                                 <input 
                                    value={selectedProduct.field_mapping?.licence_db || ''} 
                                    onChange={e => {
                                       syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, licence_db: e.target.value } });
                                    }}
                                    placeholder="node-specific default DB"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:border-indigo-500/50 transition-all text-indigo-400" 
                                 />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {[
                                    { label: 'Subscriptions Mapping', key: 'licence_subscriptions_table', def: 'license_subscriptions' },
                                    { label: 'Billing Ledger Table', key: 'licence_bills_table', def: 'bills' },
                                    { label: 'Payment History Table', key: 'licence_payments_table', def: 'bill_payments' }
                                 ].map((field, idx) => (
                                    <div key={idx} className={`space-y-2 ${idx === 2 ? 'md:col-span-2' : ''}`}>
                                       <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2">{field.label}</label>
                                       <input 
                                          value={selectedProduct.field_mapping?.[field.key] || field.def} 
                                          onChange={e => {
                                             syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, [field.key]: e.target.value } });
                                          }}
                                          placeholder={field.def}
                                          className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-[11px] font-mono outline-none focus:border-indigo-500/30 transition-all text-white" 
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="text-center p-8 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                        <p className="text-[9px] text-slate-800 uppercase tracking-[0.4em] font-black">Select a table from the sidebar to configure granular telemetry</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
