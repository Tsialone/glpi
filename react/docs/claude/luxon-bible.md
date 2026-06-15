# 📅 Bible Luxon — DateTime Complète

> **Luxon** est une bibliothèque JavaScript pour la manipulation des dates et heures.
> Basée sur l'API native `Intl`, elle est immutable et supporte les timezones & locales.

---

## 📦 Installation & Import

```bash
npm install luxon
```

```js
// ES Modules
import { DateTime, Duration, Interval, Info } from 'luxon';

// CommonJS
const { DateTime, Duration, Interval, Info } = require('luxon');
```

---

## 🏗️ Création d'un DateTime

### Maintenant

```js
DateTime.now()                          // Date/heure locale actuelle
DateTime.utc()                          // Date/heure UTC actuelle
```

### Depuis une chaîne ISO

```js
DateTime.fromISO('2024-01-15')
DateTime.fromISO('2024-01-15T10:30:00')
DateTime.fromISO('2024-01-15T10:30:00+02:00')
DateTime.fromISO('2024-01-15', { zone: 'Europe/Paris' })
```

### Depuis un objet JS `Date`

```js
DateTime.fromJSDate(new Date())
DateTime.fromJSDate(new Date(), { zone: 'utc' })
```

### Depuis un timestamp Unix

```js
DateTime.fromMillis(1705312200000)      // millisecondes
DateTime.fromSeconds(1705312200)        // secondes
```

### Depuis un objet littéral

```js
DateTime.fromObject({
  year: 2024,
  month: 1,       // 1 = Janvier (pas 0 !)
  day: 15,
  hour: 10,
  minute: 30,
  second: 0,
  millisecond: 0
})

// Avec une zone
DateTime.fromObject({ year: 2024, month: 6, day: 1 }, { zone: 'America/New_York' })
```

### Depuis un format personnalisé

```js
DateTime.fromFormat('15/01/2024', 'dd/MM/yyyy')
DateTime.fromFormat('Jan 15, 2024', 'LLL dd, yyyy')
DateTime.fromFormat('15-01-2024 10:30', 'dd-MM-yyyy HH:mm')
DateTime.fromFormat('2024-01-15', 'yyyy-MM-dd', { locale: 'fr' })
```

### Depuis un format HTTP / RFC2822 / SQL

```js
DateTime.fromHTTP('Mon, 15 Jan 2024 10:30:00 GMT')
DateTime.fromRFC2822('Mon, 15 Jan 2024 10:30:00 +0200')
DateTime.fromSQL('2024-01-15 10:30:00')
```

---

## 🔍 Accès aux propriétés

```js
const dt = DateTime.now();

dt.year           // 2024
dt.month          // 1–12 (1 = Janvier)
dt.day            // 1–31
dt.hour           // 0–23
dt.minute         // 0–59
dt.second         // 0–59
dt.millisecond    // 0–999

dt.weekday        // 1 = Lundi … 7 = Dimanche (ISO)
dt.weekNumber     // 1–53 (semaine ISO)
dt.weekYear       // Année ISO (peut différer de .year en déc/jan)
dt.quarter        // 1–4
dt.ordinal        // Jour de l'année (1–366)
dt.daysInMonth    // Nombre de jours dans le mois actuel
dt.daysInYear     // 365 ou 366
dt.isInLeapYear   // true/false
dt.offset         // Décalage UTC en minutes (ex: 120 pour UTC+2)
dt.zoneName       // 'Europe/Paris', 'UTC', etc.
dt.locale         // 'fr', 'en-US', etc.
dt.isValid        // true/false
dt.invalidReason  // Raison si invalide
dt.ts             // Timestamp en millisecondes
```

---

## 🎨 Formatage (`.toFormat()`)

### Tokens de format

