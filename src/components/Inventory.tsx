import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Fuel, Gauge, Calendar, Car } from 'lucide-react';
import { Vehicle } from '../types';
import { generateId, formatPLN } from '../data';

interface InventoryProps {
  vehicles: Vehicle[];
  onSave: (vehicles: Vehicle[]) => void;
}

const emptyVehicle: Omit<Vehicle, 'id' | 'createdAt'> = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  vin: '',
  color: '',
  fuelType: 'benzyna',
  transmission: 'manualna',
  mileage: 0,
  price: 0,
  purchasePrice: 0,
  status: 'available',
  description: '',
  images: [],
};

export default function Inventory({ vehicles, onSave }: InventoryProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyVehicle);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = vehicles.filter(v => {
    const query = search.toLowerCase();
    const matchesSearch = (
      v.make.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      v.vin.toLowerCase().includes(query) ||
      v.color.toLowerCase().includes(query)
    );
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenNew = () => {
    setForm(emptyVehicle);
    setEditingVehicle(null);
    setShowModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      mileage: vehicle.mileage,
      price: vehicle.price,
      purchasePrice: vehicle.purchasePrice,
      status: vehicle.status,
      description: vehicle.description,
      images: vehicle.images,
      registrationNumber: vehicle.registrationNumber,
    });
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingVehicle) {
      const updated = vehicles.map(v =>
        v.id === editingVehicle.id ? { ...v, ...form } : v
      );
      onSave(updated);
    } else {
      const newVehicle: Vehicle = {
        ...form,
        id: generateId(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      onSave([...vehicles, newVehicle]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
      onSave(vehicles.filter(v => v.id !== id));
    }
  };

  const statusLabels: Record<string, string> = {
    available: 'Dostępny',
    reserved: 'Zarezerwowany',
    sold: 'Sprzedany',
    service: 'Serwis',
  };

  const statusColors: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-700',
    reserved: 'bg-amber-100 text-amber-700',
    sold: 'bg-blue-100 text-blue-700',
    service: 'bg-red-100 text-red-700',
  };

  const fuelLabels: Record<string, string> = {
    benzyna: 'Benzyna',
    diesel: 'Diesel',
    hybryda: 'Hybryda',
    elektryczny: 'Elektryczny',
    lpg: 'LPG',
  };

  const carColors: Record<string, string> = {
    'Biały perłowy': 'bg-white border border-gray-200',
    'Czarny metalik': 'bg-gray-900',
    'Szary metalik': 'bg-gray-400',
    'Srebrny metalik': 'bg-gray-300',
    'Niebieski metalik': 'bg-blue-600',
    'Biały': 'bg-white border border-gray-200',
    'Czerwony': 'bg-red-600',
    'Zielony metalik': 'bg-emerald-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Magazyn pojazdów</h1>
          <p className="text-gray-500 mt-1">Zarządzaj stanem magazynowym salonu</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Dodaj pojazd</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj po marce, modelu, VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        >
          <option value="all">Wszystkie statusy</option>
          <option value="available">Dostępne</option>
          <option value="reserved">Zarezerwowane</option>
          <option value="sold">Sprzedane</option>
          <option value="service">Serwis</option>
        </select>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
          >
            Siatka
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Car color indicator */}
              <div className={`h-32 ${carColors[vehicle.color] || 'bg-gray-200'} flex items-center justify-center relative`}>
                <span className="text-4xl">🚗</span>
                <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${statusColors[vehicle.status]}`}>
                  {statusLabels[vehicle.status]}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.color}</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{formatPLN(vehicle.price)}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Fuel size={12} /> {fuelLabels[vehicle.fuelType]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge size={12} /> {vehicle.mileage.toLocaleString('pl-PL')} km
                  </span>
                  <span className="flex items-center gap-1">
                    {vehicle.transmission === 'automatyczna' ? '⚙️ Auto' : '⚙️ Manual'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">VIN: {vehicle.vin.slice(0, 11)}...</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Pojazd</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rok</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Przebieg</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Paliwo</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Cena</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-900">{vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-gray-500">{vehicle.color}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{vehicle.year}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{vehicle.mileage.toLocaleString('pl-PL')} km</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{fuelLabels[vehicle.fuelType]}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{formatPLN(vehicle.price)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[vehicle.status]}`}>
                      {statusLabels[vehicle.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(vehicle)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(vehicle.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Car size={40} className="mx-auto mb-3 text-gray-300" />
          <p>Nie znaleziono pojazdów</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingVehicle ? 'Edytuj pojazd' : 'Dodaj nowy pojazd'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
                  <input
                    type="text"
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rok produkcji</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kolor</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Przebieg (km)</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => setForm({ ...form, mileage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                <input
                  type="text"
                  value={form.vin}
                  onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
                  maxLength={17}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paliwo</label>
                  <select
                    value={form.fuelType}
                    onChange={(e) => setForm({ ...form, fuelType: e.target.value as Vehicle['fuelType'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="benzyna">Benzyna</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybryda">Hybryda</option>
                    <option value="elektryczny">Elektryczny</option>
                    <option value="lpg">LPG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skrzynia biegów</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value as Vehicle['transmission'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="manualna">Manualna</option>
                    <option value="automatyczna">Automatyczna</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cena sprzedaży (PLN)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cena zakupu (PLN)</label>
                  <input
                    type="number"
                    value={form.purchasePrice}
                    onChange={(e) => setForm({ ...form, purchasePrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Vehicle['status'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="available">Dostępny</option>
                  <option value="reserved">Zarezerwowany</option>
                  <option value="sold">Sprzedany</option>
                  <option value="service">Serwis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {editingVehicle ? 'Zapisz zmiany' : 'Dodaj pojazd'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
