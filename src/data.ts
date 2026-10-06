import { Customer, Vehicle, Deal, Appointment } from './types';

const STORAGE_KEYS = {
  customers: 'crm_customers',
  vehicles: 'crm_vehicles',
  deals: 'crm_deals',
  appointments: 'crm_appointments',
};

// Mock Data
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@email.pl',
    phone: '+48 601 234 567',
    city: 'Warszawa',
    pesel: '85010112345',
    type: 'individual',
    notes: 'Zainteresowany SUV-em',
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@firma.pl',
    phone: '+48 502 345 678',
    city: 'Kraków',
    nip: '6762345678',
    type: 'company',
    companyName: 'Nowak Transport Sp. z o.o.',
    notes: 'Potrzebuje floty 5 pojazdów dostawczych',
    createdAt: '2024-02-01',
    status: 'lead',
  },
  {
    id: '3',
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    email: 'p.wisniewski@email.pl',
    phone: '+48 603 456 789',
    city: 'Wrocław',
    pesel: '90030567890',
    type: 'individual',
    notes: 'Wymiana samochodu, budżet do 100 000 PLN',
    createdAt: '2024-02-10',
    status: 'active',
  },
  {
    id: '4',
    firstName: 'Katarzyna',
    lastName: 'Lewandowska',
    email: 'k.lewandowska@email.pl',
    phone: '+48 504 567 890',
    city: 'Gdańsk',
    pesel: '88071234567',
    type: 'individual',
    notes: 'Pierwszy samochód, preferuje automat',
    createdAt: '2024-03-01',
    status: 'lead',
  },
  {
    id: '5',
    firstName: 'Marek',
    lastName: 'Zieliński',
    email: 'marek.z@auto-fleet.pl',
    phone: '+48 605 678 901',
    city: 'Poznań',
    nip: '7891234567',
    type: 'company',
    companyName: 'Auto Fleet Polska',
    notes: 'Leasing operacyjny, 10 pojazdów rocznie',
    createdAt: '2024-01-20',
    status: 'active',
  },
  {
    id: '6',
    firstName: 'Tomasz',
    lastName: 'Kamiński',
    email: 't.kaminski@email.pl',
    phone: '+48 506 789 012',
    city: 'Łódź',
    pesel: '75050511223',
    type: 'individual',
    notes: 'Klient powracający, poprzednio kupił Opla',
    createdAt: '2024-03-15',
    status: 'active',
  },
];

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'RAV4',
    year: 2024,
    vin: 'JTMBH31V876012345',
    color: 'Biały perłowy',
    fuelType: 'hybryda',
    transmission: 'automatyczna',
    mileage: 0,
    price: 189900,
    purchasePrice: 155000,
    status: 'available',
    description: 'Nowa Toyota RAV4 Hybrid, pełne wyposażenie, kamera 360°, nawigacja',
    images: [],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    make: 'BMW',
    model: 'Seria 3',
    year: 2023,
    vin: 'WBAPH5C55BA234567',
    color: 'Czarny metalik',
    fuelType: 'diesel',
    transmission: 'automatyczna',
    mileage: 15000,
    price: 175000,
    purchasePrice: 148000,
    status: 'available',
    description: 'BMW 320d, pakiet M, skóra, head-up display',
    images: [],
    createdAt: '2024-02-05',
  },
  {
    id: '3',
    make: 'Volkswagen',
    model: 'Golf VIII',
    year: 2024,
    vin: 'WVWZZZ1KZLW345678',
    color: 'Szary metalik',
    fuelType: 'benzyna',
    transmission: 'automatyczna',
    mileage: 500,
    price: 129900,
    purchasePrice: 108000,
    status: 'reserved',
    description: 'VW Golf 1.5 TSI, Digital Cockpit, LED matrix',
    images: [],
    createdAt: '2024-02-20',
  },
  {
    id: '4',
    make: 'Audi',
    model: 'A4',
    year: 2023,
    vin: 'WAUZZZ8K9LA456789',
    color: 'Srebrny metalik',
    fuelType: 'benzyna',
    transmission: 'automatyczna',
    mileage: 22000,
    price: 165000,
    purchasePrice: 140000,
    status: 'available',
    description: 'Audi A4 40 TFSI, S-line, virtual cockpit, Bang & Olufsen',
    images: [],
    createdAt: '2024-01-25',
  },
  {
    id: '5',
    make: 'Skoda',
    model: 'Octavia',
    year: 2024,
    vin: 'TMBJH7NE5L0567890',
    color: 'Niebieski metalik',
    fuelType: 'benzyna',
    transmission: 'manualna',
    mileage: 0,
    price: 109900,
    purchasePrice: 89000,
    status: 'available',
    description: 'Skoda Octavia 1.5 TSI, Style, Canton sound system',
    images: [],
    createdAt: '2024-03-01',
  },
  {
    id: '6',
    make: 'Mercedes-Benz',
    model: 'Klasa C',
    year: 2023,
    vin: 'WDDWF4KB5LR678901',
    color: 'Biały',
    fuelType: 'hybryda',
    transmission: 'automatyczna',
    mileage: 8000,
    price: 215000,
    purchasePrice: 185000,
    status: 'sold',
    description: 'Mercedes C300e, AMG Line, panoramiczny dach, Burmester',
    images: [],
    createdAt: '2024-02-15',
  },
  {
    id: '7',
    make: 'Ford',
    model: 'Kuga',
    year: 2024,
    vin: 'WF0EXXTTWKF789012',
    color: 'Czerwony',
    fuelType: 'hybryda',
    transmission: 'automatyczna',
    mileage: 0,
    price: 159900,
    purchasePrice: 132000,
    status: 'available',
    description: 'Ford Kuga PHEV, ST-Line, adaptacyjny tempomat',
    images: [],
    createdAt: '2024-03-10',
  },
  {
    id: '8',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    vin: 'KMHJ381GDHU890123',
    color: 'Zielony metalik',
    fuelType: 'hybryda',
    transmission: 'automatyczna',
    mileage: 200,
    price: 149900,
    purchasePrice: 122000,
    status: 'available',
    description: 'Hyundai Tucson Hybrid, N-Line, panoramiczny dach',
    images: [],
    createdAt: '2024-03-05',
  },
];

