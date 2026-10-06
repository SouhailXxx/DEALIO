# Polityka Bezpieczeństwa - AutoCRM

## Obecne zabezpieczenia

### ✅ Zaimplementowane

#### 1. Autentykacja
- [x] Logowanie z walidacją credentials
- [x] Sesje z tokenami (24h)
- [x] Automatyczne wylogowanie po wygaśnięciu
- [x] Śledzenie ostatniego logowania
- [x] Blokowanie nieaktywnych kont

#### 2. Autoryzacja
- [x] Role użytkowników (admin, manager, salesman)
- [x] Uprawnienia oparte na rolach (RBAC)
- [x] Ochrona tras i komponentów
- [x] Filtracja menu według uprawnień

#### 3. Audit Log
- [x] Rejestracja wszystkich akcji
- [x] Śledzenie kto, kiedy, co zrobił
- [x] Filtrowanie logów
- [x] Ograniczenie do 1000 wpisów

#### 4. Walidacja danych
- [x] Walidacja email
- [x] Minimalna długość hasła
- [x] Unikalność emaili
- [x] Walidacja PESEL/NIP
- [x] Walidacja VIN

#### 5. Ochrona danych
- [x] Hasła nie są wyświetlane
- [x] Zmiana hasła wymaga starego
- [x] Blokada usuwania własnego konta
- [x] Ograniczenie dostępu do wrażliwych danych

### ⚠️ Wymagane dla produkcji

#### 1. Hasła
**OBECNIE:** Hasła przechowywane jako plain text
**WYMAGANE:** 
- Hashowanie hasła (bcrypt, argon2)
- Salt dla każdego hasła
- Minimalna złożoność hasła (8+ znaków, cyfry, znaki specjalne)
- Reset hasła przez email
- Blokada konta po 5 nieudanych próbach

```typescript
// Przykład z bcrypt
import bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

#### 2. HTTPS/TLS
**OBECNIE:** Brak (localStorage)
**WYMAGANE:**
- Certyfikat SSL/TLS
- HSTS (HTTP Strict Transport Security)
- Secure cookies (jeśli używane)

#### 3. Ochrona przed atakami
**WYMAGANE:**
- CSRF tokens
- Rate limiting (ograniczenie prób logowania)
- XSS protection (sanityzacja inputów)
- SQL Injection protection (jeśli backend SQL)
- Content Security Policy (CSP)

```typescript
// Przykład rate limiting
const loginAttempts = new Map();

function checkRateLimit(email: string): boolean {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  
  // Reset po 15 minutach
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  if (attempts.count >= 5) {
    return false; // Zablokowany
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
  return true;
}
```

#### 4. Szyfrowanie danych
**WYMAGANE:**
- Szyfrowanie danych wrażliwych (PESEL, NIP)
- Szyfrowanie bazy danych
- Backup encryption

```typescript
// Przykład z crypto-js
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-secret-key'; // Z env variables

function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```

#### 5. Sesje i tokeny
**OBECNIE:** Proste tokeny w localStorage
**WYMAGANE:**
- JWT z podpisem kryptograficznym
- Refresh tokens
- Token rotation
- Secure storage (httpOnly cookies)

```typescript
// Przykład JWT
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
```

#### 6. Monitoring i alerting
**WYMAGANE:**
- Monitoring nieudanych logowań
- Alerty przy podejrzanej aktywności
- Logowanie do zewnętrznego systemu (ELK, Splunk)
- Dashboard bezpieczeństwa

#### 7. Backup i recovery
**WYMAGANE:**
- Automatyczne backupy (codziennie)
- Testowanie restore
- Disaster recovery plan
- Retencja danych (GDPR)

#### 8. Zgodność z RODO/GDPR
**WYMAGANE:**
- Prawo do bycia zapomnianym (usuwanie danych)
- Eksport danych użytkownika
- Polityka prywatności
- Cookie consent
- Rejestr czynności przetwarzania

```typescript
// Przykład eksportu danych
async function exportUserData(userId: string) {
  const user = await getUser(userId);
  const customers = await getCustomersByUser(userId);
  const deals = await getDealsByUser(userId);
  
  return {
    personalData: user,
    customers,
    deals,
    exportedAt: new Date().toISOString()
  };
}

// Przykład usuwania danych (prawo do bycia zapomnianym)
async function deleteUserData(userId: string) {
  await anonymizeAuditLogs(userId);
  await deleteCustomerData(userId);
  await deleteUserAccount(userId);
}
```

#### 9. Testy bezpieczeństwa
**WYMAGANE:**
- Penetration testing (regularnie)
- Vulnerability scanning
- Code review pod kątem bezpieczeństwa
- Dependency audit (npm audit)

```bash
# Regularne audyty
npm audit
npm audit fix

# Snyk lub podobne narzędzia
npx snyk test
```

#### 10. Environment variables
**WYMAGANE:**
- Wszystkie sekrety w .env
- Różne klucze dla dev/staging/prod
- Rotacja kluczy
- Nigdy nie commitować .env

```bash
# .env.example
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-key
ENCRYPTION_KEY=another-secret
SUPABASE_KEY=your-supabase-key
```

## Rekomendacje dla produkcji

### Krótkoterminowe (1-2 tygodnie)
1. ✅ Hashowanie haseł (bcrypt)
2. ✅ HTTPS/TLS
3. ✅ Rate limiting
4. ✅ Environment variables
5. ✅ Backup automatyczny

### Średnioterminowe (1-2 miesiące)
1. ✅ JWT z refresh tokens
2. ✅ Szyfrowanie danych wrażliwych
3. ✅ Monitoring bezpieczeństwa
4. ✅ Testy penetracyjne
5. ✅ Dokumentacja RODO

### Długoterminowe (3-6 miesięcy)
1. ✅ Migracja na prawdziwą bazę danych
2. ✅ 2FA (dwuskładnikowa autentykacja)
3. ✅ SSO (Single Sign-On)
4. ✅ API rate limiting
5. ✅ Compliance audit (ISO 27001)

## Incident Response Plan

### W przypadku wycieku danych
1. **Natychmiast:** Zablokuj wszystkie sesje
2. **1h:** Powiadom użytkowników
3. **24h:** Zgłoś do UODO (jeśli wymagane)
4. **48h:** Post-mortem i plan naprawczy

### W przypadku ataku
1. **Natychmiast:** Izoluj system
2. **1h:** Analiza wektora ataku
3. **24h:** Patch i deploy
4. **48h:** Audyt bezpieczeństwa

## Kontakty bezpieczeństwa

- **Security Officer:** security@autocrm.pl
- **DPO (RODO):** dpo@autocrm.pl
- **Incident Response:** incident@autocrm.pl

## Aktualizacje

- **2024-01-15:** Initial security policy
- **2024-02-01:** Added GDPR requirements
- **2024-03-01:** Added production recommendations

---

**Ważne:** Ten dokument powinien być regularnie aktualizowany i przeglądany przez zespół bezpieczeństwa.
