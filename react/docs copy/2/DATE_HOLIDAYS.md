# date-holidays - Guide Complet

## 📅 Introduction

**date-holidays** est une librairie JavaScript/Node.js pour obtenir **les jours fériés de plus de 250 pays/régions**. Elle récupère les données des jours fériés officiels et permet de vérifier si une date est un jour férié.

### Pourquoi date-holidays ?

✅ **Couverture mondiale** - 250+ pays et régions
✅ **Données officielles** - Basées sur des sources gouvernementales
✅ **Pas de dépendances** - Zéro dépendances externes
✅ **Lightweight** - Petit paquet NPM (~100 KB)
✅ **TypeScript support** - Définitions de types disponibles
✅ **Cache intégré** - Optimisé pour les performances
✅ **Jours fériés variables** - Gère Pâques, Ramadan, etc.

### Cas d'usage

- ✅ Calcul de délai de livraison (exclure jours fériés)
- ✅ Planning de projets (exclure weekends + jours fériés)
- ✅ Gestion de réservations (afficher jours disponibles)
- ✅ Alertes d'expédition (pas de livraison jours fériés)
- ✅ RH (gestion des congés)
- ✅ E-commerce (délai de traitement réaliste)

---

## 🚀 Installation

```bash
npm install date-holidays
# ou
yarn add date-holidays
```

### TypeScript

```bash
npm install --save-dev @types/date-holidays
```

### Imports

```typescript
import Holidays from 'date-holidays';
// ou
const Holidays = require('date-holidays');
```

---

## 🔢 Concepts de base

### 1. Créer une instance

```typescript
import Holidays from 'date-holidays';

// France
const holidays = new Holidays('FR');

// États-Unis
const holidays = new Holidays('US');

// Avec état/région (ex: Californie)
const holidays = new Holidays('US', 'CA');

// Plusieurs pays
const holidays = new Holidays(['FR', 'US']);

// Avec options
const holidays = new Holidays({
  country: 'FR',
  state: null,
  types: ['public', 'bank'] // Types de jours fériés
});
```

### 2. Vérifier si une date est un jour férié

```typescript
import Holidays from 'date-holidays';

const hd = new Holidays('FR');

// Avec Date JavaScript
const date = new Date('2026-01-01'); // 1er janvier
console.log(hd.isHoliday(date)); // true

// Avec string ISO
console.log(hd.isHoliday('2026-01-01')); // true

// Avec timestamp
console.log(hd.isHoliday(1704067200000)); // true

// Avec tableau [année, mois, jour]
console.log(hd.isHoliday([2026, 1, 1])); // true
```

### 3. Récupérer le nom d'un jour férié

```typescript
const hd = new Holidays('FR');

const name = hd.getName('2026-01-01');
console.log(name); // "New Year's Day" (en anglais)

// Ou avec la méthode alternative
const holiday = hd.getHoliday('2026-01-01');
console.log(holiday); // { name: "New Year's Day", date: "2026-01-01" }
```

---

## 📋 Lister les jours fériés

### Tous les jours fériés d'une année

```typescript
import Holidays from 'date-holidays';

const hd = new Holidays('FR');

// Tous les jours fériés de 2026
const holidays2026 = hd.getHolidays(2026);

console.log(holidays2026);
// [
//   { name: "New Year's Day", date: "2026-01-01", type: "public" },
//   { name: "Easter Monday", date: "2026-04-06", type: "public" },
//   { name: "May Day", date: "2026-05-01", type: "public" },
//   ...
// ]

// Afficher les noms
holidays2026.forEach(holiday => {
  console.log(`${holiday.date}: ${holiday.name}`);
});
```

### Jours fériés entre deux dates

```typescript
const hd = new Holidays('FR');

// Jours fériés entre deux dates
const start = new Date('2026-01-01');
const end = new Date('2026-12-31');

const holidaysInRange = hd.getHolidays([2026, 1, 1], [2026, 12, 31]);

console.log(holidaysInRange);
// [
//   { name: "New Year's Day", date: "2026-01-01" },
//   { name: "Easter Monday", date: "2026-04-06" },
//   ...
// ]
```

