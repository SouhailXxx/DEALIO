import { useState, useEffect } from 'react';
import { getAuditLogs, getUsers } from '../auth';
import { AuditLog, User } from '../types/auth';
import { Activity, Filter } from 'lucide-react';

export default function AuditLogView() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLogs(getAuditLogs());
    setUsers(getUsers());
  }, []);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.action === filter);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Nieznany';
  };

  const actionLabels: Record<string, string> = {
    LOGIN: 'Logowanie',
    LOGOUT: 'Wylogowanie',
    CREATE: 'Utworzenie',
    UPDATE: 'Aktualizacja',
    DELETE: 'Usunięcie',
    PASSWORD_CHANGE: 'Zmiana hasła',
  };

  const actionColors: Record<string, string> = {
    LOGIN: 'bg-blue-100 text-blue-700',
    LOGOUT: 'bg-gray-100 text-gray-700',
    CREATE: 'bg-emerald-100 text-emerald-700',
    UPDATE: 'bg-amber-100 text-amber-700',
    DELETE: 'bg-red-100 text-red-700',
    PASSWORD_CHANGE: 'bg-purple-100 text-purple-700',
  };

  const entityTypeLabels: Record<string, string> = {
    user: 'Użytkownik',
    customer: 'Klient',
    vehicle: 'Pojazd',
    deal: 'Transakcja',
    appointment: 'Spotkanie',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dziennik audytu</h1>
          <p className="text-gray-500 mt-1">Historia akcji w systemie</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Wszystkie akcje</option>
            <option value="LOGIN">Logowania</option>
            <option value="LOGOUT">Wylogowania</option>
            <option value="CREATE">Utworzenia</option>
            <option value="UPDATE">Aktualizacje</option>
            <option value="DELETE">Usunięcia</option>
            <option value="PASSWORD_CHANGE">Zmiany haseł</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Activity size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Brak wpisów w dzienniku</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity size={18} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${actionColors[log.action]}`}>
                          {actionLabels[log.action]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entityTypeLabels[log.entityType] || log.entityType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        przez <span className="font-medium">{getUserName(log.userId)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString('pl-PL')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString('pl-PL')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
