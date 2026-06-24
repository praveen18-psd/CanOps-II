import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import DeliveryPersons from './pages/DeliveryPersons';
import RouteOverview from './pages/RouteOverview';
import Inventory from './pages/Inventory';
import Wallet from './pages/Wallet';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/delivery-persons" element={<DeliveryPersons />} />
          <Route path="/route-overview" element={<RouteOverview />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
