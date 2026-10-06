import { 
  LayoutDashboard, Users, Car, Briefcase, Calendar, 
  Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Panel główny', icon: LayoutDashboard },
  { id: 'customers', label: 'Klienci', icon: Users },
  { id: 'inventory', label: 'Magazyn', icon: Car },
  { id: 'deals', label: 'Transakcje', icon: Briefcase },
  { id: 'calendar', label: 'Kalendarz', icon: Calendar },
  { id: 'settings', label: 'Ustawienia', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
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
            AN
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">Adam Nowicki</p>
              <p className="text-xs text-slate-400">Sprzedawca</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-slate-400 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
