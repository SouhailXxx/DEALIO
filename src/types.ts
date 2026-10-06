export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  pesel?: string;
  nip?: string;
  type: 'individual' | 'company';
  companyName?: string;
  notes: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'lead';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  registrationNumber?: string;
  color: string;
  fuelType: 'benzyna' | 'diesel' | 'hybryda' | 'elektryczny' | 'lpg';
  transmission: 'manualna' | 'automatyczna';
  mileage: number;
  price: number;
  purchasePrice: number;
  status: 'available' | 'reserved' | 'sold' | 'service';
  description: string;
  images: string[];
  createdAt: string;
}

export interface Deal {
  id: string;
  customerId: string;
  vehicleId: string;
  stage: 'lead' | 'negotiation' | 'offer' | 'closed_won' | 'closed_lost';
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  type: 'test_drive' | 'meeting' | 'delivery' | 'service';
  date: string;
  time: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  vehicleId?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'salesman' | 'manager';
  avatar: string;
}
