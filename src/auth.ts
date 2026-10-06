import { User, Session, AuditLog, Permission } from './types/auth';
import { generateId } from './data';
import { rolePermissions } from './types/auth';

const AUTH_KEYS = {
  users: 'crm_users',
  session: 'crm_session',
  auditLog: 'crm_audit_log',
};

// Domyślni użytkownicy
const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@autocrm.pl',
    password: 'admin123', // W produkcji: hash
    firstName: 'Jan',
    lastName: 'Kowalski',
    role: 'admin',
    phone: '+48 600 111 222',
    active: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'adam@autocrm.pl',
    password: 'adam123',
    firstName: 'Adam',
    lastName: 'Nowicki',
    role: 'salesman',
    phone: '+48 601 234 567',
    active: true,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    email: 'ewa@autocrm.pl',
    password: 'ewa123',
    firstName: 'Ewa',
    lastName: 'Kaczmarek',
    role: 'manager',
    phone: '+48 602 345 678',
    active: true,
    createdAt: '2024-02-01',
  },
];

// Inicjalizacja użytkowników
function initUsers(): User[] {
  const stored = localStorage.getItem(AUTH_KEYS.users);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(AUTH_KEYS.users, JSON.stringify(defaultUsers));
  return defaultUsers;
}

// Pobierz wszystkich użytkowników
export function getUsers(): User[] {
  return initUsers();
}

// Zapisz użytkowników
export function saveUsers(users: User[]): void {
  localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
}

// Logowanie
export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password && u.active);
  
  if (!user) {
    return { success: false, error: 'Nieprawidłowy email lub hasło' };
  }

  // Utwórz sesję
  const session: Session = {
    userId: user.id,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_KEYS.session, JSON.stringify(session));

  // Zaktualizuj lastLogin
  const updatedUsers = users.map(u => 
    u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
  );
  saveUsers(updatedUsers);

  // Audit log
  addAuditLog(user.id, 'LOGIN', 'user', user.id, 'Zalogowano do systemu');

  return { success: true, user };
}

// Wylogowanie
export function logout(): void {
  const session = getCurrentSession();
  if (session) {
    addAuditLog(session.userId, 'LOGOUT', 'user', session.userId, 'Wylogowano z systemu');
  }
  localStorage.removeItem(AUTH_KEYS.session);
}

// Pobierz aktualną sesję
export function getCurrentSession(): Session | null {
  const stored = localStorage.getItem(AUTH_KEYS.session);
  if (!stored) return null;

  const session: Session = JSON.parse(stored);
  
  // Sprawdź czy sesja nie wygasła
  if (new Date(session.expiresAt) < new Date()) {
    localStorage.removeItem(AUTH_KEYS.session);
    return null;
  }

  return session;
}

// Pobierz aktualnego użytkownika
export function getCurrentUser(): User | null {
  const session = getCurrentSession();
  if (!session) return null;

  const users = getUsers();
  return users.find(u => u.id === session.userId) || null;
}

// Generuj token sesji
function generateToken(): string {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Audit log
export function addAuditLog(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string
): void {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: generateId(),
    userId,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    details,
  };
  logs.unshift(newLog); // Najnowsze na początku
  
  // Zachowaj tylko ostatnie 1000 logów
  const limitedLogs = logs.slice(0, 1000);
  localStorage.setItem(AUTH_KEYS.auditLog, JSON.stringify(limitedLogs));
}

// Pobierz audit logi
export function getAuditLogs(): AuditLog[] {
  const stored = localStorage.getItem(AUTH_KEYS.auditLog);
  if (!stored) return [];
  return JSON.parse(stored);
}

// Zmień hasło
export function changePassword(userId: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return { success: false, error: 'Użytkownik nie znaleziony' };
  }

  if (user.password !== oldPassword) {
    return { success: false, error: 'Nieprawidłowe stare hasło' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'Hasło musi mieć minimum 6 znaków' };
  }

  const updatedUsers = users.map(u => 
    u.id === userId ? { ...u, password: newPassword } : u
  );
  saveUsers(updatedUsers);

  addAuditLog(userId, 'PASSWORD_CHANGE', 'user', userId, 'Zmieniono hasło');

  return { success: true };
}

// Utwórz użytkownika
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; error?: string } {
  const users = getUsers();
  
  // Sprawdź czy email już istnieje
  if (users.some(u => u.email === userData.email)) {
    return { success: false, error: 'Email jest już używany' };
  }

  if (userData.password.length < 6) {
    return { success: false, error: 'Hasło musi mieć minimum 6 znaków' };
  }

  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser) {
    addAuditLog(currentUser.id, 'CREATE', 'user', newUser.id, `Utworzono użytkownika: ${newUser.email}`);
  }

  return { success: true };
}

// Aktualizuj użytkownika
export function updateUser(userId: string, updates: Partial<User>): { success: boolean; error?: string } {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'Użytkownik nie znaleziony' };
  }

  // Jeśli zmieniamy email, sprawdź czy nie jest już używany
  if (updates.email && updates.email !== users[userIndex].email) {
    if (users.some(u => u.email === updates.email)) {
      return { success: false, error: 'Email jest już używany' };
    }
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser) {
    addAuditLog(currentUser.id, 'UPDATE', 'user', userId, `Zaktualizowano użytkownika: ${users[userIndex].email}`);
  }

  return { success: true };
}

// Usuń użytkownika
export function deleteUser(userId: string): { success: boolean; error?: string } {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: 'Brak autoryzacji' };
  }

  if (currentUser.id === userId) {
    return { success: false, error: 'Nie możesz usunąć własnego konta' };
  }

  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return { success: false, error: 'Użytkownik nie znaleziony' };
  }

  saveUsers(filteredUsers);
  addAuditLog(currentUser.id, 'DELETE', 'user', userId, 'Usunięto użytkownika');

  return { success: true };
}

// Sprawdź uprawnienia
export function hasPermission(resource: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  const permissions = rolePermissions[user.role];
  const permission = permissions.find((p: Permission) => p.resource === resource);
  
  if (!permission) return false;
  return permission.actions.includes(action);
}
