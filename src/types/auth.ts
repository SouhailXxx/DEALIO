export interface User {
  id: string;
  email: string;
  password: string; // W produkcji: hash hasła
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'salesman';
  phone: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export const rolePermissions: Record<User['role'], Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'vehicles', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
  ],
  manager: [
    { resource: 'users', actions: ['read'] },
    { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'vehicles', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'settings', actions: ['read'] },
  ],
  salesman: [
    { resource: 'users', actions: [] },
    { resource: 'customers', actions: ['create', 'read', 'update'] },
    { resource: 'vehicles', actions: ['read'] },
    { resource: 'deals', actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: [] },
    { resource: 'settings', actions: [] },
  ],
};
