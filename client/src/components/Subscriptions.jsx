import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
   CreditCard,
   FileText,
   History,
   ChevronLeft,
   Search,
   Filter,
   Download,
   CheckCircle2,
   AlertCircle,
   Clock,
   ExternalLink,
   Server,
   RefreshCw,
   LayoutGrid,
   List,
   Plus,
   Edit3,
   Trash2,
   X,
   TrendingUp,
   DollarSign,
   PieChart,
   Layers,
   ChevronDown
} from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import ClientRegistrySidebar from './ClientRegistrySidebar';
import DataTable, { Badge as SharedBadge } from './DataTable';


const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
   ? 'http://localhost:3001/api'
   : '/api';

const Container = styled.div`
  height: 100vh;
  animation: fadeIn 0.5s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SiteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const SiteCard = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
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
    background: ${props => props.active ? 'var(--color-accent)' : 'transparent'};
    transition: all 0.3s;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent);
    box-shadow: var(--color-shadow-lg);
    background: var(--color-panel-soft);
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--color-panel-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: var(--color-accent);
  }

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
  }

  .meta {
    display: flex;
    align-items: center;
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
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--color-panel-soft);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--color-panel-strong);
      color: var(--color-text-strong);
      border-color: var(--color-accent);
    }
  }

  .title-area {
    h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-text-strong);
      letter-spacing: -0.02em;
    }
    p {
      color: var(--color-text-muted);
      font-size: 0.9rem;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
`;

