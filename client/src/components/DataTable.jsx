import React from 'react';
import styled from 'styled-components';

export const TableWrapper = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--color-shadow-card);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1.25rem 1.5rem;
    text-align: left;
  }
  
  th {
    background: var(--color-panel-strong);
    color: var(--color-text-secondary);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    border-bottom: 1px solid var(--color-border);
  }

  tbody tr {
    border-bottom: 1px solid var(--color-border);
    transition: all 0.2s;
    
    &:hover {
      background-color: var(--color-panel-soft);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-xl);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: ${props => props.color || '#10b981'}15;
  color: ${props => props.color || '#10b981'};
  border: 1px solid ${props => props.color || '#10b981'}25;
`;

export const ActionBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-panel-strong);
    color: var(--color-accent);
  }

  svg { pointer-events: none; }
`;

export const PrimaryBtn = styled.button`
  background: var(--color-accent);
  border: none;
  color: #fff;
  padding: 0.8rem 1.75rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px -4px var(--color-accent-glow);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 8px 16px -4px var(--color-accent-glow);
  }
`;

/**
 * DataTable Component
 * @param {Object} props
 * @param {Array} props.headers - Array of header objects { label, style }
 * @param {React.ReactNode} props.children - Table body rows
 * @param {boolean} props.isEmpty - Whether the data is empty
 * @param {string} props.emptyMessage - Message to show when empty
 */
export default function DataTable({ headers, children, isEmpty, emptyMessage = "No entities found in registry" }) {
  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={h.style}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="py-20 text-center opacity-30 italic font-bold tracking-widest text-xs">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
}