### Jours fériés sur plusieurs mois

```typescript
const hd = new Holidays('FR');

// Jours fériés de mai et juin 2026
const holidays = hd.getHolidays([2026, 5], [2026, 6]);

holidays.forEach(({ date, name }) => {
  console.log(`${date}: ${name}`);
});
// 2026-05-01: May Day
// 2026-05-08: Victory in Europe Day
// 2026-05-14: Ascension Thursday
// 2026-05-25: Whit Monday
```

---

## 🌍 Pays et régions supportés

### Codes pays (ISO 3166-1 alpha-2)

```typescript
// France
new Holidays('FR');

// Europe
'DE' // Allemagne
'GB' // Royaume-Uni
'IT' // Italie
'ES' // Espagne
'NL' // Pays-Bas
'BE' // Belgique
'CH' // Suisse
'AT' // Autriche
'SE' // Suède
'NO' // Norvège
'DK' // Danemark
'PL' // Pologne

// Amérique
'US' // États-Unis
'CA' // Canada
'MX' // Mexique
'BR' // Brésil
'AR' // Argentine

// Asie
'JP' // Japon
'CN' // Chine
'IN' // Inde
'TH' // Thaïlande
'SG' // Singapour

// Autres
'AU' // Australie
'NZ' // Nouvelle-Zélande
'ZA' // Afrique du Sud
'EG' // Égypte
```

### Régions/États (USA exemple)

```typescript
// États américains
new Holidays('US', 'AL'); // Alabama
new Holidays('US', 'CA'); // California
new Holidays('US', 'TX'); // Texas
new Holidays('US', 'NY'); // New York
new Holidays('US', 'FL'); // Florida
// ... etc pour tous les 50 états

// Provinces canadiennes
new Holidays('CA', 'ON'); // Ontario
new Holidays('CA', 'QC'); // Quebec
new Holidays('CA', 'BC'); // British Columbia
```

### Obtenir la liste des pays

```typescript
import Holidays from 'date-holidays';

const hd = new Holidays();
console.log(hd.getCountries());
// ['AD', 'AE', 'AF', ..., 'ZA', 'ZM', 'ZW']
```

---

## 🎯 Exemples pratiques

### Exemple 1: Vérifier si demain est un jour ferié

```typescript
import Holidays from 'date-holidays';

function isTomorrowHoliday(countryCode: string): boolean {
  const hd = new Holidays(countryCode);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return hd.isHoliday(tomorrow);
}

console.log(isTomorrowHoliday('FR')); // true ou false
```

### Exemple 2: Calculer délai de livraison (excluant jours fériés)

```typescript
import Holidays from 'date-holidays';

function calculateDeliveryDate(
  startDate: Date,
  businessDays: number,
  countryCode: string = 'FR'
): Date {
  const hd = new Holidays(countryCode);
  let current = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    current.setDate(current.getDate() + 1);
    
    // Vérifier si c'est un weekend ou un jour férié
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;
    const isHoliday = hd.isHoliday(current);
    
    if (!isWeekend && !isHoliday) {
      daysAdded++;
    }
  }
  
  return current;
}

const startDate = new Date('2026-05-26');
const deliveryDate = calculateDeliveryDate(startDate, 5, 'FR');
console.log(deliveryDate);
// 2026-06-02 (5 jours ouvrables après le 26 mai)
```

### Exemple 3: Afficher les jours fériés du mois

```typescript
import Holidays from 'date-holidays';

function displayMonthHolidays(year: number, month: number, countryCode: string = 'FR') {
  const hd = new Holidays(countryCode);
  const holidays = hd.getHolidays(year, month);
  
  console.log(`Jours fériés de ${month}/${year} en ${countryCode}:`);
  holidays.forEach(({ date, name }) => {
    console.log(`  ${date}: ${name}`);
  });
}

displayMonthHolidays(2026, 5, 'FR');
// Jours fériés de 5/2026 en FR:
//   2026-05-01: May Day
//   2026-05-08: Victory in Europe Day
//   2026-05-14: Ascension Thursday
//   2026-05-25: Whit Monday
```

