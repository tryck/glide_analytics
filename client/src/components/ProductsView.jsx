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

export function ProductsView({ products, bridges, handleEditProduct }) {
   const [selected, setSelected] = useState([]);

   const toggleAll = (e) => {
      e.stopPropagation();
      if (selected.length === products.length) setSelected([]);
      else setSelected(products.map(p => p.id));
   };

   const toggleOne = (e, id) => {
      e.stopPropagation();
      if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
      else setSelected([...selected, id]);
   };

   return (
      <div className="p-12 animate-in-fade">
            {/* <PageHeader>
               <h1>Software Artifacts</h1>
               <p>Binary registry and logical field mapping definitions</p>
            </PageHeader> */}

         <Container>
            <TableHeaderLine>
               <h2>Registry Management</h2>
               <ActionsContainer>
                  <SearchBox>
                     <BsSearch />
                     <input type="text" placeholder="Search artifacts..." />
                  </SearchBox>
                  <FilterBtn>
                     <BsFilter /> Filter
                  </FilterBtn>
                  <AddBtn>
                     <BsPlus /> Init Artifact
                  </AddBtn>
               </ActionsContainer>
            </TableHeaderLine>

            <Table>
               <thead>
                  <tr>
                     <th style={{ width: '40px' }}>
                        <CustomCheckbox checked={selected.length === products.length && products.length > 0} onChange={toggleAll} />
                     </th>
                     <th>Artifact Identity</th>
                     <th>Metric Schema</th>
                     <th>Engaged Nodes</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {products.map(p => (
                     <tr key={p.id} onClick={() => handleEditProduct(p)}>
                        <td>
                           <CustomCheckbox checked={selected.includes(p.id)} onChange={(e) => toggleOne(e, p.id)} />
                        </td>
                        <td>
                           <ProductIdentityCol>
                              <div className="thumb"><BsBoxes size={18} /></div>
                              <div className="info">
                                 <div className="title">{p.name}</div>
                                 <div className="excerpt">{p.description || 'System Core'}</div>
                              </div>
                           </ProductIdentityCol>
                        </td>
                        <td>
                           {(p.field_mapping?.tables || []).map((t, idx) => (
                              <Badge key={idx}>{t.name}</Badge>
                           ))}
                           {(!p.field_mapping?.tables || p.field_mapping.tables.length === 0) && <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>No Metrics Engaged</span>}
                        </td>
                        <td>
                           <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{bridges.filter(b => b.product_id === p.id).length} Active Connections</span>
                        </td>
                        <td>
                           <StatusBadge>Operational</StatusBadge>
                        </td>
                        <td>
                           <div className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"><BsThreeDotsVertical /></div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </Table>

            <PaginationRow>
               <div className="info">Showing {products.length} of {products.length} entries</div>
               <div className="pages">
                  <button>Prev</button>
                  <button className="circle active">1</button>
                  <button>Next</button>
               </div>
            </PaginationRow>
         </Container>
      </div>
   );
}

export function ProductEditView({ selectedProduct, setSelectedProduct, selectedTableIdx, setSelectedTableIdx, syncProduct }) {
   if (!selectedProduct) return null;

   return (
      <div className="flex h-full w-full absolute inset-0 animate-in-slide-up bg-[#0c0c0e] z-50 overflow-hidden font-['Lexend']">
         {/* Product Sub-Sidebar / Table Names (Middle Column) */}
         <div className="w-[300px] border-r border-white/5 p-8 space-y-8 flex flex-col bg-[#111114]">
            <div className="flex items-center gap-4">
               <button onClick={() => setSelectedProduct(null)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><BsChevronRight size={18} className="rotate-180" /></button>
               <div className="truncate">
                    <h2 className="text-lg font-black tracking-tight truncate">{selectedProduct.name}</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Configuration Shell</p>
               </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Database Tables</label>
                  <button onClick={() => {
                     const newM = { ...selectedProduct.field_mapping, tables: [...(selectedProduct.field_mapping?.tables || []), { name: 'new_table', metrics: [] }] };
                     syncProduct({ ...selectedProduct, field_mapping: newM });
                  }} className="p-1 hover:text-indigo-400 text-slate-600 transition-colors"><BsPlus size={20} /></button>
               </div>
               <div className="space-y-1">
                  {(selectedProduct.field_mapping?.tables || []).map((t, idx) => (
                     <div key={idx} onClick={() => setSelectedTableIdx(idx)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${selectedTableIdx === idx ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-white/[0.03] text-slate-400'}`}>
                        <div className="flex items-center gap-3">
                           <BsDatabase size={14} className={selectedTableIdx === idx ? 'text-white' : 'text-slate-600'} />
                           <span className="text-xs font-bold">{t.name || 'unnamed_table'}</span>
                        </div>
                        {selectedTableIdx === idx && <BsChevronRight size={14} />}
                     </div>
                  ))}
                  {(selectedProduct.field_mapping?.tables || []).length === 0 && (
                     <p className="text-[10px] text-slate-700 italic px-4 py-8 text-center border-2 border-dashed border-white/5 rounded-3xl">No tables defined.</p>
                  )}
               </div>
            </div>

            <div className="pt-8 border-t border-white/5">
               <button onClick={() => { /* Delete Product Logic */ }} className="flex items-center gap-3 text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-widest transition-colors"><BsTrash size={16} /> Delete Product</button>
            </div>
         </div>

         {/* Table Metrics / Field Mapping (Right Column) */}
         <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[#0c0c0e]">
            {selectedTableIdx !== null ? (
               <div className="max-w-4xl space-y-12 animate-in-fade">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <h3 className="text-4xl font-black tracking-tighter">Table: {selectedProduct.field_mapping.tables[selectedTableIdx].name}</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Field Definitions & Analytics Filters</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => {
                           const newT = [...selectedProduct.field_mapping.tables];
                           newT[selectedTableIdx].metrics = [...(newT[selectedTableIdx].metrics || []), { label: 'New Metric', where: '' }];
                           syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                        }} className="bg-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Add Field Metric</button>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Logical Table Name (DB Mapping)</label>
                        <input value={selectedProduct.field_mapping.tables[selectedTableIdx].name} onChange={e => {
                           const newT = [...selectedProduct.field_mapping.tables];
                           newT[selectedTableIdx].name = e.target.value;
                           syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                        }} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-sm font-mono outline-none focus:border-indigo-500/30 transition-all text-indigo-400" />
                     </div>

                     <div className="pt-8 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Mapped Metrics</h4>
                        <div className="space-y-3">
                           {(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).map((m, mIdx) => (
                              <div key={mIdx} className="grid grid-cols-12 gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
                                 <div className="col-span-12 lg:col-span-5 space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Label</label>
                                    <input value={m.label} onChange={e => {
                                       const newT = [...selectedProduct.field_mapping.tables];
                                       newT[selectedTableIdx].metrics[mIdx].label = e.target.value;
                                       syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                    }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold outline-none text-white" />
                                 </div>
                                 <div className="col-span-11 lg:col-span-6 space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Where (SQL Filter)</label>
                                    <input value={m.where} onChange={e => {
                                       const newT = [...selectedProduct.field_mapping.tables];
                                       newT[selectedTableIdx].metrics[mIdx].where = e.target.value;
                                       syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                    }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono outline-none text-slate-400" placeholder="deleted_at IS NULL" />
                                 </div>
                                 <div className="col-span-1 flex items-end justify-center pb-2">
                                    <button onClick={() => {
                                       const newT = [...selectedProduct.field_mapping.tables];
                                       newT[selectedTableIdx].metrics = newT[selectedTableIdx].metrics.filter((_, i) => i !== mIdx);
                                       syncProduct({ ...selectedProduct, field_mapping: { ...selectedProduct.field_mapping, tables: newT } });
                                    }} className="p-3 text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><BsTrash size={16} /></button>
                                 </div>
                              </div>
                           ))}
                           {(selectedProduct.field_mapping.tables[selectedTableIdx].metrics || []).length === 0 && (
                              <div className="py-20 text-center opacity-10 italic text-xs tracking-widest uppercase">No metrics configured for this table.</div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-8 animate-in-fade">
                  <div className="p-12 rounded-full bg-white/[0.02] border border-white/10 shadow-2xl"><BsDatabase size={64} className="text-indigo-500" /></div>
                  <div className="text-center max-w-sm">
                     <h3 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">Table Shell</h3>
                     <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 leading-relaxed">Select a database architecture block from the left to engage schema property management.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