| Token | Description | Exemple |
|-------|-------------|---------|
| `yyyy` | Année 4 chiffres | `2024` |
| `yy` | Année 2 chiffres | `24` |
| `MM` | Mois 2 chiffres | `01` |
| `M` | Mois sans zéro | `1` |
| `MMMM` | Nom du mois complet | `janvier` |
| `MMM` | Nom abrégé | `janv.` |
| `dd` | Jour 2 chiffres | `05` |
| `d` | Jour sans zéro | `5` |
| `EEEE` | Nom du jour complet | `lundi` |
| `EEE` | Nom abrégé | `lun.` |
| `HH` | Heure 24h, 2 chiffres | `09` |
| `H` | Heure 24h sans zéro | `9` |
| `hh` | Heure 12h, 2 chiffres | `09` |
| `h` | Heure 12h sans zéro | `9` |
| `mm` | Minutes 2 chiffres | `05` |
| `ss` | Secondes 2 chiffres | `05` |
| `SSS` | Millisecondes | `123` |
| `a` | AM/PM | `AM` |
| `Z` | Offset timezone | `+02:00` |
| `ZZ` | Offset sans `:` | `+0200` |
| `z` | Abréviation timezone | `CEST` |
| `x` | Timestamp Unix (ms) | `1705312200000` |
| `X` | Timestamp Unix (s) | `1705312200` |
| `W` | Numéro de semaine ISO | `03` |
| `kk` | Année semaine ISO | `2024` |
| `q` | Trimestre | `1` |
| `o` | Jour de l'année | `15` |
| `'...'` | Texte littéral | `'le'` |

### Exemples de formatage

```js
const dt = DateTime.fromObject({ year: 2024, month: 1, day: 5, hour: 9, minute: 7 });

dt.toFormat('yyyy-MM-dd')                    // '2024-01-05'
dt.toFormat('dd/MM/yyyy')                    // '05/01/2024'
dt.toFormat('EEEE dd MMMM yyyy', { locale: 'fr' })  // 'vendredi 05 janvier 2024'
dt.toFormat("HH'h'mm")                       // '09h07'
dt.toFormat('dd/MM/yyyy HH:mm:ss')          // '05/01/2024 09:07:00'
dt.toFormat("'le' d MMMM yyyy 'à' HH:mm")  // 'le 5 janvier 2024 à 09:07'
```

---

## 📤 Conversion vers d'autres formats

```js
const dt = DateTime.now();

dt.toISO()                   // '2024-01-15T10:30:00.000+02:00'
dt.toISODate()               // '2024-01-15'
dt.toISOTime()               // '10:30:00.000+02:00'
dt.toISO({ suppressMilliseconds: true })     // Sans millisecondes
dt.toISO({ includeOffset: false })           // Sans offset
dt.toUTC().toISO()           // En UTC

dt.toJSDate()                // Objet Date natif JS
dt.toMillis()                // Timestamp ms (= dt.ts)
dt.toSeconds()               // Timestamp secondes
dt.toUnixInteger()           // Alias de toSeconds()

dt.toObject()                // { year, month, day, hour, minute, second, millisecond }
dt.toBSON()                  // Format BSON

dt.toHTTP()                  // 'Mon, 15 Jan 2024 08:30:00 GMT'
dt.toRFC2822()               // 'Mon, 15 Jan 2024 10:30:00 +0200'
dt.toSQL()                   // '2024-01-15 10:30:00.000 +02:00'
dt.toSQLDate()               // '2024-01-15'
dt.toSQLTime()               // '10:30:00.000 +02:00'

// Formatage Intl natif
dt.toLocaleString()                           // '15/01/2024' (selon locale)
dt.toLocaleString(DateTime.DATE_FULL)         // 'lundi 15 janvier 2024'
dt.toLocaleString(DateTime.DATE_MED)          // '15 janv. 2024'
dt.toLocaleString(DateTime.DATE_SHORT)        // '15/01/2024'
dt.toLocaleString(DateTime.TIME_SIMPLE)       // '10:30'
dt.toLocaleString(DateTime.TIME_WITH_SECONDS) // '10:30:00'
dt.toLocaleString(DateTime.DATETIME_FULL)     // 'lundi 15 janvier 2024 à 10:30 UTC+2'
dt.toLocaleString(DateTime.DATETIME_SHORT)    // '15/01/2024 10:30'
dt.toLocaleString({ locale: 'fr', ...DateTime.DATE_FULL }) // Avec locale explicite
```

