# Luxon DateTime - Guide Complet

## 📅 Introduction

**Luxon** est une librairie JavaScript/TypeScript moderne pour manipuler les dates et heures. C'est le successeur spiritual de **Moment.js** (qui est maintenant en mode maintenance).

### Pourquoi Luxon ?

✅ **Immutable** - Les objets DateTime ne changent pas (fonctionnel)
✅ **Chainable** - Méthodes enchaînables fluides
✅ **Fuseaux horaires** - Gestion native et simple des timezones
✅ **i18n** - Support multilingue intégré
✅ **TypeScript** - Support natif TypeScript
✅ **Léger** - Plus petit que Moment.js
✅ **Pas de dépendances** - Zéro dépendances externes

### Quand l'utiliser ?

- ✅ Manipulation complexe de dates
- ✅ Travail avec fuseaux horaires
- ✅ Formatage personnalisé de dates
- ✅ Calculs de durées et d'intervalles
- ✅ Validation de dates

---

## 🚀 Installation

```bash
npm install luxon
# ou
yarn add luxon
```

### TypeScript

```bash
npm install --save-dev @types/luxon
```

### Imports

```typescript
// Import complet
import { DateTime, Duration, Interval } from 'luxon';

// Ou imports spécifiques
import { DateTime } from 'luxon';
```

---

## 🔢 Concepts de base

### 1. DateTime - Manipulation de dates/heures

```typescript
import { DateTime } from 'luxon';

// Maintenant
const now = DateTime.now();
console.log(now.toString()); // "2026-05-26T14:30:45.123+02:00"

// Aujourd'hui
const today = DateTime.now().startOf('day');

// Demain
const tomorrow = DateTime.now().plus({ days: 1 });

// UTC
const utc = DateTime.utc();
console.log(utc.toString()); // "2026-05-26T12:30:45.123Z"
```

### 2. Duration - Durées

```typescript
import { Duration } from 'luxon';

// Créer une durée
const duration = Duration.fromObject({ hours: 2, minutes: 30 });
console.log(duration.as('minutes')); // 150

// À partir de millisecondes
const durationMs = Duration.fromMillis(5000);
console.log(durationMs.as('seconds')); // 5

// ISO 8601
const iso = Duration.fromISO('PT2H30M');
console.log(iso.as('minutes')); // 150
```

### 3. Interval - Intervalles

```typescript
import { DateTime, Interval } from 'luxon';

const start = DateTime.fromISO('2026-05-26');
const end = DateTime.fromISO('2026-05-31');

const interval = Interval.fromDateTimes(start, end);
console.log(interval.length('days')); // 5
console.log(interval.toString()); // "[2026-05-26 → 2026-05-31]"
```

---

## 📝 Parsing (Créer des dates)

### À partir d'une chaîne ISO 8601

```typescript
// Format ISO complet
const dt1 = DateTime.fromISO('2026-05-26T14:30:45.123+02:00');

// Date seulement
const dt2 = DateTime.fromISO('2026-05-26');

// Avec Z (UTC)
const dt3 = DateTime.fromISO('2026-05-26T12:30:45Z');
```

### À partir d'un format personnalisé

```typescript
// Format personnalisé avec tokens
const dt = DateTime.fromFormat('26/05/2026 14:30', 'dd/MM/yyyy HH:mm');

// Tokens courants:
// yyyy = année (2026)
// yy = année courte (26)
// MM = mois (05)
// dd = jour (26)
// HH = heure 24h (14)
// hh = heure 12h (02)
// mm = minutes (30)
// ss = secondes (45)
// SSS = millisecondes (123)
// a = AM/PM
// z = timezone (Europe/Paris)
```

### À partir d'un objet

```typescript
const dt = DateTime.fromObject({
  year: 2026,
  month: 5,
  day: 26,
  hour: 14,
  minute: 30,
  second: 45,
  zone: 'Europe/Paris' // timezone
});
```