const Tab = styled.button`
  background: transparent;
  border: none;
  padding: 0.75rem 1.25rem;
  color: ${props => props.active ? 'var(--color-accent)' : 'var(--color-text-muted)'};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.6rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? 'var(--color-accent)' : 'transparent'};
    transition: all 0.2s;
  }

  &:hover {
    color: var(--color-text-strong);
  }

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;



const Skeleton = styled.div`
  background: linear-gradient(90deg, var(--color-panel-soft) 25%, var(--color-panel-strong) 50%, var(--color-panel-soft) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite linear;
  border-radius: ${props => props.radius || 'var(--radius-sm)'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  gap: 2rem;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(12px);
  margin-top: 2rem;
  box-shadow: 0 40px 100px -30px rgba(0,0,0,0.4);

  .loader-container {
     position: relative;
     width: 80px;
     height: 80px;
     display: flex;
     align-items: center;
     justify-content: center;
  }

  .pulse-ring {
     position: absolute;
     width: 100%;
     height: 100%;
     border: 2px solid var(--color-accent);
     border-radius: 50%;
     animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  }

  .spinner {
    animation: rotate 3s linear infinite;
    color: var(--color-accent);
    z-index: 10;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
     0% { transform: scale(0.7); opacity: 0; }
     50% { opacity: 0.5; }
     100% { transform: scale(1.3); opacity: 0; }
  }
`;

const ModalOverlay = styled.div`
   position: fixed;
   inset: 0;
   background: rgba(0,0,0,0.8);
   backdrop-filter: blur(8px);
   z-index: 1000;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 1rem;
`;

const ModalContent = styled.div`
   background: var(--color-bg-card);
   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   width: 100%;
   max-width: 600px;
   max-height: 90vh;
   overflow-y: auto;
   padding: 0.6rem   1.2rem;
   padding-top: 0rem;
   position: relative;
   box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);

   .close-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      color: var(--color-text-muted);
      cursor: pointer;
      &:hover { color: var(--color-text-strong); }
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
   
   .icon-box {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${props => props.color}20;
      color: ${props => props.color};
      border: 1px solid ${props => props.color}30;
   }

   .content {
      h4 {
         font-size: 0.75rem;
         font-weight: 700;
         color: var(--color-text-secondary);
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

const ChartWrapper = styled.div`
   background: var(--color-bg-card);
   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   padding: 2rem;
   margin-bottom: 2rem;
   
   .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h3 {
         font-size: 1.1rem;
         font-weight: 800;
         color: var(--color-text-strong);
         letter-spacing: -0.01em;
      }
   }
`;

const BarContainer = styled.div`
   height: 240px;
   display: flex;
   align-items: flex-end;
   gap: 1.5rem;
   padding-bottom: 2rem;
   border-bottom: 1px solid var(--color-border);
   margin-bottom: 1rem;
   margin-left: 50px; /* Space for Y-axis */
   position: relative;
`;

const YAxis = styled.div`
   position: absolute;
   left: -50px;
   bottom: 2rem;
   top: 0;
   width: 40px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   align-items: flex-end;
   color: var(--color-text-muted);
   font-size: 0.6rem;
   font-weight: 800;
   font-mono: true;
`;

const MonthGroup = styled.div`
   flex: 1;
   display: flex;
   align-items: flex-end;
   justify-content: center;
   gap: 2px;
   height: 100%;
   position: relative;
`;

const Bar = styled.div`
   width: 12px;
   background: ${props => props.type === 'billed' ? 'linear-gradient(to top, #7c3aed, #a78bfa)' : 'linear-gradient(to top, #10b981, #34d399)'};
   border-radius: 4px 4px 1px 1px;
   transition: height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
   height: ${props => props.height}%;
   
   &:hover {
      filter: brightness(1.2);
      &::after {
         content: '${props => props.label}';
         position: absolute;
         top: -30px;
         left: 50%;
         transform: translateX(-50%);
         font-size: 0.7rem;
         font-weight: 800;
         color: var(--color-text-strong);
         background: var(--color-bg-header);
         padding: 4px 8px;
         border-radius: var(--radius-sm);
         white-space: nowrap;
         border: 1px solid var(--color-border);
         z-index: 10;
      }
   }
`;

const BarLabel = styled.div`
   text-align: center;
   font-size: 0.65rem;
   font-weight: 700;
   color: var(--color-text-muted);
   color: var(--color-text-muted);
   letter-spacing: 0.05em;
   margin-top: 0.75rem;
`;

const FlexContainer = styled.div`
  display: flex;
  height: 100%;
`;


const MainContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 10px; }
`;

export default function Subscriptions({
   bridges, products, clients, filterProduct,
   selectedClientId, setSelectedClientId,
   refreshToggle, setRefreshToggle,
   fiscalYear
}) {
   const [selectedBridge, setSelectedBridge] = useState(null);
   const [activeTab, setActiveTab] = useState('overview'); // overview, plans, bills, payments
   const [data, setData] = useState([]);
   const [overviewData, setOverviewData] = useState({ bills: [], payments: [] });
   const [loading, setLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   const triggerRefresh = () => setRefreshToggle(prev => prev + 1);

   // CRUD State
   const [showModal, setShowModal] = useState(false);
   const [modalData, setModalData] = useState({
      id: '', plan_name: '', description: '', amount: '', currency: 'KES', billing_cycle: 'monthly', features: '', is_active: 1
   });

   useEffect(() => {
      if (selectedBridge) {
         if (activeTab === 'overview') {
            fetchOverviewData();
         } else {
            fetchTabData();
         }
      }
   }, [selectedBridge, activeTab, refreshToggle, fiscalYear]);

   const getMapping = () => {
      const product = products.find(p => String(p.id) === String(selectedBridge?.product_id));
      return product?.field_mapping || {};
   };

   const fetchOverviewData = async () => {
      if (!selectedBridge) return;
      setLoading(true);
      const fm = getMapping();
      const dbParam = fm.licence_db ? `?db=${fm.licence_db}` : '';

      try {
         const billsTbl = fm.licence_bills_table || 'bills';
         const paymentsTbl = fm.licence_payments_table || 'bill_payments';

         const [billsRes, paymentsRes] = await Promise.all([
            axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${billsTbl}${dbParam}`),
            axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${paymentsTbl}${dbParam}`)
         ]);

         setOverviewData({
            bills: Array.isArray(billsRes.data) ? billsRes.data : [],
            payments: Array.isArray(paymentsRes.data) ? paymentsRes.data : []
         });
      } catch (error) {
         console.error("Overview Fetch Error:", error);
      } finally {
         setLoading(false);
      }
   };

   const fetchTabData = async () => {
      if (!selectedBridge) return;
      setLoading(true);

      const fm = getMapping();
      let tableName = '';
      if (activeTab === 'plans') tableName = fm.licence_subscriptions_table || 'license_subscriptions';
      if (activeTab === 'bills') tableName = fm.licence_bills_table || 'bills';
      if (activeTab === 'payments') tableName = fm.licence_payments_table || 'bill_payments';

      const dbParam = fm.licence_db ? `?db=${fm.licence_db}` : '';

      try {
         const res = await axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}${dbParam}`);
         setData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
         console.error("Table Fetch Error:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleSaveSubscription = async (e) => {
      e.preventDefault();
      const fm = getMapping();
      let tableName = fm.licence_subscriptions_table || 'license_subscriptions';
      const dbParam = fm.licence_db ? `?db=${fm.licence_db}` : '';

      try {
         if (modalData.id) {
            await axios.put(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}/${modalData.id}${dbParam}`, modalData);
         } else {
            await axios.post(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}${dbParam}`, modalData);
         }
         setShowModal(false);
         triggerRefresh();
      } catch (error) {
         alert("Action Failed");
      }
   };

   const handleDelete = async (rowId) => {
      if (!confirm("Are you sure?")) return;
      const fm = getMapping();
      let tableName = '';
      if (activeTab === 'plans') tableName = fm.licence_subscriptions_table || 'license_subscriptions';
      if (activeTab === 'bills') tableName = fm.licence_bills_table || 'bills';
      if (activeTab === 'payments') tableName = fm.licence_payments_table || 'bill_payments';
      const dbParam = fm.licence_db ? `?db=${fm.licence_db}` : '';

      try {
         await axios.delete(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}/${rowId}${dbParam}`);
         triggerRefresh();
      } catch (error) {
         alert("Delete Failed");
      }
   };

   const filteredSites = bridges.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.db_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClient = !selectedClientId || String(s.client_id) === String(selectedClientId);

      if (filterProduct) {
         return matchesSearch && matchesClient && String(s.product_id) === String(filterProduct.id);
      }
      return matchesSearch && matchesClient;
   });

   const filteredClients = Array.isArray(clients) ? clients.filter(c => {
      if (!filterProduct) return true;
      return bridges.some(b => String(b.client_id) === String(c.id) && String(b.product_id) === String(filterProduct.id));
   }) : [];

   const countsByClient = Array.isArray(clients) ? clients.reduce((acc, c) => {
      if (filterProduct) {
         acc[c.id] = bridges.filter(b => String(b.client_id) === String(c.id) && String(b.product_id) === String(filterProduct.id)).length;
      } else {
         acc[c.id] = bridges.filter(b => String(b.client_id) === String(c.id)).length;
      }
      return acc;
   }, {}) : {};

   // Calculations for Overview
   const totalBilled = overviewData.bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
   const totalPaid = overviewData.bills.reduce((sum, b) => sum + parseFloat(b.paid_amount || 0), 0);
   const totalBalance = overviewData.bills.reduce((sum, b) => sum + parseFloat(b.balance || 0), 0);
   const collectionRate = totalBilled > 0 ? (totalPaid / totalBilled * 100).toFixed(1) : 0;

   // Pre-fill with last 10 years
   const currentY = new Date().getFullYear();
   const availableYears = Array.from({ length: 10 }, (_, i) => currentY - i);

   // Aggregated 12 Months filtered by selectedYear
   const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   const aggregatedMonths = monthLabels.map((m, idx) => {
      const billsInMonth = overviewData.bills.filter(b => {
         const d = new Date(b.created_at);
         return (b.bill_month?.includes(m) || d.getMonth() === idx) && d.getFullYear() === fiscalYear;
      });
      const paymentsInMonth = overviewData.payments.filter(p => {
         const d = new Date(p.payment_date);
         return d.getMonth() === idx && d.getFullYear() === fiscalYear;
      });
      return {
         month: m,
         billed: billsInMonth.reduce((s, x) => s + parseFloat(x.amount || 0), 0),
         paid: paymentsInMonth.reduce((s, x) => s + parseFloat(x.amount || 0), 0)
      };
   });

   const maxVal = Math.max(...aggregatedMonths.map(m => Math.max(m.billed, m.paid)), 100);


   const [textSearch, setTextSearch] = useState('');

   const filteredData = data.filter(row =>
      Object.values(row).some(val =>
         val !== null && val.toString().toLowerCase().includes(textSearch.toLowerCase())
      )
   );

   const getBadgeColor = (type) => {
      switch (type) {
         case 'success': return '#10b981';
         case 'warning': return '#f59e0b';
         case 'error': return '#ef4444';
         case 'info': return '#3b82f6';
         default: return '#64748b';
      }
   };

   if (!selectedBridge) {
      return (
         <Container>
            <FlexContainer>
               <ClientRegistrySidebar
                  clients={filteredClients}
                  bridges={bridges}
                  selectedClientId={selectedClientId}
                  setSelectedClientId={setSelectedClientId}
                  setSelectedBridge={setSelectedBridge}
                  filterProduct={filterProduct}
                  countsByClient={countsByClient}
                  triggerRefresh={triggerRefresh}
               />
               <MainContentArea>
                  <div className="flex justify-between items-end mb-8">
                     <div>
                        <h1 className="text-4xl font-black text-gradient tracking-tight">Licence Hub</h1>
                        <p className="text-slate-500 font-medium mt-2">Manage subscriptions and billing across your network</p>
                     </div>
                     <div className="flex gap-4 items-center">
                        {filterProduct && (
                           <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2" style={{ borderRadius: 'var(--radius-md)' }}>
                              <div className="w-2 h-2 rounded-full bg-indigo-500" />
                              <span className="text-[10px] font-black tracking-widest text-indigo-400">Filtering: {filterProduct.name}</span>
                           </div>
                        )}
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                           <input
                              type="text"
                              placeholder="Search sites..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[var(--color-accent)] outline-none min-w-[280px] transition-all"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                           />
                        </div>
                     </div>
                  </div>

                  <SiteGrid>
                     {filteredSites.map(s => (
                        <SiteCard key={s.id} onClick={() => setSelectedBridge(s)}>
                           <div className="icon-wrapper">
                              <Server size={24} />
                           </div>
                           <h3>{s.name}</h3>
                           <p>{s.db_name || 'Production Instance'}</p>

                           <div className="meta">
                              <span><Clock size={12} /> Last synced 2m ago</span>
                              <span><SharedBadge color={s.status === 'Online' ? '#10b981' : '#ef4444'}>{s.status}</SharedBadge></span>
                           </div>
                        </SiteCard>
                     ))}
                  </SiteGrid>
                  {filteredSites.length === 0 && (
                     <div className="py-24 text-center opacity-30">
                        <Search size={48} className="mx-auto mb-4 text-slate-800" />
                        <p className="text-xl font-black tracking-[0.4em]">No matching sites</p>
                     </div>
                  )}
               </MainContentArea>
            </FlexContainer>
         </Container>
      );
   }

   return (
      <Container>
         <FlexContainer>
            <ClientRegistrySidebar
               clients={filteredClients}
               bridges={bridges}
               selectedClientId={selectedClientId}
               setSelectedClientId={setSelectedClientId}
               setSelectedBridge={setSelectedBridge}
               filterProduct={filterProduct}
               countsByClient={countsByClient}
               triggerRefresh={triggerRefresh}
            />
            <MainContentArea>
               <DetailHeader>
                  <div className="flex items-center gap-6">
                     {/* <button className="back-btn" onClick={() => setSelectedBridge(null)}>
                        <ChevronLeft size={18} /> Back to Hub
                     </button> */}
                     <div>
                        <h1 className="text-4xl font-black text-gradient tracking-tight">{selectedBridge.client_name}</h1>
                        <p className="text-slate-500 font-medium mt-2">Managing licence architecture for {selectedBridge.db_name}</p>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <button className="back-btn" onClick={triggerRefresh} style={{ borderRadius: 'var(--radius-sm)' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Stream
                     </button>
                  </div>
               </DetailHeader>
               <TabContainer>
                  <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                     <TrendingUp size={18} /> Overview
                  </Tab>
                  <Tab active={activeTab === 'plans'} onClick={() => setActiveTab('plans')}>
                     <Layers size={18} /> Plans
                  </Tab>
                  <Tab active={activeTab === 'bills'} onClick={() => setActiveTab('bills')}>
                     <FileText size={18} /> Bills
                  </Tab>
                  <Tab active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>
                     <History size={18} /> Payments
                  </Tab>
               </TabContainer>

               {loading ? (
                  <div className="animate-in-fade space-y-8">
                     <div className="flex gap-6">
                        <Skeleton height="100px" radius="var(--radius-sm)" />
                        <Skeleton height="100px" radius="var(--radius-sm)" />
                        <Skeleton height="100px" radius="var(--radius-sm)" />
                        <Skeleton height="100px" radius="var(--radius-sm)" />
                     </div>
                     <Skeleton height="300px" radius="var(--radius-sm)" />
                     <LoadingOverlay>
                        <div className="loader-container">
                           <div className="pulse-ring" />
                           <RefreshCw size={40} className="spinner" />
                        </div>
                        <div className="text-center">
                           <p className="font-black tracking-[0.4em] text-xs text-white">Quantum Link Active</p>
                           <p className="text-[10px] text-slate-500 tracking-widest mt-2 px-10">Synchronizing remote telemetry protocols and establishing site persistence hub...</p>
                        </div>
                     </LoadingOverlay>
                  </div>
               ) : activeTab === 'overview' ? (
                  <div className="animate-in-fade">
                     <StatGrid>
                        <StatCard color="#8b5cf6">
                           <div className="icon-box"><DollarSign size={24} /></div>
                           <div className="content">
                              <h4>Total Billed</h4>
                              <div className="value">KES {totalBilled.toLocaleString()}</div>
                           </div>
                        </StatCard>
                        <StatCard color="#10b981">
                           <div className="icon-box"><CheckCircle2 size={24} /></div>
                           <div className="content">
                              <h4>Total Received</h4>
                              <div className="value">KES {totalPaid.toLocaleString()}</div>
                           </div>
                        </StatCard>
                        <StatCard color="#f59e0b">
                           <div className="icon-box"><AlertCircle size={24} /></div>
                           <div className="content">
                              <h4>Outstanding</h4>
                              <div className="value">KES {totalBalance.toLocaleString()}</div>
                           </div>
                        </StatCard>
                        <StatCard color="#3b82f6">
                           <div className="icon-box"><PieChart size={24} /></div>
                           <div className="content">
                              <h4>Collection Rate</h4>
                              <div className="value">{collectionRate}%</div>
                           </div>
                        </StatCard>
                     </StatGrid>


                     <ChartWrapper>
                        <div className="chart-header">
                           <div>
                              <h3>Billing & Revenue Performance</h3>
                              <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">Full Annual Cycle • Jan - Dec</p>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                 <span className="text-[10px] font-bold text-slate-500">Total Billed</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                 <span className="text-[10px] font-bold text-slate-500">Total Paid</span>
                              </div>
                           </div>
                        </div>
                        <BarContainer>
                           <YAxis>
                              {[1, 0.75, 0.5, 0.25, 0].map(p => (
                                 <div key={p}>{(maxVal * p / 1000).toFixed(0)}K</div>
                              ))}
                           </YAxis>
                           {aggregatedMonths.map(m => (
                              <MonthGroup key={m.month}>
                                 <Bar type="billed" height={(m.billed / maxVal * 100)} label={`Billed: KES ${m.billed.toLocaleString()}`} />
                                 <Bar type="paid" height={(m.paid / maxVal * 100)} label={`Paid: KES ${m.paid.toLocaleString()}`} />
                              </MonthGroup>
                           ))}
                        </BarContainer>
                        <div className="flex gap-0 ml-[50px]">
                           {monthLabels.map(m => <div key={m} className="flex-1 text-center"><BarLabel>{m}</BarLabel></div>)}
                        </div>
                     </ChartWrapper>
                  </div>
               ) : (
                  <div className="animate-in-fade space-y-6">
                     <div className="flex justify-between items-center bg-transparent pt-4">
                        <div className="flex items-center gap-6">
                           <div className="text-xs font-black text-slate-500 tracking-widest">{activeTab} Stream</div>
                           <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                              <input
                                 type="text"
                                 placeholder={`Search ${activeTab}...`}
                                 value={textSearch}
                                 onChange={(e) => setTextSearch(e.target.value)}
                                 className="bg-black/20 border border-white/5 py-3 pl-10 pr-6 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-[280px] transition-all"
                                 style={{ borderRadius: 'var(--radius-sm)' }}
                              />
                           </div>
                        </div>
                        {activeTab === 'plans' && (
                           <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 text-[10px] font-black tracking-widest flex items-center gap-3 transition-all"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                              onClick={() => {
                                 setModalData({ id: '', plan_name: '', description: '', amount: 0, currency: 'KES', billing_cycle: 'monthly', features: '', is_active: 1 });
                                 setShowModal(true);
                              }}>
                              <Plus size={16} /> Add Plan
                           </button>
                        )}
                     </div>
                     <DataTable
                        headers={data.length > 0 ? [
                           ...Object.keys(data[0]).map(k => ({ label: k.replace(/_/g, ' ') })),
                           { label: 'Actions', style: { textAlign: 'right' } }
                        ] : [
                           { label: 'No records found in this module' },
                           { label: 'Actions', style: { textAlign: 'right' } }
                        ]}
                        isEmpty={filteredData.length === 0 && data.length > 0}
                        emptyMessage={`No matching results for "${textSearch}"`}
                     >
                        {filteredData.map((row, i) => (
                           <tr key={i}>
                              {Object.entries(row).map(([key, val], j) => (
                                 <td key={j}>
                                    {key === 'status' || key === 'is_active' ? (
                                       <SharedBadge color={getBadgeColor(
                                          val === 'paid' || val === 1 || val === true || val === 'active' ? 'success' :
                                             val === 'pending' || val === 'partial' ? 'warning' : 'error'
                                       )}>
                                          {val === 1 || val === true ? 'Active' : val === 0 || val === false ? 'Inactive' : val}
                                       </SharedBadge>
                                    ) : (
                                       val === null ? <span className="text-slate-600 italic">null</span> : val.toString()
                                    )}
                                 </td>
                              ))}
                              <td>
                                 <div className="flex justify-end gap-3 px-4">
                                    {activeTab === 'plans' && (
                                       <button className="p-2 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                          style={{ borderRadius: 'var(--radius-sm)' }}
                                          onClick={() => {
                                             setModalData(row);
                                             setShowModal(true);
                                          }}>
                                          <Edit3 size={16} />
                                       </button>
                                    )}
                                    <button className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all"
                                       style={{ borderRadius: 'var(--radius-sm)' }}
                                       onClick={() => handleDelete(row.id)}>
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                        {filteredData.length === 0 && data.length > 0 && (
                           <tr><td colSpan="100%" className="py-20 text-center opacity-30 italic text-[10px] font-bold tracking-widest">No matching results for "{textSearch}"</td></tr>
                        )}
                     </DataTable>
                  </div>
               )}
            </MainContentArea>
         </FlexContainer>

         {showModal && (
            <ModalOverlay onClick={() => setShowModal(false)}>
               <ModalContent onClick={e => e.stopPropagation()} className="animate-in-slide-up">
                  <X className="close-btn" size={20} onClick={() => setShowModal(false)} />
                  <div className="mb-8">
                     <h2 className="text-2xl font-black tracking-tight text-white">{modalData.id ? 'Modify Plan Architecture' : 'Initialize New Plan'}</h2>
                     <p className="text-[10px] text-slate-500 tracking-widest mt-1">Remote Site Persistence Layer</p>
                  </div>

                  <form onSubmit={handleSaveSubscription} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Plan Name</label>
                        <input required value={modalData.plan_name} onChange={e => setModalData({ ...modalData, plan_name: e.target.value })}
                           className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white"
                           style={{ borderRadius: 'var(--radius-sm)' }}
                           placeholder="e.g. Enterprise Tier" />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Description</label>
                        <textarea rows="3" value={modalData.description} onChange={e => setModalData({ ...modalData, description: e.target.value })}
                           className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white"
                           style={{ borderRadius: 'var(--radius-lg)' }}
                           placeholder="Module scope and permissions..." />
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Amount</label>
                           <input type="number" required value={modalData.amount} onChange={e => setModalData({ ...modalData, amount: e.target.value })}
                              className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white"
                              style={{ borderRadius: 'var(--radius-lg)' }}
                              placeholder="5000" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Currency</label>
                           <input required value={modalData.currency} onChange={e => setModalData({ ...modalData, currency: e.target.value })}
                              className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white font-mono"
                              style={{ borderRadius: 'var(--radius-lg)' }}
                              placeholder="KES" />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Billing Cycle</label>
                           <select value={modalData.billing_cycle} onChange={e => setModalData({ ...modalData, billing_cycle: e.target.value })}
                              className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white appearance-none"
                              style={{ borderRadius: 'var(--radius-lg)' }}
                           >
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="lifetime">Lifetime</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Initial Status</label>
                           <select value={modalData.is_active} onChange={e => setModalData({ ...modalData, is_active: parseInt(e.target.value) })}
                              className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white appearance-none"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                           >
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 tracking-widest px-1">Features</label>
                        <input value={modalData.features} onChange={e => setModalData({ ...modalData, features: e.target.value })}
                           className="w-full bg-black/40 border border-white/5 px-5 py-4 text-xs outline-none focus:border-indigo-500/30 text-white"
                           style={{ borderRadius: 'var(--radius-lg)' }}
                           placeholder="Full API Access..." />
                     </div>

                     <div className="pt-4 flex gap-4">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 py-4 text-[11px] font-black tracking-widest transition-all text-slate-400" style={{ borderRadius: 'var(--radius-lg)' }}>Cancel</button>
                        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-4 text-[11px] font-black tracking-widest transition-all shadow-xl shadow-indigo-600/30 text-white" style={{ borderRadius: 'var(--radius-lg)' }}>Commit Changes</button>
                     </div>
                  </form>
               </ModalContent>
            </ModalOverlay>
         )}
      </Container>
   );
}