### Exemple 4: Générer calendrier avec jours fériés

```typescript
import Holidays from 'date-holidays';

interface CalendarDay {
  date: Date;
  isHoliday: boolean;
  holidayName?: string;
  isWeekend: boolean;
}

function generateCalendar(year: number, month: number, countryCode: string = 'FR'): CalendarDay[] {
  const hd = new Holidays(countryCode);
  const calendar: CalendarDay[] = [];
  
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month - 1, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = hd.isHoliday(date);
    const holidayName = isHoliday ? hd.getName(date) : undefined;
    
    calendar.push({
      date,
      isHoliday,
      holidayName,
      isWeekend
    });
  }
  
  return calendar;
}

const calendar = generateCalendar(2026, 5, 'FR');
calendar.forEach(day => {
  if (day.isHoliday || day.isWeekend) {
    console.log(`${day.date.toDateString()}: ${day.isHoliday ? day.holidayName : 'Weekend'}`);
  }
});
```

### Exemple 5: Réserver un créneau (passer les jours fériés)

```typescript
import Holidays from 'date-holidays';

interface TimeSlot {
  date: Date;
  available: boolean;
  reason?: string;
}

function findNextAvailableSlot(startDate: Date, countryCode: string = 'FR'): TimeSlot {
  const hd = new Holidays(countryCode);
  const current = new Date(startDate);
  
  while (true) {
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;
    const isHoliday = hd.isHoliday(current);
    
    if (!isWeekend && !isHoliday) {
      return {
        date: new Date(current),
        available: true
      };
    }
    
    current.setDate(current.getDate() + 1);
    
    if (isWeekend) {
      continue;
    }
    if (isHoliday) {
      return {
        date: new Date(current),
        available: false,
        reason: hd.getName(current)
      };
    }
  }
}

const slot = findNextAvailableSlot(new Date('2026-05-26'), 'FR');
console.log(slot);
// { date: 2026-05-27T00:00:00.000Z, available: true }
```

### Exemple 6: Vérifier plusieurs pays

```typescript
import Holidays from 'date-holidays';

function getHolidayName(date: Date, countryCodes: string[]): Map<string, string | null> {
  const result = new Map<string, string | null>();
  
  countryCodes.forEach(code => {
    const hd = new Holidays(code);
    const name = hd.isHoliday(date) ? hd.getName(date) : null;
    result.set(code, name);
  });
  
  return result;
}

const date = new Date('2026-07-14');
const holidays = getHolidayName(date, ['FR', 'US', 'DE']);

holidays.forEach((name, country) => {
  console.log(`${country}: ${name || 'Not a holiday'}`);
});
// FR: Bastille Day
// US: Not a holiday
// DE: Not a holiday
```

---

## 📊 Types de jours fériés

```typescript
// Différents types de jours fériés
const hd = new Holidays('FR', {
  types: ['public']      // Jours fériés publics
});

// Types disponibles:
// - 'public'    : Jours fériés publics officiels
// - 'bank'      : Jours fériés bancaires
// - 'optional'  : Jours optionnels
// - 'observance': Jours d'observation
```

---

## 🔄 Avec Luxon (meilleure pratique)

```typescript
import Holidays from 'date-holidays';
import { DateTime } from 'luxon';

// Intégration avec Luxon
class HolidayManager {
  private hd: Holidays;
  
  constructor(countryCode: string) {
    this.hd = new Holidays(countryCode);
  }
  
  isHolidayLuxon(luxonDate: DateTime): boolean {
    return this.hd.isHoliday(luxonDate.toJSDate());
  }
  
  getNameLuxon(luxonDate: DateTime): string | null {
    return this.hd.getName(luxonDate.toJSDate());
  }
  
  getHolidaysInRangeLuxon(start: DateTime, end: DateTime) {
    return this.hd.getHolidays(
      start.toJSDate(),
      end.toJSDate()
    );
  }
}

// Utilisation
const manager = new HolidayManager('FR');
const date = DateTime.now();

console.log(manager.isHolidayLuxon(date));
console.log(manager.getNameLuxon(date));
```