### À partir d'un timestamp Unix

```typescript
// En secondes
const dt1 = DateTime.fromSeconds(1685120445);

// En millisecondes (comme Date JavaScript)
const dt2 = DateTime.fromMillis(1685120445000);

// À partir d'une Date JavaScript native
const jsDate = new Date();
const dt3 = DateTime.fromJSDate(jsDate);
```

---

## 🎨 Formatting (Afficher les dates)

### Formats prédéfinis

```typescript
const dt = DateTime.now();

// ISO 8601 complet
console.log(dt.toISO()); // "2026-05-26T14:30:45.123+02:00"

// ISO sans millisecondes
console.log(dt.toISO({ suppressMilliseconds: true })); // "2026-05-26T14:30:45+02:00"

// ISO date seulement
console.log(dt.toISODate()); // "2026-05-26"

// ISO time seulement
console.log(dt.toISOTime()); // "14:30:45.123+02:00"

// RFC 2822
console.log(dt.toRFC2822()); // "Tue, 26 May 2026 14:30:45 +0200"

// HTTP
console.log(dt.toHTTP()); // "Tue, 26 May 2026 12:30:45 GMT"

// SQL
console.log(dt.toSQL()); // "2026-05-26 14:30:45.123"
console.log(dt.toSQLDate()); // "2026-05-26"
console.log(dt.toSQLTime()); // "14:30:45.123"
```

### Formats personnalisés

```typescript
const dt = DateTime.fromISO('2026-05-26T14:30:45');

// Français
console.log(dt.toFormat('dd MMMM yyyy', { locale: 'fr' }));
// "26 mai 2026"

console.log(dt.toFormat('EEEE dd MMMM yyyy HH:mm', { locale: 'fr' }));
// "mardi 26 mai 2026 14:30"

// Anglais
console.log(dt.toFormat('EEEE, MMMM dd, yyyy h:mm a', { locale: 'en-US' }));
// "Tuesday, May 26, 2026 2:30 PM"

// Allemand
console.log(dt.toFormat('cccc, d. MMMM yyyy, HH:mm', { locale: 'de' }));
// "Dienstag, 26. Mai 2026, 14:30"
```

### Tokens de format

```typescript
const dt = DateTime.now();

// Année
dt.toFormat('yyyy'); // 2026
dt.toFormat('yy');   // 26

// Mois
dt.toFormat('MM');   // 05 (numérique)
dt.toFormat('MMM');  // May (court)
dt.toFormat('MMMM'); // May (long)

// Jour
dt.toFormat('dd');   // 26
dt.toFormat('d');    // 26 (pas de leading zero)
dt.toFormat('EE');   // Tu (court)
dt.toFormat('EEEE'); // Tuesday (long)
dt.toFormat('c');    // 2 (jour semaine: 1=lundi, 7=dimanche)

// Heure/Minute/Seconde
dt.toFormat('HH:mm:ss');  // 14:30:45
dt.toFormat('hh:mm:ss a'); // 02:30:45 PM
dt.toFormat('HH:mm:ss Z'); // 14:30:45 +02:00

// Trimestre
dt.toFormat('q'); // 2 (Q2)
```

---

## ➕➖ Manipulation de dates

### Ajouter/Soustraire

```typescript
const dt = DateTime.now();

// Ajouter
dt.plus({ days: 5 });           // +5 jours
dt.plus({ months: 1 });         // +1 mois
dt.plus({ years: 1 });          // +1 an
dt.plus({ hours: 2, minutes: 30 }); // +2h30m
dt.plus({ weeks: 2 });          // +2 semaines

// Soustraire
dt.minus({ days: 3 });          // -3 jours
dt.minus({ months: 1 });        // -1 mois
dt.minus({ hours: 5 });         // -5 heures

// Chaîner
dt.plus({ days: 1 }).minus({ hours: 2 }).plus({ minutes: 15 });
```