### Presets `toLocaleString` disponibles

| Preset | Exemple FR |
|--------|-----------|
| `DateTime.DATE_SHORT` | `15/01/2024` |
| `DateTime.DATE_MED` | `15 janv. 2024` |
| `DateTime.DATE_MED_WITH_WEEKDAY` | `lun. 15 janv. 2024` |
| `DateTime.DATE_FULL` | `lundi 15 janvier 2024` |
| `DateTime.DATE_HUGE` | `lundi 15 janvier 2024` |
| `DateTime.TIME_SIMPLE` | `10:30` |
| `DateTime.TIME_WITH_SECONDS` | `10:30:00` |
| `DateTime.TIME_WITH_SHORT_OFFSET` | `10:30 UTC+2` |
| `DateTime.TIME_WITH_LONG_OFFSET` | `10:30 heure normale d'Europe centrale` |
| `DateTime.TIME_24_SIMPLE` | `10:30` |
| `DateTime.DATETIME_SHORT` | `15/01/2024 10:30` |
| `DateTime.DATETIME_MED` | `15 janv. 2024 10:30` |
| `DateTime.DATETIME_FULL` | `lundi 15 janvier 2024 10:30 UTC+2` |
| `DateTime.DATETIME_HUGE` | `lundi 15 janvier 2024 10:30 heure d'été d'Europe centrale` |

---

## ➕ Manipulation (Immutable — retourne toujours un nouveau DateTime)

### `.plus()` / `.minus()`

```js
dt.plus({ years: 1 })
dt.plus({ months: 2, days: 3 })
dt.plus({ hours: 5, minutes: 30 })
dt.plus({ weeks: 1 })
dt.minus({ days: 7 })
dt.minus({ months: 1, hours: 2 })

// Avec un objet Duration
const dur = Duration.fromObject({ days: 5 });
dt.plus(dur)
```

### `.set()` — Modifier des champs spécifiques

```js
dt.set({ year: 2025 })
dt.set({ month: 12, day: 31 })
dt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
```

### `.startOf()` / `.endOf()`

```js
dt.startOf('year')        // 1er janvier, 00:00:00.000
dt.startOf('month')       // 1er du mois, 00:00:00.000
dt.startOf('week')        // Lundi de la semaine, 00:00:00.000
dt.startOf('day')         // Aujourd'hui à 00:00:00.000
dt.startOf('hour')        // H:00:00.000
dt.startOf('minute')      // H:mm:00.000
dt.startOf('second')      // H:mm:ss.000
dt.startOf('quarter')     // 1er jour du trimestre, 00:00:00.000

dt.endOf('year')          // 31 déc, 23:59:59.999
dt.endOf('month')         // Dernier jour du mois, 23:59:59.999
dt.endOf('week')          // Dimanche, 23:59:59.999
dt.endOf('day')           // 23:59:59.999
```

---

## 🌍 Timezones

```js
// Changer de timezone (convertit l'instant)
dt.setZone('America/New_York')
dt.setZone('Europe/Paris')
dt.setZone('Asia/Tokyo')
dt.setZone('UTC')
dt.setZone('UTC+5:30')      // Offset fixe

// Garder le même affichage local mais changer la zone
dt.setZone('America/New_York', { keepLocalTime: true })

// Convertir en UTC
dt.toUTC()
dt.toLocal()   // Retour à la timezone locale du système

// Créer directement en UTC
DateTime.utc(2024, 1, 15, 10, 30)
```

