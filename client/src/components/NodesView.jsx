import React, { useState } from 'react';
import styled from 'styled-components';
import { BsSearch, BsFilter, BsPlus, BsEye, BsPencil, BsTrash, BsCheck, BsLock, BsUnlock } from 'react-icons/bs';
import { Server } from 'lucide-react';
import DataTable, { Badge as SharedBadge } from './DataTable';

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
  border-radius: var(--radius-sm);
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
    padding: 0.8rem 1.25rem 0.8rem 2.8rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    outline: none;
    width: 280px;
    transition: all 0.2s;

    &::placeholder {
      color: var(--color-input-placeholder);
    }

    &:focus {
      border-color: var(--color-input-focus-border);
      background: var(--color-panel-strong);
    }
  }
`;

const FilterBtn = styled.button`
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-input-text);
  padding: 0.8rem 1.25rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: var(--color-panel-strong);
  }
`;

const AddBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #5b45c2);
  border: none;
  color: var(--color-text-strong);
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
  
  svg {
    font-size: 1.1rem;
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

const NodeIdentityCol = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .thumb {
    width: 44px;
    height: 32px;
    border-radius: var(--radius-sm);
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


const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 500;

  background-color: ${props => props.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.online ? '#34d399' : '#f87171'};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.online ? '#34d399' : '#f87171'};
  }
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.8rem;
  
  svg {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: var(--color-text-primary);
    }
    
    &.delete:hover {
      color: #ef4444;
    }

    &.lock {
        color: #fbbf24;
    }
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

export default function NodesView({ 
   bridges, 
   products, 
   setSelectedBridge, 
   setSelectedTableIdx, 
   fetchLogs, 
   toggleLock, 
   deleteBridge, 
   setBridgeForm, 
   setShowBridgeModal 
}) {
   const [selected, setSelected] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');

   const filteredBridges = bridges.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.db_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tags || '').toLowerCase().includes(searchQuery.toLowerCase())
   );

   const toggleAll = (e) => {
      e.stopPropagation();
      if (selected.length === filteredBridges.length) setSelected([]);
      else setSelected(filteredBridges.map(b => b.id));
   };

   const toggleOne = (e, id) => {
      e.stopPropagation();
      if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
      else setSelected([...selected, id]);
   };

   return (
      <div className="p-12 animate-in-fade space-y-8">
         <TableHeaderLine>
            <div className="flex flex-col">
               <h2 className="text-2xl font-black text-[var(--color-text-strong)] tracking-tight">Provisioning Hub</h2>
               <p className="text-[10px] text-[var(--color-text-muted)] font-bold tracking-[0.2em] mt-1">Global node distribution and status monitoring</p>
            </div>
            <ActionsContainer>
               <SearchBox>
                  <BsSearch />
                  <input 
                     type="text" 
                     placeholder="Identify marker..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </SearchBox>
               <FilterBtn>
                  <BsFilter /> Filter Nodes
               </FilterBtn>
               <AddBtn onClick={() => {
                  setBridgeForm({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: 'RDS_MAIN', tags: '' });
                  setShowBridgeModal(true);
               }}>
                  <BsPlus /> Provision Node
               </AddBtn>
            </ActionsContainer>
         </TableHeaderLine>

         <Container>

            <DataTable 
               headers={[
                  { label: '', style: { width: '40px' } },
                  { label: 'Node Identity' },
                  { label: 'Database' },
                  { label: 'Tags' },
                  { label: 'Status' },
                  { label: 'Actions' }
               ]}
               isEmpty={filteredBridges.length === 0}
               emptyMessage="No active signal markers found."
            >
               {filteredBridges.map(b => (
                  <tr key={b.id} onClick={() => {
                     setSelectedBridge(b);
                     const p = products.find(prod => String(prod.id) === String(b.product_id));
                     setSelectedTableIdx((p?.field_mapping?.tables?.length > 0) ? 0 : null);
                  }}>
                     <td>
                        <CustomCheckbox checked={selected.includes(b.id)} onChange={(e) => toggleOne(e, b.id)} />
                     </td>
                     <td>
                        <NodeIdentityCol>
                           <div className="thumb">
                              <Server size={18} />
                           </div>
                           <div className="info">
                              <div className="title">{b.name}</div>
                              <div className="excerpt">{b.stats?.license || 'Active Deployment'}</div>
                           </div>
                        </NodeIdentityCol>
                     </td>
                     <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{b.db_name || 'LEGACY_RDS'}</span>
                     </td>
                     <td>
                        {(b.tags || '').split(',').filter(t => t.trim()).map((tag, tIdx) => (
                           <SharedBadge key={tIdx} color="#8b5cf6">{tag.trim()}</SharedBadge>
                        ))}
                        {(!b.tags || b.tags.trim() === '') && <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                     </td>
                     <td>
                        <StatusBadge online={b.status === 'Online'}>{b.status === 'Online' ? 'Operational' : 'Offline'}</StatusBadge>
                     </td>
                     <td>
                        <ActionIcons>
                           <BsEye onClick={(e) => { e.stopPropagation(); fetchLogs(b.id); }} />
                           {products.find(p => String(p.id) === String(b.product_id))?.field_mapping?.lock_config && (
                              <div onClick={(e) => { e.stopPropagation(); toggleLock(b.id); }}>
                                 {b.stats?.license === 'Locked' ? <BsLock className="lock" /> : <BsUnlock />}
                              </div>
                           )}
                           <BsPencil onClick={(e) => {
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
                           }} />
                           <BsTrash className="delete" onClick={(e) => { e.stopPropagation(); deleteBridge(b.id); }} />
                        </ActionIcons>
                     </td>
                  </tr>
               ))}
            </DataTable>

            <PaginationRow>
               <div className="info">Showing {bridges.length} of {bridges.length} entries</div>
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