### Arrondir/Tronquer

```typescript
const dt = DateTime.fromISO('2026-05-26T14:37:45.123');

// Arrondir à l'unité
dt.startOf('day');    // 2026-05-26T00:00:00
dt.startOf('hour');   // 2026-05-26T14:00:00
dt.startOf('minute'); // 2026-05-26T14:37:00

dt.endOf('day');      // 2026-05-26T23:59:59.999
dt.endOf('hour');     // 2026-05-26T14:59:59.999
dt.endOf('month');    // 2026-05-31T23:59:59.999
```

### Définir des valeurs

```typescript
const dt = DateTime.now();

// Remplacer des valeurs
dt.set({ month: 12, day: 25 }); // Noël
dt.set({ hour: 0, minute: 0 }); // Minuit
dt.set({ millisecond: 0 });     // Enlever millisecondes
```

---

## 🌍 Fuseaux horaires (Timezones)

### Convertir entre timezones

```typescript
import { DateTime } from 'luxon';

// Créer une date dans une timezone spécifique
const parisian = DateTime.now().setZone('Europe/Paris');
const newyorker = DateTime.now().setZone('America/New_York');
const tokyoite = DateTime.now().setZone('Asia/Tokyo');

console.log(parisian.toString());  // "2026-05-26T14:30:45.123+02:00"
console.log(newyorker.toString()); // "2026-05-26T08:30:45.123-04:00"
console.log(tokyoite.toString());  // "2026-05-26T21:30:45.123+09:00"

// Même instant, affichages différents
console.log(parisian.toISO() === newyorker.toISO()); // true (même instant)
console.log(parisian.hour); // 14
console.log(newyorker.hour); // 8
```

### Timezones courants

```
// Europe
Europe/Paris
Europe/London
Europe/Berlin
Europe/Madrid
Europe/Amsterdam

// Amérique
America/New_York (EST/EDT)
America/Chicago (CST/CDT)
America/Denver (MST/MDT)
America/Los_Angeles (PST/PDT)
America/Mexico_City
America/Toronto

// Asie
Asia/Tokyo
Asia/Shanghai
Asia/Hong_Kong
Asia/Bangkok
Asia/Singapore
Asia/Dubai
Asia/Kolkata
Asia/Tokyo

// Autres
Australia/Sydney
Pacific/Auckland
UTC
```

---

## 🔍 Comparaison et requêtes

### Comparer des dates

```typescript
const dt1 = DateTime.fromISO('2026-05-26');
const dt2 = DateTime.fromISO('2026-05-27');

// Égalité
dt1.equals(dt2); // false
dt1.equals(dt1); // true

// Avant/Après
dt1 < dt2; // true (opérateurs natifs)
dt1 > dt2; // false
dt1 <= dt2; // true
dt1 >= dt2; // false

// Méthodes
dt1.hasSame(dt2, 'day'); // false
dt1.hasSame(dt2, 'month'); // true
dt1.hasSame(dt2, 'year'); // true
```

### Intervalles

```typescript
const start = DateTime.fromISO('2026-05-26');
const end = DateTime.fromISO('2026-05-31');
const interval = Interval.fromDateTimes(start, end);

// Durée
interval.length('days'); // 5
interval.length('hours'); // 120

// Vérifier si une date est dans l'intervalle
const testDate = DateTime.fromISO('2026-05-28');
interval.contains(testDate); // true

// Chevauchement
const interval2 = Interval.fromDateTimes(
  DateTime.fromISO('2026-05-29'),
  DateTime.fromISO('2026-06-02')
);
interval.overlap(interval2); // Interval{...} (intervalle de chevauchement)
```

### Différence entre deux dates

