import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import Deals from './components/Deals';
import CalendarView from './components/Calendar';
import Settings from './components/Settings';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import AuditLogView from './components/AuditLog';
import { User } from './types/auth';
import { getCurrentUser, logout, hasPermission } from './auth';
import { Customer, Vehicle, Deal, Appointment } from './types';
import {
  getCustomers, saveCustomers,
  getVehicles, saveVehicles,
  getDeals, saveDeals,
  getAppointments, saveAppointments,
} from './data';
import { Bell, Search, Menu, LogOut } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCustomers(getCustomers());
      setVehicles(getVehicles());
      setDeals(getDeals());
      setAppointments(getAppointments());
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCustomers(getCustomers());
    setVehicles(getVehicles());
    setDeals(getDeals());
    setAppointments(getAppointments());
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const handleSaveCustomers = (data: Customer[]) => {
    setCustomers(data);
    saveCustomers(data);
  };

  const handleSaveVehicles = (data: Vehicle[]) => {
    setVehicles(data);
    saveVehicles(data);
  };

  const handleSaveDeals = (data: Deal[]) => {
    setDeals(data);
    saveDeals(data);
  };

  const handleSaveAppointments = (data: Appointment[]) => {
    setAppointments(data);
    saveAppointments(data);
  };

  // Jeśli nie zalogowany, pokaż ekran logowania
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard customers={customers} vehicles={vehicles} deals={deals} appointments={appointments} />;
      case 'customers':
        return <Customers customers={customers} onSave={handleSaveCustomers} />;
      case 'inventory':
        return <Inventory vehicles={vehicles} onSave={handleSaveVehicles} />;
      case 'deals':
        return <Deals deals={deals} customers={customers} vehicles={vehicles} onSave={handleSaveDeals} />;
      case 'calendar':
        return <CalendarView appointments={appointments} customers={customers} vehicles={vehicles} onSave={handleSaveAppointments} />;
      case 'users':
        return hasPermission('users', 'read') ? <UserManagement /> : <div className="text-center py-12 text-gray-500">Brak uprawnień</div>;
      case 'audit':
        return hasPermission('settings', 'read') ? <AuditLogView /> : <div className="text-center py-12 text-gray-500">Brak uprawnień</div>;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard customers={customers} vehicles={vehicles} deals={deals} appointments={appointments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          userRole={currentUser.role}
        />
      </div>

      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
          collapsed={false}
          setCollapsed={() => {}}
          userRole={currentUser.role}
        />
      </div>

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj..."
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={18} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'manager' ? 'Manager' : 'Sprzedawca'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Wyloguj"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
