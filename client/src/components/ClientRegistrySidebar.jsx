import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 240px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: none;
  height: 100%;
  
  .sidebar-header {
     padding: 1.5rem;
     border-bottom: 1px solid var(--color-border);
     background: var(--color-panel-soft);
     h3 {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-secondary);
     }
  }

  .sidebar-list {
     flex: 1;
     overflow-y: auto;
     padding: 1rem;
     
     .client-item {
        padding: 0.85rem 1rem;
        border-radius: var(--radius-sm);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .client-name {
           font-size: 0.8rem;
           font-weight: 700;
           color: var(--color-text-primary);
        }
        
        .client-count {
           font-size: 0.7rem;
           font-weight: 800;
           background: var(--color-panel-strong);
           color: var(--color-text-muted);
           padding: 0.1rem 0.5rem;
           border-radius: var(--radius-sm);
        }

        &.active {
           background: var(--color-accent);
           .client-name { color: white; }
           .client-count { background: rgba(255,255,255,0.2); color: white; }
        }

        &:hover:not(.active) {
           background: var(--color-panel-soft);
        }
     }
  }
`;

export default function ClientRegistrySidebar({
  clients,
  bridges,
  selectedClientId,
  setSelectedClientId,
  setSelectedBridge,
  filterProduct,
  countsByClient,
  triggerRefresh,
  title
}) {
  return (
    <SidebarContainer>
      {title && (
        <div className="sidebar-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="sidebar-list">
        <div 
          className={`client-item ${!selectedClientId ? 'active' : ''}`} 
          onClick={() => { 
            setSelectedClientId(null); 
            if (setSelectedBridge) setSelectedBridge(null); 
            if (triggerRefresh) triggerRefresh();
          }}
        >
          <span className="client-name">Global View</span>
          <span className="client-count">
            {filterProduct ? bridges.filter(b => String(b.product_id) === String(filterProduct.id)).length : bridges.length}
          </span>
        </div>
        {clients.map(c => (
          <div 
            key={c.id} 
            className={`client-item ${selectedClientId === c.id ? 'active' : ''}`} 
            onClick={() => {
              setSelectedClientId(c.id);
              if (setSelectedBridge) {
                const firstSite = bridges.find(b =>
                  String(b.client_id) === String(c.id) &&
                  (!filterProduct || String(b.product_id) === String(filterProduct.id))
                );
                setSelectedBridge(firstSite || null);
              }
              if (triggerRefresh) triggerRefresh();
            }}
          >
            <span className="client-name">{c.name}</span>
            <span className="client-count">{countsByClient[c.id] || 0}</span>
          </div>
        ))}
        {clients.length === 0 && filterProduct && (
          <div className="py-10 text-center opacity-20 italic text-[10px]">No clients for this product</div>
        )}
      </div>
    </SidebarContainer>
  );
}