### Zones courantes

```
UTC, Europe/Paris, Europe/London, America/New_York,
America/Chicago, America/Denver, America/Los_Angeles,
Asia/Tokyo, Asia/Shanghai, Asia/Kolkata, Australia/Sydney
```

---

## 🔄 Comparaisons

```js
const dt1 = DateTime.fromISO('2024-01-15');
const dt2 = DateTime.fromISO('2024-06-15');

dt1 < dt2          // true  (comparaison directe avec opérateurs)
dt1 > dt2          // false
dt1 <= dt2         // true
dt1.valueOf() === dt2.valueOf()  // false (égalité stricte via timestamp)

dt1.equals(dt2)    // false (méthode Luxon)

// Vérifications
dt1.hasSame(dt2, 'year')   // true  (même année)
dt1.hasSame(dt2, 'month')  // false (mois différents)

// Vérifier si une date est dans un intervalle
dt1.startOf('month') <= dt && dt <= dt1.endOf('month')
```

---

## ⏱️ Duration

### Création

```js
Duration.fromObject({ years: 1, months: 2, days: 3 })
Duration.fromObject({ hours: 5, minutes: 30, seconds: 45 })
Duration.fromMillis(86400000)          // 1 jour en ms
Duration.fromISO('P1Y2M3DT4H5M6S')    // Format ISO 8601
```

### Différence entre deux dates (`.diff()`)

```js
const debut = DateTime.fromISO('2024-01-01');
const fin   = DateTime.fromISO('2024-06-15');

// Différence dans une unité
debut.diff(fin, 'days').days          // -166 (négatif : fin > debut)
fin.diff(debut, 'days').days          // 166

// Plusieurs unités
fin.diff(debut, ['months', 'days'])
// Duration { months: 5, days: 14 }

fin.diff(debut, ['years', 'months', 'days'])
// Duration { years: 0, months: 5, days: 14 }

// En millisecondes
fin.diff(debut).milliseconds
fin.diff(debut).as('days')            // Convertit tout en jours (décimal)
fin.diff(debut).as('hours')           // En heures
fin.diff(debut).as('seconds')         // En secondes
```

### Manipulation de Duration

```js
const dur = Duration.fromObject({ hours: 2, minutes: 90 });

dur.as('minutes')                   // 210
dur.toMillis()                      // 12600000
dur.normalize()                     // { hours: 3, minutes: 30 }
dur.shiftTo('hours', 'minutes')     // { hours: 3, minutes: 30 }
dur.shiftTo('minutes')              // { minutes: 210 }
dur.shiftTo('seconds')              // { seconds: 12600 }

dur.plus({ hours: 1 })
dur.minus({ minutes: 30 })
dur.negate()                        // Inverse le signe
dur.mapUnits(x => x * 2)            // Multiplie chaque unité par 2

dur.toISO()                         // 'PT2H90M'
dur.toHuman()                       // '2 heures et 90 minutes' (selon locale)
dur.toHuman({ locale: 'fr' })       // Version française
```

### Unités disponibles

`years`, `quarters`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`

---

## 📐 Interval

### Création

```js
const debut = DateTime.fromISO('2024-01-01');
const fin   = DateTime.fromISO('2024-12-31');

Interval.fromDateTimes(debut, fin)
Interval.after(debut, { months: 6 })         // 6 mois après debut
Interval.before(fin, Duration.fromObject({ months: 6 }))  // 6 mois avant fin
Interval.fromISO('2024-01-01/2024-12-31')
```

### Méthodes Interval

```js
const interval = Interval.fromDateTimes(debut, fin);

interval.start              // DateTime de début
interval.end                // DateTime de fin
interval.length('days')     // Durée en jours
interval.length('hours')    // Durée en heures
interval.toDuration('days') // Duration correspondante

