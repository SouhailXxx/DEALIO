import { 
  LayoutDashboard, Users, Car, Briefcase, Calendar, 
  Settings, LogOut, ChevronLeft, ChevronRight, UserCog, Activity
} from 'lucide-react';
import { User } from '../types/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userRole: User['role'];
}

const allMenuItems = [
  { id: 'dashboard', label: 'Panel główny', icon: LayoutDashboard, roles: ['admin', 'manager', 'salesman'] },
  { id: 'customers', label: 'Klienci', icon: Users, roles: ['admin', 'manager', 'salesman'] },
  { id: 'inventory', label: 'Magazyn', icon: Car, roles: ['admin', 'manager', 'salesman'] },
  { id: 'deals', label: 'Transakcje', icon: Briefcase, roles: ['admin', 'manager', 'salesman'] },
  { id: 'calendar', label: 'Kalendarz', icon: Calendar, roles: ['admin', 'manager', 'salesman'] },
  { id: 'users', label: 'Użytkownicy', icon: UserCog, roles: ['admin'] },
  { id: 'audit', label: 'Dziennik audytu', icon: Activity, roles: ['admin', 'manager'] },
  { id: 'settings', label: 'Ustawienia', icon: Settings, roles: ['admin', 'manager', 'salesman'] },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, userRole }: SidebarProps) {
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));
  return (
    <aside className={`bg-slate-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="font-bold text-lg">AutoCRM</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white border-r-4 border-blue-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
            {userRole === 'admin' ? 'AD' : userRole === 'manager' ? 'MG' : 'SP'}
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">
                {userRole === 'admin' ? 'Administrator' : userRole === 'manager' ? 'Manager' : 'Sprzedawca'}
              </p>
              <p className="text-xs text-slate-400">AutoCRM</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
