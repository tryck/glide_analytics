import React, { useState } from 'react';
import styled from 'styled-components';
import { BsSearch, BsFilter, BsPlus, BsCheck, BsThreeDotsVertical, BsBriefcase } from 'react-icons/bs';

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
    padding: 0.5rem 1rem 0.5rem 2.2rem;
    border-radius: var(--radius-sm);
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
  border-radius: var(--radius-sm);
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
  border-radius: var(--radius-sm);
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

const EntityCol = styled.div`
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

const DeploymentLabel = styled.div`
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    font-family: inherit;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-md);
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

export default function ClientsView({ clients, bridges, setShowClientModal, setClientForm }) {
   const [selected, setSelected] = useState([]);

   const toggleAll = () => {
      if (selected.length === clients.length) setSelected([]);
      else setSelected(clients.map(c => c.id));
   };

   const toggleOne = (id) => {
      if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
      else setSelected([...selected, id]);
   };

   return (
      <div className="p-12 animate-in-fade">
         {/* <PageHeader>
            <h1>Registry</h1>
            <p>Customer entities and core management infrastructure</p>
         </PageHeader> */}

         <Container>
            <TableHeaderLine>
               <h2>Client Directory</h2>
               <ActionsContainer>
                  <SearchBox>
                     <BsSearch />
                     <input type="text" placeholder="Search clients..." />
                  </SearchBox>
                  <FilterBtn>
                     <BsFilter /> Filter
                  </FilterBtn>
                  <AddBtn onClick={() => {
                     setClientForm({ name: '' });
                     setShowClientModal(true);
                  }}>
                     <BsPlus /> Register Client
                  </AddBtn>
               </ActionsContainer>
            </TableHeaderLine>

            <Table>
               <thead>
                  <tr>
                     <th style={{ width: '40px' }}>
                        <CustomCheckbox checked={selected.length === clients.length && clients.length > 0} onChange={toggleAll} />
                     </th>
                     <th>Client Entity</th>
                     <th>Deployments</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {clients.map(c => (
                     <tr key={c.id}>
                        <td>
                           <CustomCheckbox checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} />
                        </td>
                        <td>
                           <EntityCol>
                              <div className="thumb"><BsBriefcase size={18} /></div>
                              <div className="info">
                                 <div className="title">{c.name}</div>
                                 <div className="excerpt">ID: {c.id.toString().padStart(4, '0')}</div>
                              </div>
                           </EntityCol>
                        </td>
                        <td>
                           <DeploymentLabel>{bridges.filter(b => b.client_id === c.id).length} Active Nodes</DeploymentLabel>
                        </td>
                        <td>
                           <StatusBadge>Managed</StatusBadge>
                        </td>
                        <td>
                           <div className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"><BsThreeDotsVertical /></div>
                        </td>
                     </tr>
                  ))}
                  {clients.length === 0 && (
                     <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No client entities found.</td></tr>
                  )}
               </tbody>
            </Table>

            <PaginationRow>
               <div className="info">Showing {clients.length} of {clients.length} entries</div>
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
