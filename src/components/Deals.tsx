import { useState } from 'react';
import { Plus, X, ArrowRight, MoreVertical } from 'lucide-react';
import { Deal, Customer, Vehicle } from '../types';
import { generateId, formatPLN } from '../data';

interface DealsProps {
  deals: Deal[];
  customers: Customer[];
  vehicles: Vehicle[];
  onSave: (deals: Deal[]) => void;
}

const stages = [
  { id: 'lead', label: 'Lead', color: 'bg-gray-200' },
  { id: 'negotiation', label: 'Negocjacje', color: 'bg-blue-200' },
  { id: 'offer', label: 'Oferta', color: 'bg-amber-200' },
  { id: 'closed_won', label: 'Wygrana', color: 'bg-emerald-200' },
  { id: 'closed_lost', label: 'Przegrana', color: 'bg-red-200' },
];

export default function Deals({ deals, customers, vehicles, onSave }: DealsProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState({
    customerId: '',
    vehicleId: '',
    stage: 'lead' as Deal['stage'],
    value: 0,
    notes: '',
    assignedTo: 'Adam Nowicki',
  });

  const handleOpenNew = () => {
    setForm({
      customerId: '',
      vehicleId: '',
      stage: 'lead',
      value: 0,
      notes: '',
      assignedTo: 'Adam Nowicki',
    });
    setEditingDeal(null);
    setShowModal(true);
  };

  const handleEdit = (deal: Deal) => {
    setForm({
      customerId: deal.customerId,
      vehicleId: deal.vehicleId,
      stage: deal.stage,
      value: deal.value,
      notes: deal.notes,
      assignedTo: deal.assignedTo,
    });
    setEditingDeal(deal);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingDeal) {
      const updated = deals.map(d =>
        d.id === editingDeal.id
          ? { ...d, ...form, updatedAt: new Date().toISOString().split('T')[0] }
          : d
      );
      onSave(updated);
    } else {
      const newDeal: Deal = {
        ...form,
        id: generateId(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onSave([...deals, newDeal]);
    }
    setShowModal(false);
  };

  const handleMoveStage = (deal: Deal, newStage: Deal['stage']) => {
    const updated = deals.map(d =>
      d.id === deal.id
        ? { ...d, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] }
        : d
    );
    onSave(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
      onSave(deals.filter(d => d.id !== id));
    }
  };

  const totalPipeline = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);

  const wonValue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transakcje</h1>
          <p className="text-gray-500 mt-1">Zarządzaj procesem sprzedaży</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Nowa transakcja</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Wartość pipeline</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{formatPLN(totalPipeline)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Wygrane transakcje</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatPLN(wonValue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Liczba transakcji</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{deals.length}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={stage.id} className="min-w-[280px] flex-1">
              <div className={`rounded-t-lg px-4 py-2 ${stage.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-gray-800">{stage.label}</h3>
                  <span className="text-xs font-medium text-gray-600 bg-white/60 px-2 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{formatPLN(stageValue)}</p>
              </div>
              <div className="bg-gray-50 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                {stageDeals.map((deal) => {
                  const customer = customers.find(c => c.id === deal.customerId);
                  const vehicle = vehicles.find(v => v.id === deal.vehicleId);
                  const nextStage = stages[stages.findIndex(s => s.id === stage.id) + 1];
                  return (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEdit(deal)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {customer?.firstName} {customer?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {vehicle?.make} {vehicle?.model}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Usunąć transakcję?')) handleDelete(deal.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 rounded"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <span className="text-sm font-semibold text-blue-600">{formatPLN(deal.value)}</span>
                        {nextStage && stage.id !== 'closed_lost' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(deal, nextStage.id as Deal['stage']);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                          >
                            Przesuń <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">{deal.assignedTo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingDeal ? 'Edytuj transakcję' : 'Nowa transakcja'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Klient</label>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Wybierz klienta...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} {c.companyName ? `(${c.companyName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pojazd</label>
                <select
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Wybierz pojazd...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} {v.year} - {formatPLN(v.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etap</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value as Deal['stage'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wartość (PLN)</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Przypisany sprzedawca</label>
                <input
                  type="text"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notatki</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                {editingDeal ? 'Zapisz zmiany' : 'Utwórz transakcję'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