const mockDeals: Deal[] = [
  {
    id: '1',
    customerId: '1',
    vehicleId: '1',
    stage: 'negotiation',
    value: 185000,
    notes: 'Klient prosi o rabat 5000 PLN, rozważa finansowanie',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-10',
    assignedTo: 'Adam Nowicki',
  },
  {
    id: '2',
    customerId: '2',
    vehicleId: '5',
    stage: 'offer',
    value: 520000,
    notes: 'Oferta na 5x Octavia dla firmy transportowej',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-12',
    assignedTo: 'Ewa Kaczmarek',
  },
  {
    id: '3',
    customerId: '3',
    vehicleId: '2',
    stage: 'lead',
    value: 175000,
    notes: 'Pierwszy kontakt, umówiony na jazdę próbną',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
    assignedTo: 'Adam Nowicki',
  },
  {
    id: '4',
    customerId: '5',
    vehicleId: '6',
    stage: 'closed_won',
    value: 215000,
    notes: 'Sprzedaż zakończona sukcesem, leasing 110%',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-28',
    assignedTo: 'Ewa Kaczmarek',
  },
  {
    id: '5',
    customerId: '4',
    vehicleId: '7',
    stage: 'negotiation',
    value: 155000,
    notes: 'Klientka porównuje z Hyundai Tucson',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-14',
    assignedTo: 'Adam Nowicki',
  },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerId: '1',
    type: 'test_drive',
    date: '2024-03-18',
    time: '10:00',
    notes: 'Jazda próbna Toyota RAV4',
    status: 'scheduled',
    vehicleId: '1',
  },
  {
    id: '2',
    customerId: '3',
    type: 'test_drive',
    date: '2024-03-19',
    time: '14:00',
    notes: 'Jazda próbna BMW Seria 3',
    status: 'scheduled',
    vehicleId: '2',
  },
  {
    id: '3',
    customerId: '2',
    type: 'meeting',
    date: '2024-03-20',
    time: '11:00',
    notes: 'Spotkanie w sprawie floty',
    status: 'scheduled',
  },
  {
    id: '4',
    customerId: '4',
    type: 'meeting',
    date: '2024-03-17',
    time: '09:00',
    notes: 'Prezentacja oferty Ford Kuga',
    status: 'completed',
    vehicleId: '7',
  },
  {
    id: '5',
    customerId: '5',
    type: 'delivery',
    date: '2024-03-22',
    time: '15:00',
    notes: 'Odbiór Mercedes Klasa C',
    status: 'scheduled',
    vehicleId: '6',
  },
];

// Store helpers
function getFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading from localStorage', e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export function getCustomers(): Customer[] {
  return getFromStorage(STORAGE_KEYS.customers, mockCustomers);
}

export function saveCustomers(customers: Customer[]): void {
  saveToStorage(STORAGE_KEYS.customers, customers);
}

export function getVehicles(): Vehicle[] {
  return getFromStorage(STORAGE_KEYS.vehicles, mockVehicles);
}

export function saveVehicles(vehicles: Vehicle[]): void {
  saveToStorage(STORAGE_KEYS.vehicles, vehicles);
}

export function getDeals(): Deal[] {
  return getFromStorage(STORAGE_KEYS.deals, mockDeals);
}

export function saveDeals(deals: Deal[]): void {
  saveToStorage(STORAGE_KEYS.deals, deals);
}

export function getAppointments(): Appointment[] {
  return getFromStorage(STORAGE_KEYS.appointments, mockAppointments);
}

export function saveAppointments(appointments: Appointment[]): void {
  saveToStorage(STORAGE_KEYS.appointments, appointments);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
