import { useState, useEffect } from 'react';
import { getUsers, saveUsers, createUser, updateUser, deleteUser, getCurrentUser } from '../auth';
import { User } from '../types/auth';
import { Plus, Edit2, Trash2, X, Shield, UserCheck, User as UserIcon } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'salesman' as User['role'],
    phone: '',
    active: true,
  });
  const [error, setError] = useState('');

  const currentUser = getCurrentUser();

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleOpenNew = () => {
    setForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'salesman',
      phone: '',
      active: true,
    });
    setEditingUser(null);
    setError('');
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setForm({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      active: user.active,
    });
    setEditingUser(user);
    setError('');
    setShowModal(true);
  };

  const handleSave = () => {
    setError('');

    if (editingUser) {
      const updates: Partial<User> = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        phone: form.phone,
        active: form.active,
      };
      if (form.password) {
        updates.password = form.password;
      }

      const result = updateUser(editingUser.id, updates);
      if (result.success) {
        setUsers(getUsers());
        setShowModal(false);
      } else {
        setError(result.error || 'Wystąpił błąd');
      }
    } else {
      const result = createUser(form);
      if (result.success) {
        setUsers(getUsers());
        setShowModal(false);
      } else {
        setError(result.error || 'Wystąpił błąd');
      }
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      const result = deleteUser(userId);
      if (result.success) {
        setUsers(getUsers());
      } else {
        alert(result.error || 'Nie można usunąć użytkownika');
      }
    }
  };

  const roleLabels: Record<User['role'], string> = {
    admin: 'Administrator',
    manager: 'Manager',
    salesman: 'Sprzedawca',
  };

  const roleColors: Record<User['role'], string> = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-purple-100 text-purple-700',
    salesman: 'bg-blue-100 text-blue-700',
  };

  const roleIcons: Record<User['role'], typeof Shield> = {
    admin: Shield,
    manager: UserCheck,
    salesman: UserIcon,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zarządzanie użytkownikami</h1>
          <p className="text-gray-500 mt-1">Dodawaj i edytuj użytkowników systemu</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Nowy użytkownik</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Użytkownik</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rola</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Ostatnie logowanie</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => {
              const Icon = roleIcons[user.role];
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{user.email}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-gray-500" />
                      <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.active ? 'Aktywny' : 'Nieaktywny'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pl-PL') : 'Nigdy'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Edytuj użytkownika' : 'Nowy użytkownik'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasło {editingUser && '(pozostaw puste aby nie zmieniać)'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rola</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="salesman">Sprzedawca</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm text-gray-700">Konto aktywne</label>
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
                {editingUser ? 'Zapisz zmiany' : 'Utwórz użytkownika'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