```typescript
const start = DateTime.fromISO('2026-05-26T10:00:00');
const end = DateTime.fromISO('2026-05-26T14:30:45');

// Durée
const diff = end.diff(start);
console.log(diff.as('hours')); // 4.514583...
console.log(diff.as('minutes')); // 270.916...
console.log(diff.as('seconds')); // 16255

// Objet structuré
const diffObj = end.diff(start, ['hours', 'minutes', 'seconds']).toObject();
console.log(diffObj); // { hours: 4, minutes: 30, seconds: 45 }
```

---

## 📊 Exemples pratiques

### Exemple 1: Affiche un compte à rebours

```typescript
import { DateTime, Duration } from 'luxon';

function displayCountdown(targetDate: string) {
  const target = DateTime.fromISO(targetDate);
  const now = DateTime.now();
  
  if (now > target) {
    console.log('La date est passée !');
    return;
  }
  
  const remaining = target.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
  console.log(
    `${remaining.days}j ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`
  );
}

// Utilisation
displayCountdown('2026-06-26T00:00:00');
// "31j 9h 29m 15s"
```

### Exemple 2: Calcul d'âge en années

```typescript
import { DateTime } from 'luxon';

function calculateAge(birthDate: string): number {
  const birth = DateTime.fromISO(birthDate);
  const today = DateTime.now();
  
  let age = today.year - birth.year;
  
  // Vérifier si l'anniversaire n'a pas encore eu lieu cette année
  const birthdayThisYear = birth.set({ year: today.year });
  if (today < birthdayThisYear) {
    age--;
  }
  
  return age;
}

console.log(calculateAge('1995-08-15')); // 30 ou 31 selon date actuelle
```

### Exemple 3: Formater des dates pour affichage

```typescript
import { DateTime } from 'luxon';

function formatDateForDisplay(dateISO: string, locale: string = 'fr'): string {
  const dt = DateTime.fromISO(dateISO);
  const now = DateTime.now();
  
  const diffDays = now.diff(dt, 'days').days;
  
  if (diffDays < 1 && now.hasSame(dt, 'day')) {
    // Aujourd'hui
    const diffHours = now.diff(dt, 'hours').hours;
    if (diffHours < 1) {
      return 'À l\'instant';
    }
    return `Il y a ${Math.floor(diffHours)}h`;
  } else if (diffDays < 7) {
    return `Il y a ${Math.floor(diffDays)}j`;
  } else {
    return dt.toFormat('dd MMMM yyyy', { locale });
  }
}

console.log(formatDateForDisplay('2026-05-26T10:00:00'));
// "Il y a 4h" (si on est le 26 mai à 14h)
```

### Exemple 4: Réservations avec créneaux

```typescript
import { DateTime } from 'luxon';

interface TimeSlot {
  start: DateTime;
  end: DateTime;
  available: boolean;
}

function generateTimeSlots(date: string, slotDuration: number = 30): TimeSlot[] {
  const day = DateTime.fromISO(date).set({ hour: 9, minute: 0 }); // 9h
  const endDay = day.set({ hour: 17 }); // 17h
  
  const slots: TimeSlot[] = [];
  let current = day;
  
  while (current < endDay) {
    slots.push({
      start: current,
      end: current.plus({ minutes: slotDuration }),
      available: true
    });
    current = current.plus({ minutes: slotDuration });
  }
  
  return slots;
}

const slots = generateTimeSlots('2026-05-26');
slots.slice(0, 3).forEach(slot => {
  console.log(`${slot.start.toFormat('HH:mm')} - ${slot.end.toFormat('HH:mm')}`);
});
// "09:00 - 09:30"
// "09:30 - 10:00"
// "10:00 - 10:30"
```

### Exemple 5: Calcul TVA avec dates