interval.contains(DateTime.fromISO('2024-06-15'))   // true
interval.overlaps(autreInterval)   // true/false
interval.engulfs(autreInterval)    // true si contient entièrement
interval.isEmpty()                 // true/false
interval.isAfter(dt)               // true/false
interval.isBefore(dt)              // true/false

interval.intersection(autreInterval)  // Interval commun ou null
interval.union(autreInterval)         // Interval englobant les deux
interval.difference(autreInterval)    // Tableau d'Intervals restants

interval.splitBy({ days: 7 })     // Découpe en semaines → [Interval, ...]
interval.splitBy({ months: 1 })   // Découpe en mois

interval.toISO()              // '2024-01-01T00:00:00.000Z/2024-12-31T00:00:00.000Z'
interval.toISODate()          // '2024-01-01/2024-12-31'
interval.toString()           // Représentation lisible
```

---

## ℹ️ Info (informations statiques)

```js
Info.months()                      // ['January', 'February', ...]
Info.months('long', { locale: 'fr' })    // ['janvier', 'février', ...]
Info.months('short', { locale: 'fr' })   // ['janv.', 'févr.', ...]
Info.months('narrow', { locale: 'fr' })  // ['J', 'F', 'M', ...]

Info.weekdays()                     // ['Monday', 'Tuesday', ...]
Info.weekdays('long', { locale: 'fr' })  // ['lundi', 'mardi', ...]
Info.weekdays('short', { locale: 'fr' }) // ['lun.', 'mar.', ...]

Info.eras('short')                  // ['BC', 'AD']
Info.meridiems({ locale: 'fr' })    // ['AM', 'PM']
Info.features()                     // { relative, localeWeek, ... }

Info.hasDST('Europe/Paris')         // true (heure d'été)
Info.isValidIANAZone('Europe/Paris')// true
Info.normalizeZone('UTC')           // FixedOffsetZone
```

---

## 🌐 Localisation

```js
// Changer la locale d'un DateTime
dt.setLocale('fr')
dt.setLocale('en-US')
dt.setLocale('de')

// Chaînage
DateTime.now().setLocale('fr').toFormat('EEEE dd MMMM yyyy')
// 'lundi 15 janvier 2024'

// Locale par défaut globale (Settings)
import { Settings } from 'luxon';
Settings.defaultLocale = 'fr';
Settings.defaultZone = 'Europe/Paris';
Settings.defaultWeekSettings = { firstDay: 1, minimalDays: 4, weekend: [6, 7] };
```

---

## ⚙️ Settings (configuration globale)

```js
import { Settings } from 'luxon';

Settings.defaultLocale           // Lecture de la locale par défaut
Settings.defaultLocale = 'fr'   // Écriture

Settings.defaultZone             // Zone par défaut
Settings.defaultZone = 'Europe/Paris'
Settings.defaultZone = 'UTC'

Settings.now()                   // Timestamp actuel (permet le mock)
Settings.now = () => 1705312200000  // Mock du temps (tests !)

Settings.throwOnInvalid          // false par défaut
Settings.throwOnInvalid = true   // Lève une exception si date invalide
```

---

## ✅ Validation

```js
const dt = DateTime.fromISO('not-a-date');

dt.isValid          // false
dt.invalidReason    // 'unparsable'
dt.invalidExplanation  // Message détaillé

// Tester avant d'utiliser
if (!dt.isValid) {
  console.error(dt.invalidReason);
}

