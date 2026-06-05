# PapaParse - Conversion CSV → JSON

## Table des Matières
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Concepts Fondamentaux](#concepts-fondamentaux)
4. [Conversion CSV → JSON](#conversion-csv--json)
5. [Configuration](#configuration)
6. [Résultats](#résultats)
7. [Exemples Pratiques](#exemples-pratiques)
8. [Cas d'Utilisation Avancés](#cas-dutilisation-avancés)

---

## Introduction

**PapaParse** est une bibliothèque JavaScript ultra-performante pour parser des fichiers CSV. Elle est capable de traiter des fichiers gigantesques sans crash du navigateur grâce à:
- Support multi-thread (Web Workers)
- Streaming des données
- Détection automatique des délimiteurs
- Gestion gracieuse des erreurs

Pour la conversion **CSV → JSON**, PapaParse offre plusieurs méthodes selon votre cas d'utilisation.

---

## Installation

### NPM
```bash
npm install papaparse
```

### Bower
```bash
bower install papaparse
```

### Import/Utilisation

**ES6/TypeScript:**
```typescript
import Papa from 'papaparse';

// Utilisation
const results = Papa.parse(csvString);
```

**CommonJS:**
```javascript
const Papa = require('papaparse');
```

**HTML (CDN):**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/papaparse/5.4.1/papaparse.min.js"></script>
```

---

## Concepts Fondamentaux

### Structure du Résultat de Parse

Chaque appel à `Papa.parse()` retourne (ou fournit via callback) un objet avec cette structure:

```typescript
{
  data: [],        // Array - données parsées
  errors: [],      // Array - erreurs rencontrées
  meta: {          // Object - métadonnées
    delimiter: ",",
    linebreak: "\r\n",
    aborted: false,
    fields: []
  }
}
```

### Types de Données d'Entrée

**Pour CSV → JSON, vous pouvez parser:**
1. **Strings** - Une chaîne CSV
2. **Files** - Un fichier local via FileReader
3. **URLs** - Un fichier distant via téléchargement

---

## Conversion CSV → JSON

### 1️⃣ Parser une String CSV

#### Signature
```typescript
Papa.parse(csvString: string, config?: object): ParseResult
```

#### Exemple Simple
```typescript
import Papa from 'papaparse';

const csvString = `name,age,city
Alice,30,Paris
Bob,25,Lyon
Charlie,35,Marseille`;

const results = Papa.parse(csvString);

console.log(results.data);
// [
//   ["name", "age", "city"],
//   ["Alice", "30", "Paris"],
//   ["Bob", "25", "Lyon"],
//   ["Charlie", "35", "Marseille"]
// ]
```

#### Avec Headers (Objet JSON)
```typescript
const csvString = `name,age,city
Alice,30,Paris
Bob,25,Lyon`;

const results = Papa.parse(csvString, {
  header: true  // ✅ Transforme en objet avec clés
});

console.log(results.data);
// [
//   { name: "Alice", age: "30", city: "Paris" },
//   { name: "Bob", age: "25", city: "Lyon" }
// ]
```

---

### 2️⃣ Parser un Fichier Local

#### Signature
```typescript
Papa.parse(file: File, config: object & { complete: callback }): void
```

#### Exemple
```typescript
// Supposons un input file HTML
const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  Papa.parse(file, {
    header: true,
    complete: function(results) {
      console.log("Parsing terminé:", results.data);
      console.log("Erreurs:", results.errors);
    },
    error: function(error) {
      console.error("Erreur:", error);
    }
  });
});
```

#### Pour les Grands Fichiers (Streaming)
```typescript
Papa.parse(file, {
  header: true,
  step: function(row, parser) {
    // Appelé pour chaque ligne
    console.log("Ligne:", row.data);
    
    // Optionnel: arrêter le parsing
    // parser.abort();
  },
  complete: function() {
    console.log("Tous les fichiers sont traités");
  }
});
```

---

### 3️⃣ Parser un Fichier Distant (URL)

#### Signature
```typescript
Papa.parse(url: string, config: object & { download: true, complete: callback }): void
```

#### Exemple Simple
```typescript
Papa.parse("https://example.com/data.csv", {
  download: true,
  header: true,
  complete: function(results) {
    console.log("Données téléchargées:", results.data);
  }
});
```

#### Avec Authentification
```typescript
Papa.parse("https://api.example.com/data.csv", {
  download: true,
  header: true,
  downloadRequestHeaders: {
    'Authorization': 'Bearer token123456789'
  },
  complete: function(results) {
    console.log("Données téléchargées avec authentification:", results.data);
  }
});
```

#### Avec POST Request
```typescript
Papa.parse("https://example.com/api/export", {
  download: true,
  downloadRequestBody: JSON.stringify({ format: 'csv' }),
  header: true,
  complete: function(results) {
    console.log("Résultat POST:", results.data);
  }
});
```

---

## Configuration

### Objet Config Complet Avec Tous les Options

```typescript
{
  // Délimiteurs
  delimiter: "",                    // "" = auto-détection
  newline: "",                      // "" = auto-détection
  quoteChar: '"',
  escapeChar: '"',
  
  // Headers & Transformation
  header: false,                    // true = première ligne comme clés
  transformHeader: undefined,       // Fonction(header) => transformé
  
  // Types de Données
  dynamicTyping: false,             // true = convertit nombres/booléens
  
  // Contrôle du Parsing
  preview: 0,                       // 0 = tout, N = parser N lignes
  encoding: "",                     // Encodage du fichier
  skipFirstNLines: 0,               // Saute N premières lignes
  skipEmptyLines: false,            // true = ignore lignes vides
  
  // Performance
  worker: false,                    // true = utilise Web Worker
  fastMode: undefined,              // true = mode rapide (sans guillemets)
  
  // Streaming
  step: undefined,                  // callback(results, parser) par ligne
  chunk: undefined,                 // callback(results, parser) par chunk
  chunkSize: undefined,             // Taille du chunk en bytes
  beforeFirstChunk: undefined,      // callback avant 1er chunk
  
  // Callbacks
  complete: undefined,              // callback quand terminé
  error: undefined,                 // callback en cas d'erreur
  
  // Téléchargement Distant
  download: false,                  // true = télécharger depuis URL
  downloadRequestHeaders: {},       // Headers HTTP personnalisés
  downloadRequestBody: undefined,   // Body pour POST request
  withCredentials: false,           // CORS credentials
  
  // Transformation
  transform: undefined,             // callback(value, columnIndex/name) => transformé
  
  // Délimiteurs à Deviner
  delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
  
  // Commentaires
  comments: false                   // "#" ou "//" = ligne commentée
}
```

### Options Détaillées

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `header` | Boolean | `false` | Si `true`, première ligne = clés JSON |
| `dynamicTyping` | Boolean \| Object \| Function | `false` | Convertit nombres/booléens au lieu de strings |
| `delimiter` | String \| Function | `""` (auto) | Caractère séparateur (`,`, `;`, `\t`, etc.) |
| `newline` | String | `""` (auto) | Séquence de fin de ligne (`\n`, `\r\n`, `\r`) |
| `quoteChar` | String | `"` | Caractère de guillemet |
| `escapeChar` | String | `"` | Caractère d'échappement |
| `worker` | Boolean | `false` | Utilise Web Worker (page reste réactive) |
| `step` | Function | - | Callback appelée pour **chaque ligne** |
| `chunk` | Function | - | Callback appelée pour **chaque chunk** |
| `complete` | Function | - | Callback quand parsing terminé |
| `error` | Function | - | Callback en cas d'erreur |
| `preview` | Number | `0` | Parser uniquement N lignes |
| `skipEmptyLines` | Boolean \| "greedy" | `false` | Ignorer lignes vides |
| `comments` | String \| Boolean | `false` | Sauter lignes commençant par ce caractère |
| `transformHeader` | Function | - | Transformer chaque header: `fn(header, index)` |
| `transform` | Function | - | Transformer chaque valeur: `fn(value, columnIndex)` |
| `download` | Boolean | `false` | Télécharger depuis une URL |
| `encoding` | String | `""` | Encodage du fichier (ex: `"UTF-8"`) |

---

## Résultats

### Objet `data` - Données Parsées

#### Avec `header: false` (Array de Arrays)
```typescript
[
  ["Column 1", "Column 2", "Column 3"],
  ["foo", "bar", "baz"],
  ["abc", "def", "ghi"]
]
```

#### Avec `header: true` (Array d'Objets)
```typescript
[
  {
    "Column 1": "foo",
    "Column 2": "bar",
    "Column 3": "baz"
  },
  {
    "Column 1": "abc",
    "Column 2": "def",
    "Column 3": "ghi"
  }
]
```

### Objet `errors` - Erreurs Rencontrées

```typescript
[
  {
    type: "FieldMismatch",
    code: "TooManyFields",
    message: "Expected 3 fields, but parsed 4",
    row: 5
  },
  {
    type: "InvalidEnclosure",
    code: "MissingQuotes",
    message: "Missing quotes around field",
    row: 10
  }
]
```

#### Codes d'Erreur Courants
- `TooManyFields` - Plus de colonnes que le header
- `TooFewFields` - Moins de colonnes que le header
- `MissingQuotes` - Guillemets manquants
- `InvalidEnclosure` - Guillemet mal fermé
- `RelativeURLNotAllowed` - URL relative dans config download

### Objet `meta` - Métadonnées

```typescript
{
  delimiter: ",",                // Délimiteur détecté/utilisé
  linebreak: "\r\n",            // Séquence de saut de ligne
  aborted: false,               // Parsing interrompu?
  fields: ["col1", "col2"],     // Headers (si header: true)
  truncated: false,             // Truncation due to preview
  cursor: 1234,                 // Position dans fichier (bytes)
  renamedHeaders: []            // Headers renommés (doublons)
}
```

---

## Exemples Pratiques

### Exemple 1: CSV Simple → JSON avec Headers

```typescript
import Papa from 'papaparse';

const csvString = `id,name,email,role
1,Alice,alice@example.com,Admin
2,Bob,bob@example.com,User
3,Charlie,charlie@example.com,User`;

const results = Papa.parse(csvString, {
  header: true,
  dynamicTyping: true  // "1" → 1, "true" → true
});

console.log(results.data);
// [
//   { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
//   { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
//   { id: 3, name: "Charlie", email: "charlie@example.com", role: "User" }
// ]
```

### Exemple 2: Upload Fichier Depuis Input HTML

```html
<input type="file" id="csvFile" accept=".csv" />
<button id="parseBtn">Analyser CSV</button>
<div id="results"></div>
```

```typescript
import Papa from 'papaparse';

document.getElementById('parseBtn').addEventListener('click', () => {
  const file = document.getElementById('csvFile').files[0];
  
  if (!file) {
    alert('Sélectionnez un fichier CSV');
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      if (results.errors.length > 0) {
        console.error("Erreurs de parsing:", results.errors);
      }
      
      console.log(`✅ ${results.data.length} lignes parsées`);
      console.log(results.data);
      
      // Afficher les données dans le DOM
      document.getElementById('results').innerHTML = 
        JSON.stringify(results.data, null, 2);
    }
  });
});
```

### Exemple 3: Streaming d'un Grand Fichier

```typescript
import Papa from 'papaparse';

const file = document.getElementById('csvFile').files[0];
let lineCount = 0;

Papa.parse(file, {
  header: true,
  step: function(row, parser) {
    lineCount++;
    
    // Traiter chaque ligne
    console.log(`Ligne ${lineCount}:`, row.data);
    
    // Exemple: arrêter après 100 lignes
    if (lineCount >= 100) {
      parser.abort(); // ⛔ Stop le parsing
    }
  },
  complete: function() {
    console.log(`✅ Parsing terminé. Total lignes: ${lineCount}`);
  },
  error: function(error) {
    console.error("❌ Erreur:", error);
  }
});
```

### Exemple 4: Transformer les Données Pendant le Parsing

```typescript
import Papa from 'papaparse';

const csvString = `firstName,lastName,salary
Alice,Johnson,50000
Bob,Smith,60000`;

const results = Papa.parse(csvString, {
  header: true,
  dynamicTyping: true,
  transformHeader: function(h) {
    // Transformer headers en camelCase
    return h.replace(/[-_\s](.)/g, (_, c) => c.toUpperCase());
  },
  transform: function(value, field) {
    // Transformer valeurs spécifiques
    if (field === 'salary' && value) {
      return `$${parseInt(value).toLocaleString()}`;
    }
    return value;
  }
});

console.log(results.data);
// [
//   { firstName: "Alice", lastName: "Johnson", salary: "$50,000" },
//   { firstName: "Bob", lastName: "Smith", salary: "$60,000" }
// ]
```

### Exemple 5: Détection Automatique de Délimiteur

```typescript
import Papa from 'papaparse';

// Fichier utilisant TAB comme délimiteur
const tsvString = `name\tage\tcity
Alice\t30\tParis
Bob\t25\tLyon`;

// Pas besoin de spécifier le délimiteur!
const results = Papa.parse(tsvString, {
  header: true
});

console.log("Délimiteur détecté:", results.meta.delimiter); // "\t"
console.log(results.data);
// [
//   { name: "Alice", age: "30", city: "Paris" },
//   { name: "Bob", age: "25", city: "Lyon" }
// ]
```

### Exemple 6: Preview (Parser que les N premières lignes)

```typescript
import Papa from 'papaparse';

const csvString = `id,name,status
1,Alice,active
2,Bob,inactive
3,Charlie,active
4,David,inactive
5,Eve,active`;

const results = Papa.parse(csvString, {
  header: true,
  preview: 2  // Parser que les 2 premières lignes
});

console.log(results.data);
// [
//   { id: "1", name: "Alice", status: "active" },
//   { id: "2", name: "Bob", status: "inactive" }
// ]
```

### Exemple 7: Sauter Lignes Vides et Commentaires

```typescript
import Papa from 'papaparse';

const csvString = `# Ceci est un commentaire
id,name,email

1,Alice,alice@example.com

# Autre commentaire
2,Bob,bob@example.com`;

const results = Papa.parse(csvString, {
  header: true,
  comments: '#',           // Ignorer lignes commençant par #
  skipEmptyLines: true     // Ignorer lignes vides
});

console.log(results.data);
// [
//   { id: "1", name: "Alice", email: "alice@example.com" },
//   { id: "2", name: "Bob", email: "bob@example.com" }
// ]
```

### Exemple 8: Télécharger et Parser un Fichier Distant

```typescript
import Papa from 'papaparse';

Papa.parse("https://example.com/data.csv", {
  download: true,
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  complete: function(results) {
    console.log(`✅ ${results.data.length} lignes téléchargées et parsées`);
    console.log(results.data);
  },
  error: function(error) {
    console.error("❌ Erreur de téléchargement:", error.message);
  }
});
```

### Exemple 9: Conversion Avec Type Dynamique

```typescript
import Papa from 'papaparse';

const csvString = `product,price,inStock,releaseDate
Laptop,1299.99,true,2024-01-15
Phone,799.99,false,2024-02-20
Tablet,499.99,true,2024-03-10`;

// SANS dynamicTyping
const withoutTyping = Papa.parse(csvString, { header: true });
console.log(typeof withoutTyping.data[0].price); // "string"

// AVEC dynamicTyping
const withTyping = Papa.parse(csvString, {
  header: true,
  dynamicTyping: true
});
console.log(typeof withTyping.data[0].price); // "number"
console.log(typeof withTyping.data[0].inStock); // "boolean"
```

---

## Cas d'Utilisation Avancés

### Utiliser Web Worker pour Éviter le Blocage UI

```typescript
import Papa from 'papaparse';

const file = document.getElementById('csvFile').files[0];

Papa.parse(file, {
  header: true,
  worker: true,  // ✨ Utilise Web Worker
  step: function(row) {
    // La page reste réactive pendant le parsing!
    updateUI(row.data);
  },
  complete: function() {
    console.log("✅ Parsing terminé (page restée réactive)");
  }
});
```

### Parsing Avec Erreurs Tolérées

```typescript
import Papa from 'papaparse';

const results = Papa.parse(csvString, {
  header: true
});

// Vérifier les erreurs
if (results.errors.length > 0) {
  console.warn(`⚠️  ${results.errors.length} erreur(s) rencontrée(s):`);
  results.errors.forEach(err => {
    console.warn(`  Ligne ${err.row}: ${err.message}`);
  });
}

// Les données sont toujours disponibles même s'il y a des erreurs
console.log("Données valides:", results.data);
```

### Filtrer Colonnes Spécifiques

```typescript
import Papa from 'papaparse';

const csvString = `id,name,email,password,createdAt
1,Alice,alice@example.com,secret123,2024-01-01
2,Bob,bob@example.com,pass456,2024-01-02`;

const results = Papa.parse(csvString, {
  header: true,
  transform: function(value, field) {
    // Exclure les colonnes sensibles
    if (field === 'password') {
      return undefined; // Supprime la colonne
    }
    return value;
  }
});

console.log(results.data);
// [
//   { id: "1", name: "Alice", email: "alice@example.com", createdAt: "2024-01-01" },
//   { id: "2", name: "Bob", email: "bob@example.com", createdAt: "2024-01-02" }
// ]
```

### Regex sur Délimiteur

```typescript
import Papa from 'papaparse';

const csvString = `name|age|city
Alice|30|Paris
Bob|25|Lyon`;

const results = Papa.parse(csvString, {
  header: true,
  delimiter: '|'
});

console.log(results.data);
```

### Parser CSV Avec Guillemets et Échappement

```typescript
import Papa from 'papaparse';

const csvString = `name,description,notes
"Alice","Engineer, Paris","Uses ""double quotes"""
"Bob","Designer","No special chars"`;

const results = Papa.parse(csvString, {
  header: true,
  quoteChar: '"',
  escapeChar: '"'
});

console.log(results.data);
// [
//   { 
//     name: "Alice", 
//     description: "Engineer, Paris", 
//     notes: 'Uses "double quotes"'
//   },
//   { 
//     name: "Bob", 
//     description: "Designer", 
//     notes: "No special chars"
//   }
// ]
```

---

## Résumé des Principales Fonctions

| Fonction | Usage | Retour |
|----------|-------|--------|
| `Papa.parse(csvString, config)` | Parser une string CSV | ParseResult (synchrone) |
| `Papa.parse(file, config)` | Parser un fichier local | Via callback (asynchrone) |
| `Papa.parse(url, {download: true, ...})` | Parser URL distante | Via callback (asynchrone) |
| `Papa.unparse(data, config)` | JSON → CSV | String CSV |

---

## Notes Importantes

✅ **À Faire:**
- Utiliser `header: true` pour convertir en objets JSON
- Utiliser `dynamicTyping: true` pour convertir types
- Utiliser `worker: true` pour grands fichiers
- Vérifier `results.errors` après parsing
- Utiliser `skipEmptyLines: true` pour nettoyer les données

❌ **À Éviter:**
- Parser sans callback pour fichiers distants/locaux
- Ignorer les erreurs retournées
- Parser sans `header: true` si vous voulez du JSON objet
- Charger énormes fichiers sans streaming

---

## Ressources

- 📖 [Documentation Officielle](https://www.papaparse.com/docs)
- 🐙 [GitHub](https://github.com/mholt/PapaParse)
- 📦 [NPM Package](https://www.npmjs.com/package/papaparse)
- 🔗 [Demo Interactive](https://www.papaparse.com/)
