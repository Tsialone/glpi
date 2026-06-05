# Fast XML Parser - Guide Complet

## Table des Matières
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Utilisation de Base](#utilisation-de-base)
4. [Analyse XML vers JSON](#analyse-xml-vers-json)
5. [Création JSON vers XML](#création-json-vers-xml)
6. [Validation XML](#validation-xml)
7. [Options de Parsing](#options-de-parsing)
8. [Gestion des Attributs](#gestion-des-attributs)
9. [Gestion des Espaces de Noms](#gestion-des-espaces-de-noms)
10. [Gestion des Erreurs](#gestion-des-erreurs)
11. [Performance et Optimisation](#performance-et-optimisation)
12. [Cas d'Usage Pratiques](#cas-dusage-pratiques)
13. [Intégration React](#intégration-react)
14. [Comparaison avec Alternatives](#comparaison-avec-alternatives)
15. [Bonnes Pratiques](#bonnes-pratiques)

---

## Introduction

**fast-xml-parser** est une bibliothèque JavaScript haute performance pour :
- 📄 Analyser (parser) du XML en JSON
- 🔄 Convertir du JSON en XML
- ✅ Valider la structure XML
- ⚡ Traiter les gros fichiers XML rapidement

### Avantages
✅ **Très rapide** - Optimisé pour la performance  
✅ **Léger** - Bundle minimal (~50KB)  
✅ **Flexible** - Nombreuses options de configuration  
✅ **Complet** - Support des attributs, namespaces, CDATA  
✅ **Robuste** - Validation d'erreurs intégrée  
✅ **Multi-environnement** - Node.js et navigateur  
✅ **Moderne** - Support TypeScript  

### Cas d'Usage
- 📊 Parsing de fichiers CSV convertis en XML
- 🗂️ Traitement de réponses API XML (SOAP, RSS, etc.)
- 📝 Conversion de configurations XML
- 📦 Manipulation de données structurées
- 🔄 Synchronisation entre formats XML et JSON

---

## Installation

### Via NPM
```bash
npm install fast-xml-parser
```

### Via Yarn
```bash
yarn add fast-xml-parser
```

### Via PNPM
```bash
pnpm add fast-xml-parser
```

### Vérification de l'Installation
```typescript
import { XMLParser } from 'fast-xml-parser';
console.log('Fast XML Parser installé ✅');
```

---

## Utilisation de Base

### Import
```typescript
// CommonJS
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

// ES Modules
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
```

### Parser Simple
```typescript
import { XMLParser } from 'fast-xml-parser';

const xmlString = `
  <root>
    <user>
      <name>John Doe</name>
      <email>john@example.com</email>
    </user>
  </root>
`;

const parser = new XMLParser();
const jsonResult = parser.parse(xmlString);

console.log(jsonResult);
// Résultat:
// {
//   root: {
//     user: {
//       name: 'John Doe',
//       email: 'john@example.com'
//     }
//   }
// }
```

### Builder Simple
```typescript
import { XMLBuilder } from 'fast-xml-parser';

const jsonData = {
  root: {
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
};

const builder = new XMLBuilder();
const xmlString = builder.build(jsonData);

console.log(xmlString);
// Résultat:
// <?xml version="1.0" encoding="UTF-8"?>
// <root>
//   <user>
//     <name>John Doe</name>
//     <email>john@example.com</email>
//   </user>
// </root>
```

---

## Analyse XML vers JSON

### Parsing Basique
```typescript
import { XMLParser } from 'fast-xml-parser';

const xml = `
  <company>
    <name>Tech Corp</name>
    <employees>
      <employee>
        <id>1</id>
        <name>Alice</name>
      </employee>
      <employee>
        <id>2</id>
        <name>Bob</name>
      </employee>
    </employees>
  </company>
`;

const parser = new XMLParser();
const json = parser.parse(xml);

console.log(json.company.employees.employee);
// [
//   { id: '1', name: 'Alice' },
//   { id: '2', name: 'Bob' }
// ]
```

### Parsing avec Options
```typescript
const parser = new XMLParser({
  ignoreAttributes: false,      // Inclure les attributs
  parseAttributeValue: true,    // Convertir types des attributs
  parseTagValue: true,          // Convertir types des valeurs
  parseDecimalAsString: false,  // Décimales comme nombres
  textNodeName: '#text',        // Nom pour les textes
  attributeNamePrefix: '@_'     // Préfixe pour attributs
});

const json = parser.parse(xml);
```

### Parsing Conditionnel
```typescript
const parser = new XMLParser({
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    // Forcer array pour certains éléments
    if (name === 'item' || name === 'product') return true;
    if (jpath.includes('.items')) return true;
    return false;
  }
});
```

---

## Création JSON vers XML

### Builder Simple
```typescript
import { XMLBuilder } from 'fast-xml-parser';

const data = {
  note: {
    to: 'Alice',
    from: 'Bob',
    heading: 'Reminder',
    body: 'Don\'t forget!'
  }
};

const builder = new XMLBuilder();
const xml = builder.build(data);
console.log(xml);
```

### Builder avec Options
```typescript
const builder = new XMLBuilder({
  attributeNamePrefix: '@_',           // Préfixe pour attributs
  textNodeName: '#text',               // Nom pour les textes
  ignoreAttributes: false,             // Inclure les attributs
  cdataTagName: false,                 // Pas de CDATA
  cdataPositionChar: '\\\\',           // Position CDATA
  format: true,                        // Formater avec indentation
  indentBy: '  ',                      // Indentation (2 espaces)
  processEntities: true,               // Traiter les entités
  supressEmptyNode: false,             // Garder nœuds vides
  preserveOrder: false                 // Préserver l'ordre
});

const xml = builder.build(data);
console.log(xml);
```

---

## Validation XML

### Validation Basique
```typescript
import { XMLValidator } from 'fast-xml-parser';

const xml = `
  <root>
    <name>John</name>
  </root>
`;

const validation = XMLValidator.validate(xml);
console.log(validation); // true ou objet erreur
```

### Gestion Validation Complète
```typescript
const validation = XMLValidator.validate(xml);

if (validation === true) {
  console.log('✅ XML valide!');
} else {
  console.log('❌ XML invalide');
  console.log('Erreur:', validation.err);
  console.log('Code:', validation.code);
}
```

### Schéma de Validation
```typescript
// Note: fast-xml-parser ne supporte pas XSD natif
// Utilisez une validation personnalisée

const validateSchema = (xml: string) => {
  const parser = new XMLParser();
  const json = parser.parse(xml);
  
  // Vérifications personnalisées
  if (!json.root || !json.root.user) {
    throw new Error('Structure invalide');
  }
  if (!json.root.user.id || !json.root.user.name) {
    throw new Error('Champs requis manquants');
  }
  
  return true;
};
```

---

## Options de Parsing

### Options Principales

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `ignoreAttributes` | boolean | true | Ignorer les attributs |
| `parseAttributeValue` | boolean | false | Convertir types attributs |
| `parseTagValue` | boolean | true | Convertir types valeurs |
| `parseDecimalAsString` | boolean | false | Garder décimales comme string |
| `parseComments` | boolean | false | Parser les commentaires |
| `textNodeName` | string | '#text' | Nom du nœud texte |
| `attributeNamePrefix` | string | '@_' | Préfixe des attributs |
| `removeNSPrefix` | boolean | false | Enlever préfixe namespace |
| `allowBooleanAttributes` | boolean | false | Permettre attributs booléens |
| `parseAttributeValue` | boolean | false | Parser valeurs attributs |
| `formatXml` | boolean | false | Formater sortie |
| `indentBy` | string | '' | Indentation XML |

### Exemple Complet
```typescript
const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  parseTagValue: true,
  parseDecimalAsString: false,
  parseComments: true,
  textNodeName: '#text',
  attributeNamePrefix: '@_',
  removeNSPrefix: false,
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  trimValues: true,
  isArray: (name) => ['item', 'product', 'user'].includes(name)
});
```

---

## Gestion des Attributs

### Parser avec Attributs
```typescript
const xml = `
  <user id="1" status="active">
    <name>John</name>
  </user>
`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true
});

const json = parser.parse(xml);
console.log(json);
// {
//   user: {
//     '@_id': 1,
//     '@_status': 'active',
//     name: 'John'
//   }
// }
```

### Créer XML avec Attributs
```typescript
const data = {
  user: {
    '@_id': 1,
    '@_status': 'active',
    '@_role': 'admin',
    name: 'John',
    email: 'john@example.com'
  }
};

const builder = new XMLBuilder({
  attributeNamePrefix: '@_',
  ignoreAttributes: false
});

const xml = builder.build(data);
// <user id="1" status="active" role="admin">
//   <name>John</name>
//   <email>john@example.com</email>
// </user>
```

### Personnaliser Préfixe Attributs
```typescript
// Utiliser ':' comme préfixe
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ':'
});

// Résultat : { user: { ':id': '1', name: 'John' } }
```

---

## Gestion des Espaces de Noms

### Parser avec Namespaces
```typescript
const xml = `
  <root xmlns="http://example.com"
        xmlns:custom="http://custom.com">
    <element>Value 1</element>
    <custom:item>Value 2</custom:item>
  </root>
`;

// Sans enlever préfixe
const parser1 = new XMLParser();
const json1 = parser1.parse(xml);

// Avec enlever préfixe
const parser2 = new XMLParser({
  removeNSPrefix: true
});
const json2 = parser2.parse(xml);
```

### Gérer Namespaces Complexes
```typescript
const xml = `
  <soap:Envelope 
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
      <Response xmlns="http://example.com">
        <Result>OK</Result>
      </Response>
    </soap:Body>
  </soap:Envelope>
`;

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true
});

const json = parser.parse(xml);
```

---

## Gestion des Erreurs

### Try-Catch Basique
```typescript
import { XMLParser } from 'fast-xml-parser';

try {
  const parser = new XMLParser();
  const xml = '<root>Invalid</root'; // XML cassé
  const result = parser.parse(xml);
} catch (error) {
  console.error('Erreur de parsing:', error.message);
}
```

### Validation avant Parsing
```typescript
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const xml = '<root><name>John</name></root>';

// Valider d'abord
const validation = XMLValidator.validate(xml);

if (validation !== true) {
  console.error('XML invalide:', validation);
} else {
  const parser = new XMLParser();
  const json = parser.parse(xml);
  console.log('Parsed:', json);
}
```

### Gestion d'Erreurs Robuste
```typescript
const parseXmlSafely = (xml: string) => {
  try {
    // Vérifier XML valide
    if (!xml || typeof xml !== 'string') {
      throw new Error('XML doit être une string');
    }

    // Valider
    const validation = XMLValidator.validate(xml);
    if (validation !== true) {
      throw new Error(`Validation échouée: ${validation.err}`);
    }

    // Parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true
    });
    
    return {
      success: true,
      data: parser.parse(xml)
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};
```

---

## Performance et Optimisation

### Conseils Performance
```typescript
// 1. Réutiliser instances parser/builder
const parser = new XMLParser();
const builder = new XMLBuilder();

// Bonne pratique
for (let i = 0; i < 1000; i++) {
  const result = parser.parse(xmlArray[i]);
  // ...
}

// ❌ Mauvais - crée 1000 instances
// for (let i = 0; i < 1000; i++) {
//   const p = new XMLParser();
//   const result = p.parse(xmlArray[i]);
// }
```

### Options Optimisées
```typescript
// Parsing rapide (désactiver conversions)
const fastParser = new XMLParser({
  parseTagValue: false,           // Garder valeurs comme strings
  parseAttributeValue: false,     // Garder attributs comme strings
  ignoreAttributes: true,         // Ignorer attributs
  removeNSPrefix: true            // Enlever namespaces
});

// Building rapide
const fastBuilder = new XMLBuilder({
  format: false                   // Pas de formatage
});
```

### Gestion Gros Fichiers
```typescript
import * as fs from 'fs';

// Lire par chunks
const readLargeXml = (filePath: string) => {
  const xml = fs.readFileSync(filePath, 'utf-8');
  
  // Vérifier taille avant parsing
  if (xml.length > 10 * 1024 * 1024) { // 10MB
    console.warn('Fichier XML très volumineux');
  }
  
  const parser = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: false
  });
  
  return parser.parse(xml);
};
```

---

## Cas d'Usage Pratiques

### 1. Parser Réponse API SOAP
```typescript
const soapResponse = `
  <?xml version="1.0"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetUserResponse>
        <User>
          <Id>123</Id>
          <Name>John Doe</Name>
          <Email>john@example.com</Email>
        </User>
      </GetUserResponse>
    </soap:Body>
  </soap:Envelope>
`;

const parser = new XMLParser({
  removeNSPrefix: true
});

const json = parser.parse(soapResponse);
const user = json.Envelope.Body.GetUserResponse.User;
console.log(user);
```

### 2. Parser Flux RSS/Atom
```typescript
const rssXml = `
  <?xml version="1.0"?>
  <rss version="2.0">
    <channel>
      <title>Mon Blog</title>
      <item>
        <title>Article 1</title>
        <link>http://example.com/article1</link>
        <pubDate>Mon, 01 Jan 2024 00:00:00</pubDate>
        <description>Contenu article</description>
      </item>
    </channel>
  </rss>
`;

const parser = new XMLParser();
const feed = parser.parse(rssXml);
const articles = feed.rss.channel.item;

articles.forEach(article => {
  console.log(`${article.title} - ${article.link}`);
});
```

### 3. Convertir CSV en XML
```typescript
import { XMLBuilder } from 'fast-xml-parser';
import Papa from 'papaparse';

const convertCsvToXml = (csvData: string) => {
  // Parser CSV
  const { data } = Papa.parse(csvData, { header: true });
  
  // Préparer données pour XML
  const xmlData = {
    root: {
      record: data
    }
  };
  
  // Convertir en XML
  const builder = new XMLBuilder({
    format: true,
    indentBy: '  '
  });
  
  return builder.build(xmlData);
};

const csv = `name,email,age
John,john@example.com,30
Alice,alice@example.com,25`;

const xml = convertCsvToXml(csv);
console.log(xml);
```

### 4. Configuration Fichier
```typescript
// config.xml
const configXml = `
  <config>
    <database>
      <host>localhost</host>
      <port>5432</port>
      <name>myapp</name>
    </database>
    <server>
      <port>3000</port>
      <env>development</env>
    </server>
  </config>
`;

const parser = new XMLParser({
  parseTagValue: true
});

const config = parser.parse(configXml);
console.log(config.config.database.host);
console.log(config.config.server.port);
```

---

## Intégration React

### Hook Custom
```typescript
// hooks/useXmlParser.ts
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { useMemo, useCallback } from 'react';

export const useXmlParser = () => {
  const parser = useMemo(() => new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true
  }), []);
  
  const builder = useMemo(() => new XMLBuilder({
    format: true,
    indentBy: '  '
  }), []);
  
  const parseXml = useCallback((xml: string) => {
    try {
      const validation = XMLValidator.validate(xml);
      if (validation !== true) {
        throw new Error(validation.err?.toString());
      }
      return { success: true, data: parser.parse(xml) };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur'
      };
    }
  }, [parser]);
  
  const buildXml = useCallback((json: any) => {
    try {
      return { success: true, data: builder.build(json) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur'
      };
    }
  }, [builder]);
  
  return { parseXml, buildXml };
};
```

### Composant React
```typescript
// components/XmlViewer.tsx
import { useXmlParser } from '../hooks/useXmlParser';
import { useState } from 'react';

interface XmlViewerProps {
  xmlContent: string;
  onParse?: (data: any) => void;
}

export const XmlViewer = ({ xmlContent, onParse }: XmlViewerProps) => {
  const { parseXml } = useXmlParser();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  const handleParse = () => {
    const parseResult = parseXml(xmlContent);
    
    if (parseResult.success) {
      setResult(parseResult.data);
      setError('');
      onParse?.(parseResult.data);
    } else {
      setError(parseResult.error);
      setResult(null);
    }
  };
  
  return (
    <div>
      <textarea 
        value={xmlContent} 
        readOnly 
        rows={8}
      />
      <button onClick={handleParse}>Parser XML</button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};
```

### Composant Upload XML
```typescript
// components/XmlUploader.tsx
import { useXmlParser } from '../hooks/useXmlParser';
import { useState } from 'react';

export const XmlUploader = () => {
  const { parseXml } = useXmlParser();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const result = parseXml(text);
      
      if (result.success) {
        setData(result.data);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lecture fichier');
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept=".xml"
        onChange={handleFileUpload}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

---

## Comparaison avec Alternatives

### fast-xml-parser vs Alternatives

| Critère | fast-xml-parser | xml2js | libxmljs | expat |
|---------|-----------------|--------|----------|-------|
| **Taille** | ~50KB | ~60KB | ~2MB | Lourd |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Navigateur** | ✅ | ❌ | ❌ | ❌ |
| **Node.js** | ✅ | ✅ | ✅ | ✅ |
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Build JSON** | ✅ | ✅ | ❌ | ❌ |
| **Validation** | ✅ | ❌ | ✅ | Partiel |
| **TypeScript** | ✅ | ✅ | ✅ | Non |

### Quand Utiliser fast-xml-parser
✅ Parsing XML rapide  
✅ Application web (navigateur + Node)  
✅ Conversion XML ↔ JSON  
✅ Petit à moyen fichiers  
✅ Besoin performance

### Quand Utiliser Autres
- `xml2js` : XML complexe avec schéma
- `libxmljs` : Besoin DOM complet
- `expat` : Très gros fichiers, streaming

---

## Bonnes Pratiques

### 1. Toujours Valider
```typescript
import { XMLValidator } from 'fast-xml-parser';

const validation = XMLValidator.validate(xml);
if (validation !== true) {
  console.error('Erreur:', validation);
  // Gérer l'erreur
}
```

### 2. Utiliser Types TypeScript
```typescript
interface User {
  '@_id': string;
  name: string;
  email: string;
}

interface Company {
  name: string;
  users: {
    user: User | User[];
  };
}

const parser = new XMLParser();
const json = parser.parse(xml) as { company: Company };
```

### 3. Réutiliser Instances
```typescript
// Créer une fois
const parser = new XMLParser();

// Réutiliser
files.forEach(file => {
  const data = parser.parse(file.content);
  // ...
});
```

### 4. Gérer Arrays Correctement
```typescript
const parser = new XMLParser({
  isArray: (name) => {
    // Forcer certains éléments comme array
    return ['item', 'product', 'user', 'record'].includes(name);
  }
});
```

### 5. Formatter pour Production
```typescript
// Développement
const devBuilder = new XMLBuilder({
  format: true,
  indentBy: '  '
});

// Production
const prodBuilder = new XMLBuilder({
  format: false  // Réduit taille
});
```

### 6. Gérer Cas Limites
```typescript
// Empty strings
const parser = new XMLParser({
  parseTagValue: true,
  trimValues: true
});

// Preservers spaces si nécessaire
const spaceParser = new XMLParser({
  trimValues: false
});
```

### 7. Sécurité
```typescript
// ⚠️ Attention : Ne pas parser XML non fiable en production
// Risque XXE (XML External Entity)

// Utiliser options sécurisées
const safeParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  // Ne pas permettre entités externes (par défaut)
});
```

---

## Ressources Supplémentaires

### Documentation Officielle
- [GitHub Repository](https://github.com/NaturalIntelligence/fast-xml-parser)
- [NPM Package](https://npmjs.com/package/fast-xml-parser)

### Exemples Connexes
- Parser CSV : Voir [PAPAPARSE_CSV_TO_JSON.md](PAPAPARSE_CSV_TO_JSON.md)
- Requêtes HTTP : Voir [AXIOS_COMPLETE_GUIDE.md](AXIOS_COMPLETE_GUIDE.md)
- React TypeScript : Voir [react-ts.md](react-ts.md)

### Liens Utiles
- [XML Reference MDN](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)
- [JSON vs XML](https://www.json.org/xml.html)
- [SOAP Web Services](https://www.w3.org/TR/soap/)

---

## Conclusion

**fast-xml-parser** est l'outil parfait pour :
- ✅ Parsing XML rapide en JavaScript
- ✅ Conversion XML ↔ JSON
- ✅ Applications web modernes
- ✅ Petits à moyens fichiers XML

Avec sa API simple et performante, c'est le choix idéal pour la plupart des cas d'usage XML en JavaScript.

---

**Dernière mise à jour:** Mai 2024  
**Version:** Compatible avec fast-xml-parser v4.x+  
**Auteur:** Guide Complet - Community Edition
