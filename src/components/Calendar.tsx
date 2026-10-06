import { useState } from 'react';
import { Plus, X, Clock, Car, Users, Wrench, Package } from 'lucide-react';
import { Appointment, Customer, Vehicle } from '../types';
import { generateId } from '../data';

interface CalendarProps {
  appointments: Appointment[];
  customers: Customer[];
  vehicles: Vehicle[];
  onSave: (appointments: Appointment[]) => void;
}

const typeConfig: Record<string, { label: string; icon: typeof Clock; color: string; bgColor: string }> = {
  test_drive: { label: 'Jazda próbna', icon: Car, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  meeting: { label: 'Spotkanie', icon: Users, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivery: { label: 'Odbiór', icon: Package, color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  service: { label: 'Serwis', icon: Wrench, color: 'text-amber-700', bgColor: 'bg-amber-100' },
};

export default function CalendarView({ appointments, customers, vehicles, onSave }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerId: '',
    type: 'meeting' as Appointment['type'],
    date: '',
    time: '10:00',
    notes: '',
    status: 'scheduled' as Appointment['status'],
    vehicleId: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday start
  const daysInMonth = lastDay.getDate();

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const handleOpenNew = (date?: string) => {
    setForm({
      customerId: '',
      type: 'meeting',
      date: date || '',
      time: '10:00',
      notes: '',
      status: 'scheduled',
      vehicleId: '',
    });
    setEditingAppointment(null);
    setShowModal(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setForm({
      customerId: appointment.customerId,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
      status: appointment.status,
      vehicleId: appointment.vehicleId || '',
    });
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingAppointment) {
      const updated = appointments.map(a =>
        a.id === editingAppointment.id ? { ...a, ...form } : a
      );
      onSave(updated);
    } else {
      const newAppointment: Appointment = {
        ...form,
        id: generateId(),
      };
      onSave([...appointments, newAppointment]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć to spotkanie?')) {
      onSave(appointments.filter(a => a.id !== id));
    }
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const selectedAppointments = selectedDate
    ? appointments.filter(a => a.date === selectedDate)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kalendarz</h1>
          <p className="text-gray-500 mt-1">Zarządzaj spotkaniami i jazdami próbnymi</p>
        </div>
        <button
          onClick={() => handleOpenNew()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Nowe spotkanie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {dayNames.map(day => (
              <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-24 border-b border-r border-gray-50" />;
              }
              const dayAppointments = getAppointmentsForDate(day);
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`h-24 border-b border-r border-gray-50 p-1 cursor-pointer hover:bg-blue-50 transition-colors ${
                    isSelected ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''
                  }`}
                >
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayAppointments.slice(0, 2).map(apt => {
                      const config = typeConfig[apt.type];
                      return (
                        <div
                          key={apt.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${config.bgColor} ${config.color}`}
                        >
                          {apt.time} {customers.find(c => c.id === apt.customerId)?.lastName}
                        </div>
                      );
                    })}
                    {dayAppointments.length > 2 && (
                      <p className="text-xs text-gray-400 px-1">+{dayAppointments.length - 2} więcej</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel - selected day appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">
              {selectedDate
                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })
                : 'Wybierz dzień'}
            </h3>
            {selectedDate && (
              <button
                onClick={() => handleOpenNew(selectedDate)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={14} /> Dodaj spotkanie
              </button>
            )}
          </div>
          <div className="p-4 space-y-3">
            {selectedDate && selectedAppointments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Brak spotkań w tym dniu</p>
            )}
            {selectedAppointments.map(apt => {
              const customer = customers.find(c => c.id === apt.customerId);
              const vehicle = vehicles.find(v => v.id === apt.vehicleId);
              const config = typeConfig[apt.type];
              const Icon = config.icon;
              const statusLabels: Record<string, string> = {
                scheduled: 'Zaplanowane',
                completed: 'Zakończone',
                cancelled: 'Anulowane',
              };
              const statusColors: Record<string, string> = {
                scheduled: 'bg-blue-100 text-blue-700',
                completed: 'bg-emerald-100 text-emerald-700',
                cancelled: 'bg-red-100 text-red-700',
              };
              return (
                <div key={apt.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                        <Icon size={14} className={config.color} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{config.label}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {apt.time}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-700">
                      <span className="font-medium">Klient:</span> {customer?.firstName} {customer?.lastName}
                    </p>
                    {vehicle && (
                      <p className="text-xs text-gray-500">
                        {vehicle.make} {vehicle.model}
                      </p>
                    )}
                    {apt.notes && (
                      <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(apt)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAppointment ? 'Edytuj spotkanie' : 'Nowe spotkanie'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ spotkania</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Appointment['type'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="test_drive">Jazda próbna</option>
                  <option value="meeting">Spotkanie</option>
                  <option value="delivery">Odbiór pojazdu</option>
                  <option value="service">Serwis</option>
                </select>
              </div>

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
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Godzina</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pojazd (opcjonalnie)</label>
                <select
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Brak</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} {v.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Appointment['status'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="scheduled">Zaplanowane</option>
                  <option value="completed">Zakończone</option>
                  <option value="cancelled">Anulowane</option>
                </select>
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
                {editingAppointment ? 'Zapisz zmiany' : 'Utwórz spotkanie'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