---

## 📱 Utilisation dans React

### Hook personnalisé

```typescript
import { useMemo } from 'react';
import Holidays from 'date-holidays';

function useHolidays(countryCode: string) {
  const hd = useMemo(() => new Holidays(countryCode), [countryCode]);
  
  return {
    isHoliday: (date: Date) => hd.isHoliday(date),
    getName: (date: Date) => hd.getName(date),
    getHolidays: (year: number) => hd.getHolidays(year),
    getCountries: () => hd.getCountries()
  };
}

// Utilisation dans un composant
function HolidayChecker() {
  const { isHoliday, getName } = useHolidays('FR');
  const today = new Date();
  
  return (
    <div>
      <p>{today.toDateString()}</p>
      {isHoliday(today) ? (
        <p className="highlight">🎉 C'est un jour férié: {getName(today)}</p>
      ) : (
        <p>Jour normal</p>
      )}
    </div>
  );
}
```

### Composant de calendrier

```typescript
import { useState } from 'react';
import Holidays from 'date-holidays';

interface CalendarProps {
  year: number;
  month: number;
  countryCode: string;
}

function Calendar({ year, month, countryCode }: CalendarProps) {
  const hd = new Holidays(countryCode);
  
  const getDaysInMonth = () => {
    const days = [];
    const date = new Date(year, month - 1, 1);
    
    while (date.getMonth() === month - 1) {
      const isHoliday = hd.isHoliday(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push({
        date: new Date(date),
        isHoliday,
        isWeekend,
        name: isHoliday ? hd.getName(date) : null
      });
      
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };
  
  const days = getDaysInMonth();
  
  return (
    <div className="calendar">
      {days.map((day, i) => (
        <div
          key={i}
          className={`day ${day.isHoliday ? 'holiday' : ''} ${day.isWeekend ? 'weekend' : ''}`}
          title={day.name || ''}
        >
          {day.date.getDate()}
        </div>
      ))}
    </div>
  );
}
```

---

## ⚠️ Limitations et considérations

### ⚠️ Limitation 1: Jours fériés mobiles

Les jours fériés comme Pâques changent chaque année :

```typescript
const hd = new Holidays('FR');

// Pâques 2026
console.log(hd.getHoliday('2026-04-05')); // Easter Sunday
console.log(hd.getHoliday('2026-04-06')); // Easter Monday

// Pâques 2027
console.log(hd.getHoliday('2027-04-25')); // Easter Sunday
console.log(hd.getHoliday('2027-04-26')); // Easter Monday
```

### ⚠️ Limitation 2: Données publiques limitées

Certains pays/régions ont des données limitées ou manquantes.

```typescript
// Vérifier les jours fériés disponibles
const hd = new Holidays('FR');
const holidays2026 = hd.getHolidays(2026);
console.log(`${holidays2026.length} jours fériés trouvés en 2026`);
```

### ⚠️ Limitation 3: Jours fériés non officiels

La librairie gère principalement les jours fériés **officiels**, pas les jours spéciaux commerciaux (Black Friday, etc.).

---

## 🚀 Performance

### Caching

```typescript
import Holidays from 'date-holidays';

// Les instances sont cachées automatiquement
const hd1 = new Holidays('FR');
const hd2 = new Holidays('FR');

// Même instance en cache
console.log(hd1 === hd2); // true (optimisé)
```

### Bonnes pratiques

```typescript
// ✅ BON: Créer une instance une fois
class HolidayService {
  private holidays = new Holidays('FR');
  
  isHoliday(date: Date) {
    return this.holidays.isHoliday(date);
  }
}

// ❌ MAUVAIS: Créer une nouvelle instance à chaque fois
function isHoliday(date: Date) {
  return new Holidays('FR').isHoliday(date); // Inefficace
}
```

---

## 📚 Ressources

- **GitHub:** https://github.com/commenthol/date-holidays
- **NPM:** https://www.npmjs.com/package/date-holidays
- **Codes pays ISO 3166:** https://www.iso.org/obp/ui/#search

