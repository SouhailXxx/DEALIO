import { TrendingUp, Users, Car, Briefcase, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { Customer, Vehicle, Deal, Appointment } from '../types';
import { formatPLN } from '../data';

interface DashboardProps {
  customers: Customer[];
  vehicles: Vehicle[];
  deals: Deal[];
  appointments: Appointment[];
}

export default function Dashboard({ customers, vehicles, deals, appointments }: DashboardProps) {
  const totalRevenue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.value, 0);

  const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const activeCustomers = customers.filter(c => c.status !== 'inactive');
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');

  const inventoryValue = availableVehicles.reduce((sum, v) => sum + v.price, 0);

  const stats = [
    {
      label: 'Przychód (miesiąc)',
      value: formatPLN(totalRevenue),
      change: '+12.5%',
      positive: true,
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      label: 'Aktywni klienci',
      value: activeCustomers.length.toString(),
      change: '+3',
      positive: true,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Dostępne pojazdy',
      value: availableVehicles.length.toString(),
      change: '-2',
      positive: false,
      icon: Car,
      color: 'bg-purple-500',
    },
    {
      label: 'Otwarte transakcje',
      value: activeDeals.length.toString(),
      change: '+1',
      positive: true,
      icon: Briefcase,
      color: 'bg-amber-500',
    },
  ];

  const recentDeals = deals.slice(0, 5);
  const stageLabels: Record<string, string> = {
    lead: 'Lead',
    negotiation: 'Negocjacje',
    offer: 'Oferta',
    closed_won: 'Wygrana',
    closed_lost: 'Przegrana',
  };

  const stageColors: Record<string, string> = {
    lead: 'bg-gray-100 text-gray-700',
    negotiation: 'bg-blue-100 text-blue-700',
    offer: 'bg-amber-100 text-amber-700',
    closed_won: 'bg-emerald-100 text-emerald-700',
    closed_lost: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel główny</h1>
        <p className="text-gray-500 mt-1">Witaj z powrotem, Adam! Oto podsumowanie Twojego salonu.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Ostatnie transakcje</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {recentDeals.map((deal) => {
                const customer = customers.find(c => c.id === deal.customerId);
                const vehicle = vehicles.find(v => v.id === deal.vehicleId);
                return (
                  <div key={deal.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vehicle?.make} {vehicle?.model} {vehicle?.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatPLN(deal.value)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${stageColors[deal.stage]}`}>
                        {stageLabels[deal.stage]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Nadchodzące spotkania</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((apt) => {
                const customer = customers.find(c => c.id === apt.customerId);
                const typeLabels: Record<string, string> = {
                  test_drive: 'Jazda próbna',
                  meeting: 'Spotkanie',
                  delivery: 'Odbiór pojazdu',
                  service: 'Serwis',
                };
                const typeColors: Record<string, string> = {
                  test_drive: 'bg-blue-100 text-blue-700',
                  meeting: 'bg-purple-100 text-purple-700',
                  delivery: 'bg-emerald-100 text-emerald-700',
                  service: 'bg-amber-100 text-amber-700',
                };
                return (
                  <div key={apt.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{apt.date} o {apt.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${typeColors[apt.type]}`}>
                      {typeLabels[apt.type]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Podsumowanie magazynu</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-700">{availableVehicles.length}</p>
              <p className="text-sm text-emerald-600">Dostępne</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-700">{vehicles.filter(v => v.status === 'reserved').length}</p>
              <p className="text-sm text-amber-600">Zarezerwowane</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{vehicles.filter(v => v.status === 'sold').length}</p>
              <p className="text-sm text-blue-600">Sprzedane</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-700">{formatPLN(inventoryValue)}</p>
              <p className="text-sm text-purple-600">Wartość magazynu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
