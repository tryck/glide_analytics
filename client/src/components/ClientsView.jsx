import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  Search,
  Filter,
  Plus,
  Check,
  MoreVertical,
  Briefcase,
  Activity,
  Users,
  Database,
  ArrowRight,
  ShieldCheck,
  Globe,
  Trash2,
  Edit2
} from 'lucide-react';
import DataTable, { Badge, ActionBtn, PrimaryBtn } from './DataTable';

const ViewWrapper = styled.div`
  padding: 3rem;
  background: var(--color-bg-main);
  min-h: 100%;
  animation: fadeIn 0.4s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: var(--color-shadow-card);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
  }

  .icon-box {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-md);
    background: ${props => props.color}20;
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${props => props.color}30;
  }

  .content {
    h4 {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--color-text-secondary);
      letter-spacing: 0.1em;
      margin-bottom: 0.25rem;
    }
    .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text-strong);
      letter-spacing: -0.01em;
    }
  }
`;



export default function ClientsView({
  clients,
  bridges,
  setShowClientModal,
  setClientForm,
  onDeleteClient,
  viewMode = 'table'
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString().includes(searchQuery)
    );
  }, [clients, searchQuery]);

  const getClientInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <ViewWrapper>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gradient tracking-tight">Client Registry</h1>
        <p className="text-slate-500 font-medium mt-2">Manage customer entities and system deployments</p>
      </div>

      <StatGrid>
        <StatCard color="#8b5cf6">
          <div className="icon-box"><Users size={24} /></div>
          <div className="content">
            <h4>Total Clients</h4>
            <div className="value">{clients.length}</div>
          </div>
        </StatCard>
        <StatCard color="#10b981">
          <div className="icon-box"><Activity size={24} /></div>
          <div className="content">
            <h4>Subscriptions</h4>
            <div className="value">{bridges.length}</div>
          </div>
        </StatCard>
        <StatCard color="#3b82f6">
          <div className="icon-box"><Database size={24} /></div>
          <div className="content">
            <h4>Databases</h4>
            <div className="value">{[...new Set(bridges.map(b => b.db_name))].length}</div>
          </div>
        </StatCard>
        <StatCard color="#f59e0b">
          <div className="icon-box"><Globe size={24} /></div>
          <div className="content">
            <h4>Regions</h4>
            <div className="value">Global</div>
          </div>
        </StatCard>
      </StatGrid>
      <div className="flex justify-between items-center mb-6 mt-12 bg-transparent">
        <div className="text-xs font-black text-slate-500 tracking-widest"></div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] py-3.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[var(--color-accent)] outline-none min-w-[320px] transition-all"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <PrimaryBtn onClick={() => {
            setClientForm({ name: '' });
            setShowClientModal(true);
          }}>
            <Plus size={18} strokeWidth={3} /> Register Client
          </PrimaryBtn>
        </div>
      </div>

      <DataTable 
        headers={[
          { label: 'Entity Details' },
          { label: 'Deployments' },
          { label: 'Status' },
          { label: 'Actions', style: { textAlign: 'right' } }
        ]}
        isEmpty={filteredClients.length === 0}
        emptyMessage="No entities found in registry"
      >
        {filteredClients.map(c => (
          <tr key={c.id}>
            <td>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-panel-strong)] flex items-center justify-center text-[var(--color-accent)] font-black border border-[var(--color-border)]">
                  {getClientInitials(c.name)}
                </div>
                <div>
                  <div className="font-bold text-[var(--color-text-strong)]">{c.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">UID: {c.id.toString().padStart(4, '0')}</div>
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center gap-2 font-bold text-xs">
                <Activity size={14} className="text-indigo-500" />
                {bridges.filter(b => b.client_id === c.id).length} Active Nodes
              </div>
            </td>
            <td>
              <Badge color="#10b981">Operational</Badge>
            </td>
            <td>
              <div className="flex justify-end gap-2">
                <ActionBtn onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setClientForm(c);
                  setShowClientModal(true);
                }} title="Modify Client">
                  <Edit2 size={16} />
                </ActionBtn>
                <ActionBtn onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onDeleteClient) onDeleteClient(c.id);
                }} title="Remove Client" className="hover:!text-red-500">
                  <Trash2 size={16} />
                </ActionBtn>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </ViewWrapper>
  );
}

