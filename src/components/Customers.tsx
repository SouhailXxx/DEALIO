import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Building2, User, Users } from 'lucide-react';
import { Customer } from '../types';
import { generateId } from '../data';

interface CustomersProps {
  customers: Customer[];
  onSave: (customers: Customer[]) => void;
}

const emptyCustomer: Omit<Customer, 'id' | 'createdAt'> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  type: 'individual',
  notes: '',
  status: 'lead',
};

export default function Customers({ customers, onSave }: CustomersProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyCustomer);

  const filtered = customers.filter(c => {
    const query = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(query) ||
      c.lastName.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.city.toLowerCase().includes(query) ||
      (c.companyName || '').toLowerCase().includes(query)
    );
  });

  const handleOpenNew = () => {
    setForm(emptyCustomer);
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      pesel: customer.pesel,
      nip: customer.nip,
      type: customer.type,
      companyName: customer.companyName,
      notes: customer.notes,
      status: customer.status,
    });
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCustomer) {
      const updated = customers.map(c =>
        c.id === editingCustomer.id
          ? { ...c, ...form }
          : c
      );
      onSave(updated);
    } else {
      const newCustomer: Customer = {
        ...form,
        id: generateId(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      onSave([...customers, newCustomer]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      onSave(customers.filter(c => c.id !== id));
    }
  };

  const statusLabels: Record<string, string> = {
    active: 'Aktywny',
    inactive: 'Nieaktywny',
    lead: 'Lead',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-600',
    lead: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klienci</h1>
          <p className="text-gray-500 mt-1">Zarządzaj bazą klientów salonu</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Nowy klient</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Szukaj klienta po imieniu, email, telefonie lub mieście..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Klient</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Miasto</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        {customer.companyName && (
                          <p className="text-xs text-gray-500">{customer.companyName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-gray-700">{customer.email}</p>
                    <p className="text-xs text-gray-500">{customer.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{customer.city}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {customer.type === 'company' ? (
                        <Building2 size={14} className="text-purple-500" />
                      ) : (
                        <User size={14} className="text-blue-500" />
                      )}
                      <span className="text-xs text-gray-600">
                        {customer.type === 'company' ? 'Firma' : 'Osoba'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[customer.status]}`}>
                      {statusLabels[customer.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p>Nie znaleziono klientów</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCustomer ? 'Edytuj klienta' : 'Nowy klient'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ klienta</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'individual', companyName: undefined })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      form.type === 'individual' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Osoba prywatna
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'company', pesel: undefined })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      form.type === 'company' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Firma
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {form.type === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa firmy</label>
                  <input
                    type="text"
                    value={form.companyName || ''}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+48 XXX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Customer['status'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="lead">Lead</option>
                    <option value="active">Aktywny</option>
                    <option value="inactive">Nieaktywny</option>
                  </select>
                </div>
              </div>

              {form.type === 'individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PESEL</label>
                  <input
                    type="text"
                    value={form.pesel || ''}
                    onChange={(e) => setForm({ ...form, pesel: e.target.value })}
                    placeholder="11 cyfr"
                    maxLength={11}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}

              {form.type === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                  <input
                    type="text"
                    value={form.nip || ''}
                    onChange={(e) => setForm({ ...form, nip: e.target.value })}
                    placeholder="10 cyfr"
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}

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
                {editingCustomer ? 'Zapisz zmiany' : 'Dodaj klienta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
