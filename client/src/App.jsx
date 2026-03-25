import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Sub-components
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NodesView from './components/NodesView';
import { ProductsView, ProductEditView } from './components/ProductsView';
import ClientsView from './components/ClientsView';
import MediaView from './components/MediaView';
import TableView1 from './components/TableView1';
import Header from './components/Header';
import AdminPosts from './components/AdminPosts';
import GenericView from './components/GenericView';
import BridgeTunnel from './components/BridgeTunnel';
import Subscriptions from './components/Subscriptions';
import { LogModal, BridgeModal, ClientModal } from './components/Modals';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
   ? 'http://localhost:3001/api'
   : '/api';

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
   const [view, setView] = useState('dashboard');
   const [bridges, setBridges] = useState([]);
   const [clients, setClients] = useState([]);
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showBridgeModal, setShowBridgeModal] = useState(false);
   const [bridgeForm, setBridgeForm] = useState({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '', tags: '' });
   const [showClientModal, setShowClientModal] = useState(false);
   const [clientForm, setClientForm] = useState({ name: '' });

   const [selectedProduct, setSelectedProduct] = useState(null);
   const [selectedBridge, setSelectedBridge] = useState(null);
   const [selectedTableIdx, setSelectedTableIdx] = useState(null);
   const [bridgeTableData, setBridgeTableData] = useState(null);
   const [dataLoading, setDataLoading] = useState(false);

   const [logs, setLogs] = useState([]);
   const [showLogModal, setShowLogModal] = useState(false);
   const [logLoading, setLogLoading] = useState(false);
   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

   // Global Auth Config
   axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

   useEffect(() => {
      const interceptor = axios.interceptors.response.use(
         res => res,
         err => {
            if (err.response?.status === 401) {
               localStorage.removeItem('token');
               setIsAuthenticated(false);
            }
            return Promise.reject(err);
         }
      );
      return () => axios.interceptors.response.eject(interceptor);
   }, []);

   useEffect(() => {
      document.body.classList.toggle('light-theme', theme === 'light');
      localStorage.setItem('theme', theme);
   }, [theme]);

   useEffect(() => {
      if (view === 'handshakes' && selectedBridge && selectedTableIdx !== null) {
         const p = products.find(prod => String(prod.id) === String(selectedBridge.product_id));
         const tableName = p?.field_mapping?.tables?.[selectedTableIdx]?.name;
         if (tableName) {
            setDataLoading(true);
            axios.get(`${API_BASE}/client-products/${selectedBridge.id}/tables/${tableName}`)
               .then(res => setBridgeTableData(res.data))
               .catch(() => setBridgeTableData([]))
               .finally(() => setDataLoading(false));
         }
      } else {
         setBridgeTableData(null);
      }
   }, [view, selectedBridge, selectedTableIdx, products]);

   const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setSelectedProduct(null);
      setSelectedBridge(null);
      setSelectedTableIdx(null);
   };

   const syncProduct = async (updatedProd) => {
      try {
         await axios.put(`${API_BASE}/products/${updatedProd.id}`, updatedProd);
         const res = await axios.get(`${API_BASE}/products`);
         setProducts(Array.isArray(res.data) ? res.data : []);
         const fresh = res.data.find(p => p.id === updatedProd.id);
         if (selectedProduct && selectedProduct.id === fresh.id) setSelectedProduct(fresh);
      } catch (e) { alert("Sync Failed"); }
   }

   const fetchData = async () => {
      try {
         const [b, c, p] = await Promise.all([
            axios.get(`${API_BASE}/analysis`),
            axios.get(`${API_BASE}/clients`),
            axios.get(`${API_BASE}/products`)
         ]);
         setBridges(Array.isArray(b.data) ? b.data : []);
         setClients(Array.isArray(c.data) ? c.data : []);
         setProducts(Array.isArray(p.data) ? p.data : []);
      } catch (e) { console.error(e); }
      setLoading(false);
   };

   const fetchLogs = async (id) => {
      setLogLoading(true);
      setShowLogModal(true);
      try {
         const res = await axios.get(`${API_BASE}/client-products/${id}/logs`);
         setLogs(res.data);
      } catch (e) { alert("Failed to reach remote logs"); }
      setLogLoading(false);
   };

   useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

   const handleEditProduct = async (prod) => {
      setSelectedProduct(prod);
      setSelectedTableIdx(null);
   };

   const handleSaveBridge = async (e) => {
      e.preventDefault();
      try {
         if (bridgeForm.id) {
            await axios.put(`${API_BASE}/client-products/${bridgeForm.id}`, bridgeForm);
         } else {
            await axios.post(`${API_BASE}/client-products`, bridgeForm);
         }
         setShowBridgeModal(false);
         setBridgeForm({ id: '', client_id: '', product_id: '', db_name: '', connection_string_name: '', tags: '' });
         fetchData();
      } catch (e) { alert("Action Failed"); }
   };

   const toggleLock = async (id) => {
      try {
         await axios.post(`${API_BASE}/sites/${id}/toggle-lock`);
         fetchData();
      } catch (e) { alert("Lock Toggle Failed: " + (e.response?.data?.error || e.message)); }
   };

   const deleteBridge = async (id) => {
      if (confirm("Disconnect Pipeline?")) {
         await axios.delete(`${API_BASE}/client-products/${id}`);
         fetchData();
      }
   };

   const toggleTheme = () => {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
   };

   const formatViewLabel = (value) => value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

   const headerMetaByView = {
      dashboard: {
         title: 'Operations Dashboard',
         subtitle: 'Live overview of network health, throughput, and module status',
      },
      handshakes: {
         title: 'Sites',
         subtitle: 'Manage site pipelines, statuses, and telemetry',
      },
      products: {
         title: 'Products',
         subtitle: 'Configure products, mappings, and synchronization settings',
      },
      clients: {
         title: 'Clients',
         subtitle: 'Manage client accounts and linked site resources',
      },
      media: {
         title: 'Media',
         subtitle: 'Browse and manage uploaded media assets',
      },
      subscriptions: {
         title: 'Subscriptions',
         subtitle: 'Monitor license deployments and billing activity',
      },
      posts: {
         title: 'Posts',
         subtitle: 'Create and manage post publishing content',
      },
      'admin-posts': {
         title: 'Admin Posts',
         subtitle: 'Control editorial workflows and post approvals',
      },
      pages: {
         title: 'Pages',
         subtitle: 'Manage static pages and page-level content',
      },
      comments: {
         title: 'Comments',
         subtitle: 'Review and moderate user comments',
      },
      appearance: {
         title: 'Appearance',
         subtitle: 'Adjust visual settings and UI presentation',
      },
      plugins: {
         title: 'Plugins',
         subtitle: 'Configure plugin integrations and extensions',
      },
      users: {
         title: 'Users',
         subtitle: 'Manage user access, permissions, and roles',
      },
      settings: {
         title: 'Settings',
         subtitle: 'Update system configuration and preferences',
      },
   };

   const headerMeta = headerMetaByView[view] || {
      title: formatViewLabel(view),
      subtitle: 'Manage this section from the control panel',
   };

   if (!isAuthenticated) return <Login API_BASE={API_BASE} onLogin={(tok) => {
      localStorage.setItem('token', tok);
      axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
      setIsAuthenticated(true);
   }} />;

   const renderContent = () => {
      switch (view) {
         case 'dashboard': return <Dashboard bridges={bridges} />;
         case 'handshakes': return <NodesView
            bridges={bridges}
            products={products}
            setSelectedBridge={setSelectedBridge}
            setSelectedTableIdx={setSelectedTableIdx}
            fetchLogs={fetchLogs}
            toggleLock={toggleLock}
            deleteBridge={deleteBridge}
            setBridgeForm={setBridgeForm}
            setShowBridgeModal={setShowBridgeModal}
         />;
         case 'products': return <ProductsView
            products={products}
            bridges={bridges}
            handleEditProduct={handleEditProduct}
         />;
         case 'clients': return <ClientsView
            clients={clients}
            bridges={bridges}
            setShowClientModal={setShowClientModal}
            setClientForm={setClientForm}
         />;
         case 'media': return <MediaView />;
         case 'subscriptions': return <Subscriptions bridges={bridges} products={products} />;
         case 'posts': return <TableView1 />;
         case 'admin-posts': return <AdminPosts />;
         default:
            if (['pages', 'comments', 'appearance', 'plugins', 'users', 'settings'].includes(view)) {
               return <GenericView view={view} />;
            }
            return <Dashboard bridges={bridges} />;
      }
   };

   return (
      <div className="flex min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)]">
         <Sidebar
            activeView={view}
            setView={setView}
            onLogout={handleLogout}
            setSelectedProduct={setSelectedProduct}
            setSelectedBridge={setSelectedBridge}
            setSelectedTableIdx={setSelectedTableIdx}
         />
         <div className="flex-1 ml-[260px] relative font-['Lexend']">
            <Header
               fetchData={fetchData}
               theme={theme}
               onToggleTheme={toggleTheme}
               title={headerMeta.title}
               subtitle={headerMeta.subtitle}
            />

            {renderContent()}

            {view === 'handshakes' && (
               <BridgeTunnel
                  selectedBridge={selectedBridge}
                  setSelectedBridge={setSelectedBridge}
                  products={products}
                  selectedTableIdx={selectedTableIdx}
                  setSelectedTableIdx={setSelectedTableIdx}
                  syncProduct={syncProduct}
                  bridgeTableData={bridgeTableData}
                  setBridgeTableData={setBridgeTableData}
                  dataLoading={dataLoading}
                  setDataLoading={setDataLoading}
                  API_BASE={API_BASE}
               />
            )}

            {view === 'products' && (
               <ProductEditView
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  selectedTableIdx={selectedTableIdx}
                  setSelectedTableIdx={setSelectedTableIdx}
                  syncProduct={syncProduct}
               />
            )}

            <LogModal showLogModal={showLogModal} setShowLogModal={setShowLogModal} logLoading={logLoading} logs={logs} />
            <BridgeModal
               showBridgeModal={showBridgeModal}
               setShowBridgeModal={setShowBridgeModal}
               bridgeForm={bridgeForm}
               setBridgeForm={setBridgeForm}
               clients={clients}
               products={products}
               handleSaveBridge={handleSaveBridge}
            />
            <ClientModal
               showClientModal={showClientModal}
               setShowClientModal={setShowClientModal}
               clientForm={clientForm}
               setClientForm={setClientForm}
               API_BASE={API_BASE}
               fetchData={fetchData}
            />
         </div>
      </div>
   );
}
export default App;
