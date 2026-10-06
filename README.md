# AutoCRM - System Zarządzania Salonem Samochodowym

Kompleksowy system CRM dla dealerów samochodowych w Polsce z pełnym systemem bezpieczeństwa i zarządzania użytkownikami.

## 🚀 Funkcje

### Główne moduły
- **Panel główny** - KPI i statystyki w czasie rzeczywistym
- **Klienci** - Zarządzanie bazą klientów (PESEL/NIP)
- **Magazyn** - Ewidencja pojazdów z VIN
- **Transakcje** - Lejek sprzedażowy (Kanban)
- **Kalendarz** - Spotkania i jazdy próbne
- **Użytkownicy** - Zarządzanie kontami (tylko admin)
- **Dziennik audytu** - Historia akcji w systemie
- **Ustawienia** - Konfiguracja systemu

### 🔐 System bezpieczeństwa

#### Autentykacja
- Logowanie z walidacją email/hasło
- Sesje z tokenami (24h ważność)
- Automatyczne wylogowanie po wygaśnięciu sesji
- Śledzenie ostatniego logowania

#### Role i uprawnienia
**Administrator** - Pełny dostęp do systemu
- Zarządzanie użytkownikami
- Wszystkie operacje CRUD
- Dostęp do dziennika audytu

**Manager** - Zarządzanie operacyjne
- Przeglądanie użytkowników (tylko odczyt)
- Pełny dostęp do klientów, pojazdów, transakcji
- Dostęp do dziennika audytu (tylko odczyt)

**Sprzedawca** - Operacje sprzedażowe
- Zarządzanie klientami (bez usuwania)
- Przeglądanie pojazdów (tylko odczyt)
- Tworzenie i aktualizacja transakcji
- Brak dostępu do zarządzania użytkownikami

#### Audit Log
- Rejestracja wszystkich akcji w systemie
- Logowanie: logowania, wylogowania, tworzenia, aktualizacji, usuwania
- Filtrowanie po typie akcji
- Śledzenie kto, kiedy i co zrobił

### 💾 Baza danych

#### Struktura (localStorage)
System używa localStorage jako tymczasowej bazy danych z następującymi kolekcjami:

**Użytkownicy** (`crm_users`)
```typescript
{
  id: string;
  email: string;
  password: string; // W produkcji: hash
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'salesman';
  phone: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}
```

**Sesje** (`crm_session`)
```typescript
{
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}
```

**Audit Log** (`crm_audit_log`)
```typescript
{
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details: string;
}
```

**Klienci** (`crm_customers`)
- Obsługa osób prywatnych (PESEL) i firm (NIP)
- Statusy: lead, active, inactive

**Pojazdy** (`crm_vehicles`)
- VIN, marka, model, rok
- Statusy: available, reserved, sold, service
- Ceny zakupu i sprzedaży

**Transakcje** (`crm_deals`)
- Etapy: lead → negotiation → offer → closed_won/closed_lost
- Przypisanie do sprzedawcy
- Wartość transakcji

**Spotkania** (`crm_appointments`)
- Typy: test_drive, meeting, delivery, service
- Statusy: scheduled, completed, cancelled

### 🔒 Zabezpieczenia

#### Walidacja danych
- Walidacja email (format)
- Minimalna długość hasła (6 znaków)
- Unikalność emaili
- Walidacja PESEL (11 cyfr)
- Walidacja NIP (10 cyfr)
- Walidacja VIN (17 znaków)

#### Ochrona tras
- Sprawdzenie uprawnień przed wyświetleniem modułu
- Blokada dostępu do niedozwolonych akcji
- Komunikaty o braku uprawnień

#### Ochrona danych
- Hasła nie są wyświetlane w interfejsie
- Możliwość zmiany hasła tylko po podaniu starego
- Blokada usuwania własnego konta
- Ograniczenie audit log do 1000 wpisów

### 🇵🇱 Lokalizacja polska
- Interfejs w języku polskim
- Waluta PLN z formatowaniem
- Stawka VAT 23%
- Pola PESEL/NIP dla klientów
- Polskie nazwy miast i adresów

## 🔑 Dane testowe

### Użytkownicy
```
Admin:     admin@autocrm.pl / admin123
Manager:   ewa@autocrm.pl   / ewa123
Sprzedawca: adam@autocrm.pl / adam123
```

### Przykładowe dane
- 6 klientów (osoby prywatne i firmy)
- 8 pojazdów (różne marki i statusy)
- 5 transakcji (różne etapy)
- 5 spotkań (różne typy)

## 🏗️ Architektura

```
src/
├── components/          # Komponenty React
│   ├── Login.tsx       # Ekran logowania
│   ├── Sidebar.tsx     # Nawigacja z rolami
│   ├── Dashboard.tsx   # Panel główny
│   ├── Customers.tsx   # Zarządzanie klientami
│   ├── Inventory.tsx   # Magazyn pojazdów
│   ├── Deals.tsx       # Transakcje (Kanban)
│   ├── Calendar.tsx    # Kalendarz spotkań
│   ├── UserManagement.tsx  # Zarządzanie użytkownikami
│   ├── AuditLog.tsx    # Dziennik audytu
│   └── Settings.tsx    # Ustawienia
├── types/
│   ├── index.ts        # Typy danych
│   └── auth.ts         # Typy autentykacji
├── auth.ts             # Serwis autentykacji
├── data.ts             # Serwis danych (localStorage)
└── App.tsx             # Główny komponent
```

## 🚀 Uruchomienie

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Build produkcyjny
npm run build
```

## 🔮 Rozwój - Backend

Obecnie system używa localStorage. Do produkcji zalecane jest:

### Opcja 1: REST API + PostgreSQL
```typescript
// Zastąp localStorage fetch API
export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch('/api/customers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Opcja 2: Supabase
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Autentykacja
const { user } = await supabase.auth.signIn({ email, password })

// Dane
const { data } = await supabase.from('customers').select()
```

### Opcja 3: Firebase
```typescript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Autentykacja
const userCredential = await signInWithEmailAndPassword(auth, email, password)

// Dane
const querySnapshot = await getDocs(collection(db, 'customers'))
```

## 📝 Licencja

© 2024 AutoCRM. Wszelkie prawa zastrzeżone.
