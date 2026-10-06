import { useState } from 'react';
import { Save, RefreshCw, Building, User, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    dealerName: 'Auto Salon Warszawa',
    nip: '1234567890',
    address: 'ul. Marszałkowska 100, 00-001 Warszawa',
    phone: '+48 22 123 45 67',
    email: 'kontakt@autosalon-warszawa.pl',
    vatRate: 23,
    currency: 'PLN',
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSmsAlerts: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Czy na pewno chcesz zresetować wszystkie dane? Ta operacja jest nieodwracalna!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
        <p className="text-gray-500 mt-1">Konfiguracja systemu CRM</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
          <Save size={16} className="text-emerald-600" />
          <span className="text-sm text-emerald-700">Ustawienia zostały zapisane!</span>
        </div>
      )}

      {/* Dealer Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Dane salonu</h2>
            <p className="text-xs text-gray-500">Informacje o firmie wyświetlane w dokumentach</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa salonu</label>
              <input
                type="text"
                value={settings.dealerName}
                onChange={(e) => setSettings({ ...settings, dealerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input
                type="text"
                value={settings.nip}
                onChange={(e) => setSettings({ ...settings, nip: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield size={18} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Ustawienia finansowe</h2>
            <p className="text-xs text-gray-500">Konfiguracja podatków i walut</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stawka VAT (%)</label>
              <input
                type="number"
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waluta</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="PLN">PLN - Polski złoty</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell size={18} className="text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Powiadomienia</h2>
            <p className="text-xs text-gray-500">Konfiguracja alertów i przypomnień</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Powiadomienia w aplikacji</p>
              <p className="text-xs text-gray-500">Otrzymuj alerty o nowych leadach i spotkaniach</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Alerty email</p>
              <p className="text-xs text-gray-500">Otrzymuj podsumowania dzienne na email</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableEmailAlerts: !settings.enableEmailAlerts })}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.enableEmailAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.enableEmailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Alerty SMS</p>
              <p className="text-xs text-gray-500">Powiadomienia SMS o ważnych wydarzeniach</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableSmsAlerts: !settings.enableSmsAlerts })}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.enableSmsAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.enableSmsAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <User size={18} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Profil użytkownika</h2>
            <p className="text-xs text-gray-500">Twoje dane logowania i preferencje</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              AN
            </div>
            <div>
              <p className="font-semibold text-gray-900">Adam Nowicki</p>
              <p className="text-sm text-gray-500">Sprzedawca • adam.nowicki@autosalon.pl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleResetData}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          <RefreshCw size={16} />
          Resetuj dane demo
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={16} />
          <span className="text-sm font-medium">Zapisz ustawienia</span>
        </button>
      </div>
    </div>
  );
}
