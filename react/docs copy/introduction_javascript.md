# Introduction à JavaScript 🚀

## Table des matières
1. [Qu'est-ce que JavaScript ?](#quest-ce-que-javascript)
2. [Historique](#historique)
3. [Caractéristiques principales](#caractéristiques-principales)
4. [Environnements d'exécution](#environnements-dexécution)
5. [Premiers pas](#premiers-pas)
6. [Variables et types de données](#variables-et-types-de-données)
7. [Structures de contrôle](#structures-de-contrôle)
8. [Fonctions](#fonctions)
9. [Travaux Pratiques](#travaux-pratiques-tp)

---

## Qu'est-ce que JavaScript ?

JavaScript est un **langage de programmation interprété** créé pour rendre les pages web interactives. C'est le langage de programmation principal du web, supporté par tous les navigateurs modernes.

### Points clés :
- ✅ Langage **dynamique** et **faiblement typé**
- ✅ Orienté **objet** et **fonctionnel**
- ✅ Exécuté côté **client** (navigateur) et **serveur** (Node.js)
- ✅ Syntaxe proche du **C** et du **Java**

---

## Historique

| Année | Événement |
|-------|-----------|
| 1995 | Création par Brendan Eich pour Netscape Navigator |
| 1997 | Standardisation ECMAScript (ES1) |
| 2009 | Node.js permet JavaScript côté serveur |
| 2015 | ES6 (ES2015) - révolution majeure |
| 2023+ | Mises à jour annuelles continues |

---

## Caractéristiques principales

### 1. **Typage dynamique**
```javascript
let valeur = 42;           // nombre
valeur = "texte";          // chaîne
valeur = true;             // booléen
console.log(typeof valeur); // "boolean"
```

### 2. **Première classe de citoyens : les fonctions**
```javascript
// Les fonctions peuvent être assignées à des variables
const saluer = function() {
  return "Bonjour !";
};
```

### 3. **Asynchrone**
```javascript
// JavaScript gère facilement les opérations asynchrones
setTimeout(() => {
  console.log("Après 2 secondes");
}, 2000);
```

### 4. **Flexibilité et expressivité**
```javascript
// Multiple façons de faire la même chose
const nombres = [1, 2, 3, 4, 5];
const doubles = nombres.map(n => n * 2);
```

---

## Environnements d'exécution

### 🌐 **Navigateur (Client-side)**
- Manipuler le DOM
- Gérer les événements
- Requêtes AJAX/Fetch
- LocalStorage, Cookies

### 🖥️ **Node.js (Server-side)**
- Créer des serveurs web
- Accéder au système de fichiers
- Gérer des bases de données
- Exécuter des scripts CLI

### ⚙️ **Autres environnements**
- Deno (alternative sécurisée à Node.js)
- Bun (runtime ultra-rapide)
- Electron (applications desktop)

---

## Premiers pas

### Où écrire du JavaScript ?

#### 1️⃣ Dans la console du navigateur
```
Ctrl + Shift + K (Chrome, Firefox, Edge)
```

#### 2️⃣ Dans un fichier HTML
```html
<script>
  console.log("Hello World!");
</script>
```

#### 3️⃣ Dans un fichier `.js` externe
```html
<script src="script.js"></script>
```

#### 4️⃣ Avec Node.js
```bash
node mon_script.js
```

### Hello World ! 🌍
```javascript
console.log("Bonjour le monde !");
```

---

## Variables et types de données

### Déclaration de variables

```javascript
// var (ancien, éviter)
var ancienne = "dépassée";

// let (recommandé pour les variables qui changent)
let nom = "Alice";
nom = "Bob"; // OK

// const (recommandé pour les constantes)
const PI = 3.14159;
// PI = 3; // ❌ Erreur !
```

### Types de données primitifs

| Type | Exemple | Description |
|------|---------|-------------|
| `string` | `"Bonjour"`, `'Hello'`, `\`Template\`` | Texte |
| `number` | `42`, `3.14`, `-5` | Nombres (entiers et décimaux) |
| `boolean` | `true`, `false` | Valeur logique |
| `null` | `null` | Absence intentionnelle de valeur |
| `undefined` | `undefined` | Variable déclarée mais non initialisée |
| `symbol` | `Symbol('id')` | Identificateur unique (avancé) |
| `bigint` | `123n` | Très grands nombres entiers |

### Types de données complexes

```javascript
// Objet
const personne = {
  nom: "Alice",
  age: 30,
  saluer: function() {
    console.log("Bonjour, je m'appelle " + this.nom);
  }
};

// Tableau
const couleurs = ["rouge", "vert", "bleu"];
const nombres = [1, 2, 3, 4, 5];

// Fonction
function additionner(a, b) {
  return a + b;
}
```

---

## Structures de contrôle

### Conditionnelles

```javascript
// if...else
const age = 18;

if (age >= 18) {
  console.log("Vous êtes majeur");
} else if (age >= 13) {
  console.log("Vous êtes adolescent");
} else {
  console.log("Vous êtes enfant");
}

// switch
const jour = "lundi";
switch (jour) {
  case "samedi":
  case "dimanche":
    console.log("C'est le week-end !");
    break;
  default:
    console.log("C'est un jour de semaine");
}

// Opérateur ternaire (ternary)
const statut = age >= 18 ? "majeur" : "mineur";
```

### Boucles

```javascript
// Boucle for classique
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Boucle for...of (sur les valeurs)
const fruits = ["pomme", "banane", "orange"];
for (const fruit of fruits) {
  console.log(fruit);
}

// Boucle for...in (sur les clés)
const livre = { titre: "1984", auteur: "Orwell" };
for (const cle in livre) {
  console.log(cle + ": " + livre[cle]);
}

// Boucle while
let compteur = 0;
while (compteur < 5) {
  console.log(compteur);
  compteur++;
}

// Boucle do...while (s'exécute au moins une fois)
do {
  console.log("Au moins une fois");
} while (false);
```

---

## Fonctions

### Déclaration simple

```javascript
function additionner(a, b) {
  return a + b;
}

console.log(additionner(5, 3)); // 8
```

### Fonction fléchée (Arrow function) - ES6

```javascript
// Syntaxe simple
const multiplier = (a, b) => a * b;

// Avec bloc
const afficher = (message) => {
  console.log(message);
  return message.toUpperCase();
};

// Sans paramètres
const saluer = () => "Bonjour !";

// Un seul paramètre
const double = x => x * 2;
```

### Paramètres par défaut

```javascript
function saluter(nom = "Visiteur") {
  console.log("Bonjour, " + nom + " !");
}

saluer();              // "Bonjour, Visiteur !"
saluer("Alice");       // "Bonjour, Alice !"
```

### Paramètres variables (Rest parameters)

```javascript
function somme(...nombres) {
  return nombres.reduce((acc, n) => acc + n, 0);
}

console.log(somme(1, 2, 3, 4, 5)); // 15
```

---

# Travaux Pratiques (TP) 📝

## TP 1 : Les bases - Variables et types (⭐ Facile)

### Exercice 1.1 : Déclarer et afficher des variables
```javascript
// TODO : Créez trois variables :
// 1. Une variable 'nom' contenant votre nom
// 2. Une variable 'age' contenant votre âge
// 3. Une variable 'ville' contenant votre ville
// Puis affichez-les avec console.log()
```

---

### Exercice 1.2 : Manipulation de types
```javascript
// TODO : Complétez le code
// 1. Créez une variable 'prix' = 19.99
// 2. Créez une variable 'quantite' = 3
// 3. Calculez le 'total' (prix × quantité)
// 4. Affichez le résultat
```

---

### Exercice 1.3 : Utiliser les template literals
```javascript
// TODO : Convertissez ce message en utilisant les backticks (`)
// Exemple : const message = `Je m'appelle ${nom} et j'ai ${age} ans`;

const prenom = "Bob";
const profession = "développeur";
const presentation = "Je suis " + prenom + " et je suis " + profession;

// À convertir en template literal...
```

---

## TP 2 : Conditions et logique (⭐⭐ Moyen)

### Exercice 2.1 : Comparaisons simples
```javascript
// TODO : Créez une fonction qui vérifie si une personne est majeure
// Paramètre : age (nombre)
// Retour : true si majeur, false sinon

// Testez avec :
// estMajeur(18)  // true
// estMajeur(16)  // false
// estMajeur(25)  // true
```

---

### Exercice 2.2 : Notes et mentions
```javascript
// TODO : Créez une fonction qui retourne la mention selon la note
// 0-5 : "Très faible"
// 6-10 : "Faible"
// 11-14 : "Bien"
// 15-18 : "Très bien"
// 19-20 : "Excellent"

// Testez :
// obtenirMention(3)   // "Très faible"
// obtenirMention(9)   // "Faible"
// obtenirMention(12)  // "Bien"
// obtenirMention(16)  // "Très bien"
// obtenirMention(19)  // "Excellent"
```

---

### Exercice 2.3 : Validateur de mot de passe
```javascript
// TODO : Créez une fonction qui valide un mot de passe
// Critères :
// - Longueur >= 8 caractères
// - Contient au moins un chiffre
// - Contient au moins une lettre majuscule
// Retourne true si valide, false sinon

// Indice : utilisez .length, /\d/ pour chiffre, /[A-Z]/ pour majuscule

// Testez :
// validerMotDePasse("abc123")     // false (pas assez long)
// validerMotDePasse("abcdefgh")   // false (pas de chiffre)
// validerMotDePasse("Abcdefg1")   // true
```

---

## TP 3 : Boucles et tableaux (⭐⭐ Moyen)

### Exercice 3.1 : Table de multiplication
```javascript
// TODO : Affichez la table de multiplication de 7 (de 1 à 10)
// Résultat attendu :
// 7 × 1 = 7
// 7 × 2 = 14
// ...
// 7 × 10 = 70
```

---

### Exercice 3.2 : Somme d'un tableau
```javascript
// TODO : Créez une fonction qui calcule la somme de tous les nombres d'un tableau

// Testez :
// calculerSomme([1, 2, 3, 4, 5])        // 15
// calculerSomme([10, 20, 30])           // 60
// calculerSomme([])                      // 0
// calculerSomme([100])                   // 100
```

---

### Exercice 3.3 : Filtrer les nombres pairs
```javascript
// TODO : Créez une fonction qui retourne un tableau contenant uniquement les nombres pairs
// Utilisez la méthode filter()

// Testez :
// obtenirPairs([1, 2, 3, 4, 5, 6])        // [2, 4, 6]
// obtenirPairs([10, 15, 20, 25])          // [10, 20]
// obtenirPairs([1, 3, 5, 7])              // []
```

---

## TP 4 : Objets et structures (⭐⭐⭐ Intermédiaire)

### Exercice 4.1 : Créer un objet Personne
```javascript
// TODO : Créez un objet 'personne' avec les propriétés :
// - nom : "Alice"
// - age : 28
// - email : "alice@example.com"
// - ville : "Lyon"
// Puis affichez chaque propriété

// Résultat attendu :
// personne.nom    // Alice
// personne.age    // 28
// personne.email  // alice@example.com
// personne.ville  // Lyon
```

---

### Exercice 4.2 : Objet avec méthodes
```javascript
// TODO : Créez un objet 'voiture' avec :
// - marque : "Tesla"
// - modele : "Model 3"
// - annee : 2024
// - demarrer() : retourne "La Tesla démarre..."
// - arreter() : retourne "La Tesla s'arrête..."

// Testez :
// voiture.demarrer()   // La Tesla démarre...
// voiture.arreter()    // La Tesla s'arrête...
```

---

### Exercice 4.3 : Tableau d'objets
```javascript
// TODO : Créez un tableau de 3 étudiants avec nom et note
// Puis créez une fonction pour trouver l'étudiant avec la meilleure note

// Exemple d'étudiant : { nom: "Alice", note: 18 }

// Bonus : utilisez reduce() ou une boucle
```

---

## TP 5 : Fonctions avancées (⭐⭐⭐ Intermédiaire)

### Exercice 5.1 : Calculatrice simple
```javascript
// TODO : Créez une fonction calculator(a, b, operation) qui retourne :
// - a + b si operation = "+"
// - a - b si operation = "-"
// - a * b si operation = "*"
// - a / b si operation = "/"
// Retournez "Opération inconnue" sinon

// Testez :
// calculator(10, 5, "+")  // 15
// calculator(10, 5, "-")  // 5
// calculator(10, 5, "*")  // 50
// calculator(10, 5, "/")  // 2
// calculator(10, 5, "%")  // "Opération inconnue"
```

---

### Exercice 5.2 : Fonction fléchée - Doubler les nombres
```javascript
// TODO : Créez une fonction fléchée qui double chaque nombre d'un tableau
// Utilisez map()

const nombres = [1, 2, 3, 4, 5];

// Testez :
// doubler(nombres) // [2, 4, 6, 8, 10]
```

---

### Exercice 5.3 : Composition de fonctions
```javascript
// TODO : Créez trois fonctions et composez-les :
// 1. additionner(a, b) : retourne a + b
// 2. multiplier(nombre, facteur) : retourne nombre * facteur
// 3. afficherResultat(nombre) : affiche "Résultat : X"
// 
// Puis appelez : afficherResultat(multiplier(additionner(5, 3), 2))
// Résultat attendu : "Résultat : 16"
// Calcul : (5 + 3) * 2 = 8 * 2 = 16
```

---

## TP 6 : Défis (⭐⭐⭐⭐ Difficile)

### Exercice 6.1 : Palindrome
```javascript
// TODO : Créez une fonction qui vérifie si une chaîne est un palindrome
// Ignorez les espaces et la casse
// Exemple : "A man a plan a canal Panama" = true

// Testez :
// estPalindrome("radar")                    // true
// estPalindrome("hello")                    // false
// estPalindrome("A man a plan a canal Panama") // true
// estPalindrome("été")                      // true
```

---

### Exercice 6.2 : Trouver les doublons
```javascript
// TODO : Créez une fonction qui retourne les nombres en doublon dans un tableau

// Testez :
// trouverDoublons([1, 2, 2, 3, 4, 4, 4, 5]) // [2, 4]
// trouverDoublons([1, 2, 3, 4, 5])          // []
// trouverDoublons([7, 7, 7])                // [7]
```

---

### Exercice 6.3 : Générateur de combinaisons
```javascript
// TODO : Créez une fonction qui génère toutes les combinaisons de 2 lettres
// Exemple avec ["A", "B", "C"] : ["AA", "AB", "AC", "BA", "BB", "BC", "CA", "CB", "CC"]

// Testez :
// genererCombinations(["A", "B", "C"]).length // 9
// genererCombinations(["X", "Y"]).length      // 4
```

---

### Exercice 6.4 : Gestion d'une liste TODO ⭐⭐⭐⭐⭐ BONUS
```javascript
// TODO : Créez un gestionnaire de tâches avec :
// - addTodo(titre) : ajoute une tâche
// - removeTodo(index) : supprime une tâche
// - completeTodo(index) : marque comme complétée
// - listTodos() : affiche toutes les tâches
// - getStats() : retourne {total, completed, pending}

// Testez :
// todoManager.addTodo("Apprendre JavaScript");
// todoManager.addTodo("Faire les TP");
// todoManager.addTodo("Construire un projet");
// todoManager.completeTodo(0);
// todoManager.listTodos();
// todoManager.getStats() // { total: 3, completed: 1, pending: 2 }
```

---

## 📊 Récapitulatif des TP

| TP | Difficulté | Concepts | Nombre d'exercices |
|----|-----------|----------|------------------|
| TP 1 | ⭐ Facile | Variables, types | 3 |
| TP 2 | ⭐⭐ Moyen | Conditions, logique | 3 |
| TP 3 | ⭐⭐ Moyen | Boucles, tableaux, map/filter | 3 |
| TP 4 | ⭐⭐⭐ Intermédiaire | Objets, méthodes | 3 |
| TP 5 | ⭐⭐⭐ Intermédiaire | Fonctions fléchées, composition | 3 |
| TP 6 | ⭐⭐⭐⭐ Difficile | Défis complets | 4 |

**Total : 19 exercices progressifs** 🎯

---

## 💡 Conseils pour résoudre les TP

1. **Lisez bien l'énoncé** avant de coder
2. **Testez votre code** avec les exemples donnés
3. **Utilisez console.log()** pour déboguer
4. **Essayez d'abord** sans regarder ailleurs
5. **Comparez votre code** avec celui des autres
6. **Refactorisez** - peut-on faire mieux ?
7. **Progressez graduellement** - ne sautez pas les niveaux

---

## Conclusion

JavaScript est un langage puissant et flexible qui :
- 💪 Permet de créer des applications web interactives
- 🚀 S'exécute partout (navigateurs, serveurs, mobiles)
- 📚 Dispose d'un écosystème riche (npm, bibliothèques)
- 🎓 Est relativement facile à apprendre pour débuter

### Prochaines étapes :
1. ✏️ Complétez tous les TP
2. 📖 Apprendre les promesses et async/await
3. 🔗 Découvrir le DOM et les événements
4. 📦 Explorer les frameworks (React, Vue, Angular)
5. 🛠️ Construire des projets réels

---

**Bonne chance dans votre apprentissage de JavaScript ! 🎉**

*Dernière mise à jour : 15 avril 2026*