// Mode strict (lève une exception)
Settings.throwOnInvalid = true;
// → DateTime.fromISO('invalid') lance une Error
```

---

## 🔁 Patterns courants

### Début et fin de la journée actuelle

```js
const debutJour = DateTime.now().startOf('day');
const finJour   = DateTime.now().endOf('day');
```

### Vérifier si une date est aujourd'hui

```js
const isToday = (dt) => dt.hasSame(DateTime.now(), 'day');
```

### Nombre de jours entre deux dates

```js
const jours = fin.diff(debut, 'days').days;
```

### Ajouter des jours ouvrables (exemple simplifié)

```js
function addWorkdays(dt, n) {
  let count = 0;
  let current = dt;
  while (count < n) {
    current = current.plus({ days: 1 });
    if (current.weekday <= 5) count++;  // 1=lun ... 5=ven
  }
  return current;
}
```

### Convertir timestamp → date lisible

```js
DateTime.fromMillis(1705312200000)
  .setLocale('fr')
  .toLocaleString(DateTime.DATETIME_FULL);
// 'lundi 15 janvier 2024 à 10:30 UTC+2'
```

### Obtenir tous les jours d'un mois

```js
const debut = DateTime.fromObject({ year: 2024, month: 1 }).startOf('month');
const fin   = debut.endOf('month');
const interval = Interval.fromDateTimes(debut, fin.plus({ days: 1 }));
const jours = interval.splitBy({ days: 1 }).map(i => i.start);
```

### Parser un format ambigu

```js
DateTime.fromFormat('01/02/2024', 'dd/MM/yyyy')  // 1er février
DateTime.fromFormat('01/02/2024', 'MM/dd/yyyy')  // 2 janvier
```

### Relative time (temps relatif)

```js
const dt = DateTime.now().minus({ hours: 3 });
dt.toRelative()                       // 'il y a 3 heures' (si locale fr)
dt.toRelative({ locale: 'fr' })       // 'il y a 3 heures'
dt.toRelative({ base: DateTime.now() }) // Relative à une autre date
dt.toRelativeCalendar()               // 'aujourd'hui', 'hier', 'demain'
dt.toRelativeCalendar({ locale: 'fr' })
```

---

## ⚠️ Pièges courants

| Piège | ❌ Mauvais | ✅ Correct |
|-------|-----------|----------|
| Mois base-0 | `month: 0` pour janvier | `month: 1` pour janvier |
| Immutabilité | `dt.plus({days:1})` sans stocker | `dt = dt.plus({days:1})` |
| Comparaison | `dt1 === dt2` | `dt1.equals(dt2)` ou `dt1.valueOf() === dt2.valueOf()` |
| Timezone | Ignorer la zone | Toujours spécifier la zone si critique |
| Format | Deviner le token | Consulter les tokens ci-dessus |
| `diff()` ordre | `debut.diff(fin)` → négatif | `fin.diff(debut)` → positif |
| `normalize()` | `{ hours: 1, minutes: 90 }` | `.normalize()` → `{ hours: 2, minutes: 30 }` |

---

## 📋 Résumé rapide — Méthodes clés

| Méthode | Description |
|---------|-------------|
| `DateTime.now()` | Date actuelle |
| `DateTime.fromISO(str)` | Depuis ISO 8601 |
| `DateTime.fromFormat(str, fmt)` | Depuis format custom |
| `DateTime.fromMillis(ms)` | Depuis timestamp ms |
| `DateTime.fromObject(obj)` | Depuis objet |
| `.toISO()` | Vers ISO 8601 |
| `.toFormat(fmt)` | Vers format custom |
| `.toLocaleString(preset)` | Vers format localisé |
| `.toMillis()` | Vers timestamp ms |
| `.plus(obj)` | Ajouter une durée |
| `.minus(obj)` | Soustraire une durée |
| `.set(obj)` | Modifier des champs |
| `.startOf(unit)` | Début d'une unité |
| `.endOf(unit)` | Fin d'une unité |
| `.diff(other, units)` | Différence → Duration |
| `.setZone(zone)` | Changer de timezone |
| `.setLocale(locale)` | Changer la locale |
| `.isValid` | Validité de la date |
| `.hasSame(other, unit)` | Même valeur sur une unité |
| `.toRelative()` | Temps relatif ("il y a X") |

---

*Luxon v3.x — Documentation officielle : https://moment.github.io/luxon/*