```typescript
import { DateTime } from 'luxon';

interface Invoice {
  amount: number;
  taxRate: number;
  date: DateTime;
  dueDate: DateTime;
}

function createInvoice(amount: number, taxRate: number = 0.20, paymentTermsDays: number = 30): Invoice {
  const date = DateTime.now();
  return {
    amount,
    taxRate,
    date,
    dueDate: date.plus({ days: paymentTermsDays })
  };
}

const invoice = createInvoice(100);
console.log({
  issueDate: invoice.date.toISODate(),
  dueDate: invoice.dueDate.toISODate(),
  amountHT: invoice.amount,
  amountTTC: invoice.amount * (1 + invoice.taxRate),
  daysLeft: Math.floor(invoice.dueDate.diff(DateTime.now(), 'days').days)
});
```

---

## 📱 Utilisation dans React/TypeScript

### Hook personnalisé pour temps réel

```typescript
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

function useNow(updateInterval: number = 1000) {
  const [now, setNow] = useState(DateTime.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(DateTime.now());
    }, updateInterval);
    
    return () => clearInterval(timer);
  }, [updateInterval]);
  
  return now;
}

// Utilisation
function Clock() {
  const now = useNow(1000);
  return <div>{now.toFormat('HH:mm:ss')}</div>;
}
```

### Composant de compte à rebours

```typescript
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

interface CountdownProps {
  targetDate: string;
}

function Countdown({ targetDate }: CountdownProps) {
  const [remaining, setRemaining] = useState<string>('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const target = DateTime.fromISO(targetDate);
      const now = DateTime.now();
      
      if (now > target) {
        setRemaining('Terminé !');
        return;
      }
      
      const diff = target.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
      setRemaining(
        `${diff.days}j ${diff.hours}h ${diff.minutes}m ${diff.seconds}s`
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return <div>{remaining}</div>;
}
```

---

## 🔄 Conversion avec Date JavaScript

### Luxon ↔ Date

```typescript
import { DateTime } from 'luxon';

// De Date à Luxon
const jsDate = new Date();
const luxonDate = DateTime.fromJSDate(jsDate);

// De Luxon à Date
const luxonDate2 = DateTime.now();
const jsDate2 = luxonDate2.toJSDate();

// Attention: pas de timezone preserved
const paris = DateTime.now().setZone('Europe/Paris');
const jsDate3 = paris.toJSDate();
// ⚠️ jsDate3 perd l'information timezone, c'est juste un instant en temps
```

---

## 🆚 Luxon vs Alternatives

### Luxon vs Moment.js

| Aspect | Luxon | Moment.js |
|--------|-------|-----------|
| **Mutable** | ❌ Immutable | ✅ Mutable |
| **Taille** | 67 KB | 67 KB |
| **Maintenance** | ✅ Actif | ⚠️ Legacy mode |
| **TypeScript** | ✅ Natif | ❌ Pas de types |
| **Timezone** | ✅ Intégré | ❌ Plugin requis |
| **Recommandé** | ✅ **OUI** | ❌ Non |

### Luxon vs Date native

```typescript
// Date native - Difficile
const jsDate = new Date('2026-05-26T14:30:45Z');
const futureDate = new Date(jsDate.getTime() + 24 * 60 * 60 * 1000);
const formattedDate = futureDate.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Luxon - Simple
const luxonDate = DateTime.fromISO('2026-05-26T14:30:45Z');
const futureDate2 = luxonDate.plus({ days: 1 });
const formattedDate2 = futureDate2.toFormat('dd MMMM yyyy', { locale: 'fr' });
```

---

## ⚙️ Configuration

### Paramètres globaux

```typescript
import { Settings } from 'luxon';

// Définir la timezone par défaut
Settings.defaultZone = 'Europe/Paris';

// Définir la locale par défaut
Settings.defaultLocale = 'fr';

// Maintenant, toutes les dates utilisent Paris
const dt = DateTime.now();
console.log(dt.toString()); // Heure de Paris
```

---

## 📚 Ressources

- **Documentation officielle:** https://moment.github.io/luxon/
- **IANA Timezone Database:** https://www.iana.org/time-zones
- **Format tokens:** https://moment.github.io/luxon/docs/manual/formatting.html

