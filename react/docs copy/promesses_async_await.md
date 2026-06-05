# Promesses et Async/Await 🚀

## Table des matières
1. [Pourquoi async ?](#pourquoi-async)
2. [Concept : Synchrone vs Asynchrone](#concept--synchrone-vs-asynchrone)
3. [Callbacks (l'ancienne façon)](#callbacks-lancienne-façon)
4. [Promesses](#promesses)
5. [Async/Await](#asyncawait)
6. [Gestion des erreurs](#gestion-des-erreurs)
7. [Patterns avancés](#patterns-avancés)
8. [Travaux Pratiques](#travaux-pratiques-tp)

---

## Pourquoi async ?

En JavaScript, **certaines opérations prennent du temps** :
- 📡 Requêtes réseau (API, fichiers)
- ⏱️ Timers (setTimeout)
- 💾 Lecture/écriture de fichiers
- 🗄️ Requêtes à une base de données

**Le problème :** Si on attendait le résultat, tout le code serait bloqué !

```javascript
// ❌ MAUVAIS : le programme attend 2 secondes
console.log("Début");
sleep(2000);  // Bloque tout !
console.log("Fin");
```

**La solution :** Faire les opérations **en arrière-plan** et continuer le code.

```javascript
// ✅ BON : le programme continue
console.log("Début");
setTimeout(() => {
  console.log("Après 2 secondes");
}, 2000);
console.log("Fin");  // S'affiche avant !
```

---

## Concept : Synchrone vs Asynchrone

### Synchrone (Bloquant)
```javascript
// Le code attend le résultat
function attendreUneSeconde() {
  // Simule une attente...
  for (let i = 0; i < 1000000000; i++) {}
  return "Prêt !";
}

console.log("Début");
const resultat = attendreUneSeconde(); // ⏸️ Attend ici
console.log(resultat); // "Prêt !"
console.log("Fin");
```

**Flux :** 1 → 2 (attendu) → 3 → 4

### Asynchrone (Non-bloquant)
```javascript
console.log("Début");
setTimeout(() => {
  console.log("Après 2 secondes");
}, 2000);
console.log("Fin");

// Flux :
// 1. "Début"
// 2. "Fin"
// 3. (2 secondes plus tard) "Après 2 secondes"
```

**Flux :** 1 → 3 → 2 (asynchrone)

---

## Callbacks (L'ancienne façon)

Avant les promesses, on utilisait des **callbacks** (fonctions appelées plus tard).

### Callback simple

```javascript
function telechargerDonnees(url, callback) {
  setTimeout(() => {
    const donnees = { id: 1, nom: "Alice" };
    callback(donnees);
  }, 1000);
}

telechargerDonnees("https://api.example.com/user", (donnees) => {
  console.log("Données reçues:", donnees);
});
```

### Le problème : Callback Hell 😱

```javascript
// ❌ MAUVAIS : Imbrication infernale !
fonction1(param1, (resultat1) => {
  fonction2(resultat1, (resultat2) => {
    fonction3(resultat2, (resultat3) => {
      fonction4(resultat3, (resultat4) => {
        console.log("Enfin !", resultat4);
        // 😭 Impossible de lire !
      });
    });
  });
});
```

**Solution :** Les **Promesses** ! 🎉

---

## Promesses

### Qu'est-ce qu'une promesse ?

Une **Promesse** représente une valeur qui sera **disponible plus tard**.

```javascript
const promesse = new Promise((resolve, reject) => {
  // Code asynchrone
  if (/* succès */) {
    resolve("Succès !");
  } else {
    reject("Erreur !");
  }
});
```

Une promesse a **3 états** :

| État | Description |
|------|-------------|
| **Pending** | En attente | 
| **Fulfilled** | Résolue avec succès |
| **Rejected** | Rejetée (erreur) |

### Créer une promesse

```javascript
const promesse = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    
    if (success) {
      resolve("Opération complète !"); // Succès
    } else {
      reject("Opération échouée !"); // Erreur
    }
  }, 2000);
});
```

### Utiliser une promesse avec `.then()` et `.catch()`

```javascript
promesse
  .then((resultat) => {
    console.log("✅ Succès :", resultat);
  })
  .catch((erreur) => {
    console.log("❌ Erreur :", erreur);
  });
```

### Chaîner plusieurs promesses

```javascript
fetch("https://api.example.com/user/1")
  .then((response) => response.json())  // Convertir en JSON
  .then((utilisateur) => {
    console.log("Utilisateur:", utilisateur);
    return fetch(`https://api.example.com/user/${utilisateur.id}/posts`);
  })
  .then((response) => response.json())
  .then((posts) => {
    console.log("Posts:", posts);
  })
  .catch((erreur) => {
    console.error("Erreur:", erreur);
  });
```

### Exécuter plusieurs promesses en parallèle

```javascript
const p1 = fetch("https://api.example.com/users");
const p2 = fetch("https://api.example.com/posts");
const p3 = fetch("https://api.example.com/comments");

// Attendre que TOUTES se complètent
Promise.all([p1, p2, p3])
  .then(([usersResponse, postsResponse, commentsResponse]) => {
    return Promise.all([
      usersResponse.json(),
      postsResponse.json(),
      commentsResponse.json()
    ]);
  })
  .then(([users, posts, comments]) => {
    console.log("Toutes les données:", { users, posts, comments });
  })
  .catch((erreur) => {
    console.error("Au moins une requête a échoué:", erreur);
  });
```

---

## Async/Await

### C'est quoi ?

**Async/Await** est une **syntaxe plus lisible** pour travailler avec les promesses.

```javascript
// Avec .then()
function obtenirUtilisateur() {
  return fetch("https://api.example.com/user/1")
    .then((response) => response.json())
    .then((user) => user);
}

// Avec async/await
async function obtenirUtilisateur() {
  const response = await fetch("https://api.example.com/user/1");
  const user = await response.json();
  return user;
}
```

**Beaucoup plus lisible !** ✨

### Syntaxe de base

```javascript
// Une fonction async return toujours une Promesse
async function monFonction() {
  // await attend une promesse
  const resultat = await promises;
  return resultat;
}

// Appel
monFonction().then((resultat) => {
  console.log(resultat);
});
```

### Exemple complet

```javascript
async function afficherUtilisateur() {
  // Étape 1 : Récupérer l'utilisateur
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const utilisateur = await response.json();
  
  console.log("Utilisateur:", utilisateur);
  
  // Étape 2 : Récupérer ses posts
  const postsResponse = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${utilisateur.id}`
  );
  const posts = await postsResponse.json();
  
  console.log("Posts:", posts);
  
  return { utilisateur, posts };
}

// Appel
afficherUtilisateur();
```

### Exécuter en parallèle avec await

```javascript
async function obtenirDonnees() {
  // ❌ LENT : les requêtes se font une après l'autre
  const users = await fetch("https://api.example.com/users").then(r => r.json());
  const posts = await fetch("https://api.example.com/posts").then(r => r.json());
  // Total : 2 secondes (1 + 1)
}

// ✅ RAPIDE : les requêtes se font en parallèle
async function obtenirDonnees() {
  const [users, posts] = await Promise.all([
    fetch("https://api.example.com/users").then(r => r.json()),
    fetch("https://api.example.com/posts").then(r => r.json())
  ]);
  // Total : 1 secondes (parallèle)
}
```

---

## Gestion des erreurs

### Try/Catch avec async/await

```javascript
async function afficherUtilisateur() {
  try {
    const response = await fetch("https://api.example.com/user/1");
    
    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const utilisateur = await response.json();
    console.log(utilisateur);
  } catch (erreur) {
    console.error("Erreur:", erreur.message);
  }
}
```

### Finally (s'exécute toujours)

```javascript
async function telecharger() {
  try {
    const data = await fetch("https://api.example.com/data");
    return await data.json();
  } catch (erreur) {
    console.error("Erreur:", erreur);
  } finally {
    console.log("Téléchargement terminé (succès ou erreur)");
  }
}
```

### Gérer plusieurs erreurs différentes

```javascript
async function operationComplexe() {
  try {
    const user = await fetch("/api/user").then(r => r.json());
    const posts = await fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
    return { user, posts };
  } catch (erreur) {
    if (erreur.message.includes("404")) {
      console.error("Ressource non trouvée");
    } else if (erreur.message.includes("500")) {
      console.error("Erreur serveur");
    } else {
      console.error("Erreur inconnue:", erreur);
    }
  }
}
```

---

## Patterns avancés

### Retry (Essayer à nouveau)

```javascript
async function rechercherAvecRetry(url, maxTentatives = 3) {
  for (let i = 0; i < maxTentatives; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur réseau");
      return await response.json();
    } catch (erreur) {
      console.log(`Tentative ${i + 1} échouée, nouvelle essai...`);
      if (i === maxTentatives - 1) throw erreur;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1s
    }
  }
}
```

### Timeout (Délai maximum)

```javascript
async function avecTimeout(promesse, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout !")), timeoutMs)
  );
  return Promise.race([promesse, timeoutPromise]);
}

// Utilisation
async function donneeAvecTimeout() {
  try {
    const data = await avecTimeout(
      fetch("https://api.example.com/data").then(r => r.json()),
      5000 // Max 5 secondes
    );
    console.log(data);
  } catch (err) {
    console.error("Erreur ou timeout:", err);
  }
}
```

### Debounce (Retarder l'exécution)

```javascript
function debounce(fonction, delai) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fonction(...args), delai);
  };
}

// Utilisation
const rechercher = debounce(async (query) => {
  console.log("Recherche pour:", query);
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  console.log(results);
}, 500); // Attend 500ms après le dernier appel

// Chaque caractère tape lance un délai de 500ms
document.getElementById("search").addEventListener("input", (e) => {
  rechercher(e.target.value);
});
```

---

# Travaux Pratiques (TP) 📝

## TP 1 : Comprendre les Promesses (⭐ Facile)

### Exercice 1.1 : Créer votre première promesse
```javascript
// TODO : Créez une promesse qui se résout après 2 secondes
// Avec un message "Succès !"
// Utilisez console.log() pour afficher le résultat

// Exemple de structure :
// const promesse = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("message");
//   }, 2000);
// });
//
// promesse.then((resultat) => {
//   console.log(resultat);
// });
```

---

### Exercice 1.2 : Promesse avec rejet
```javascript
// TODO : Créez une promesse qui se REJETTE après 1 seconde
// Avec un message d'erreur "Erreur !"
// Gérez l'erreur avec .catch()

// Testez :
// La promesse doit se rejeter et afficher l'erreur
```

---

### Exercice 1.3 : Chaîner des promesses
```javascript
// TODO : Créez 3 promesses successives :
// 1. Première promet se résout en 1s avec "Étape 1 complète"
// 2. Deuxième prend le résultat et se résout en 1s avec "Étape 2 complète"
// 3. Troisième prend le résultat et se résout en 1s avec "Étape 3 complète"
//
// Utilisez .then() pour les chaîner

// Résultat attendu : les 3 étapes s'affichent en séquence (3 secondes au total)
```

---

## TP 2 : Async/Await (⭐⭐ Moyen)

### Exercice 2.1 : Convertir .then() en async/await
```javascript
// TODO : Convertissez ce code en async/await :

const exercice = fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((user) => {
    console.log("Utilisateur:", user);
    return user;
  })
  .catch((err) => console.error("Erreur:", err));

// À convertir en fonction async...
```

---

### Exercice 2.2 : Récupérer plusieurs données
```javascript
// TODO : Créez une fonction async qui :
// 1. Récupère un utilisateur depuis https://jsonplaceholder.typicode.com/users/1
// 2. Récupère ses posts depuis https://jsonplaceholder.typicode.com/posts?userId=1
// 3. Retourne un objet {utilisateur, posts}
//
// Faites les deux requêtes EN PARALLÈLE avec Promise.all()

// Testez :
// const data = await obtenirDonnees();
// console.log(data);
```

---

### Exercice 2.3 : Gestion d'erreur avec try/catch
```javascript
// TODO : Créez une fonction async qui récupère un utilisateur
// Utilisez try/catch
// Si l'URL est invalide, affichez "Erreur: utilisateur non trouvé"

async function obtenirUtilisateur(id) {
  try {
    // Récupérez l'utilisateur
    // Vérifiez si response.ok
    // Retournez les données
  } catch (erreur) {
    console.error("Erreur:", erreur.message);
  }
}

// Testez :
// await obtenirUtilisateur(1);      // Devrait afficher l'utilisateur
// await obtenirUtilisateur(99999);  // Devrait afficher une erreur
```

---

## TP 3 : API jsonplaceholder (⭐⭐ Moyen)

### Exercice 3.1 : Lister tous les utilisateurs
```javascript
// TODO : Récupérez tous les utilisateurs depuis :
// https://jsonplaceholder.typicode.com/users
// Affichez le nom et l'email de chaque utilisateur

async function afficherUtilisateurs() {
  // À implémenter...
}

// Résultat attendu :
// Leanne Graham - leanne@biz.example.com
// Erwin Howell - shanna@example.com
// ...
```

---

### Exercice 3.2 : Trouver l'utilisateur avec le plus de posts
```javascript
// TODO : Pour chaque utilisateur (1-10), récupérez son nombre de posts
// https://jsonplaceholder.typicode.com/posts?userId=X
// Trouvez celui avec le PLUS de posts

async function utilisateurPlusActif() {
  // Récupérez les utilisateurs
  // Pour chaque utilisateur, comptez ses posts
  // Retournez celui avec le plus de posts
}

// Résultat attendu :
// Utilisateur avec le plus de posts: {id, name, postsCount}
```

---

### Exercice 3.3 : Filtrer et afficher
```javascript
// TODO : Récupérez tous les posts et filtrez :
// 1. Les posts du userId=1
// 2. Parmi ces posts, ceux avec au-moins 5 commentaires
// Affiche le titre et le nombre de commentaires

// Indices :
// - GET /posts
// - GET /comments?postId=X

// Résultat attendu :
// POST 1: 5 commentaires
// POST 3: 7 commentaires
// ...
```

---

## TP 4 : Patterns avancés (⭐⭐⭐ Intermédiaire)

### Exercice 4.1 : Retry automatique
```javascript
// TODO : Créez une fonction qui essaye une requête 3 fois en cas d'erreur
// Attendez 1 seconde entre chaque tentative
// Affichez le numéro de la tentative

async function rechercherAvecRetry(url, maxTentatives = 3) {
  // À implémenter...
}

// Testez avec une URL invalide d'abord, puis une valide
```

---

### Exercice 4.2 : Timeout (délai maximum)
```javascript
// TODO : Créez une fonction qui lance une requête avec un délai max de 5 secondes
// Si ça dépasse 5s, lancez une erreur "Timeout !"

async function avecTimeout(url, timeoutMs = 5000) {
  // À implémenter...
}

// Testez :
// await avecTimeout("https://jsonplaceholder.typicode.com/users/1", 5000); // OK
// await avecTimeout("https://example.com/lent", 1000); // Timeout
```

---

### Exercice 4.3 : Paralléliser avec limite
```javascript
// TODO : Créez une fonction qui récupère 10 utilisateurs en parallèle
// MAIS avec un maximum de 3 requêtes simultanées
// (pour ne pas surcharger le serveur)

async function obtenirUtilisateurAvecLimite(ids, limiteParallele = 3) {
  // Indices : utilisez un système de queue/pile
  // ou Promise.all() avec des groupes
}

// Testez :
// Les utilisateurs 1-10 doivent être récupérés
// Mais max 3 requêtes à la fois
```

---

## TP 5 : Mini-projet (⭐⭐⭐ Intermédiaire)

### Exercice 5.1 : Dashboard utilisateur
```javascript
// TODO : Créez une fonction qui affiche pour un utilisateur :
// 1. Ses informations (nom, email, ville)
// 2. Ses 3 derniers posts
// 3. Le nombre de commentaires total sur tous ses posts
// 4. Tous en PARALLÈLE (pas séquentiel)

async function afficherDashboardUtilisateur(userId) {
  try {
    // À implémenter...
    console.log(`=== Dashboard Utilisateur ${userId} ===`);
    console.log(`Nom: ...`);
    console.log(`Email: ...`);
    console.log(`Ville: ...`);
    console.log(`Derniers posts: ...`);
    console.log(`Total commentaires: ...`);
  } catch (err) {
    console.error("Erreur:", err);
  }
}

// Testez :
// await afficherDashboardUtilisateur(1);
// await afficherDashboardUtilisateur(5);
```

---

### Exercice 5.2 : Système de cache
```javascript
// TODO : Créez une fonction qui cache les résultats des requêtes
// Si on demande 2 fois la même ressource, retournez le cache
// Affiche [CACHE] quand c'est du cache

const cache = {};

async function fetchAvecCache(url) {
  if (cache[url]) {
    console.log("[CACHE]", url);
    return cache[url];
  }
  
  console.log("[REQUÊTE]", url);
  const response = await fetch(url);
  const data = await response.json();
  
  cache[url] = data;
  return data;
}

// Testez :
// await fetchAvecCache("https://jsonplaceholder.typicode.com/users/1");
// await fetchAvecCache("https://jsonplaceholder.typicode.com/users/1"); // [CACHE]
// await fetchAvecCache("https://jsonplaceholder.typicode.com/users/2");
```

---

## TP 6 : Défis (⭐⭐⭐⭐ Difficile)

### Exercice 6.1 : Chaîne de requêtes dépendantes
```javascript
// TODO : Créez une chaîne de requêtes où chacune dépend de la précédente
// 1. Récupérez un utilisateur
// 2. Récupérez son premier post
// 3. Récupérez le premier commentaire de ce post
// 4. Affichez tout

async function chainRequetes(userId) {
  try {
    // À implémenter...
  } catch (err) {
    console.error(err);
  }
}

// Testez :
// await chainRequetes(1);
```

---

### Exercice 6.2 : Gestion d'erreurs robuste
```javascript
// TODO : Créez une fonction qui gère :
// 1. Les erreurs de réseau
// 2. Les codes HTTP d'erreur (404, 500, etc.)
// 3. Les timeouts
// 4. Les données invalides JSON
// Affichez un message approprié pour chaque cas

async function requestRobuste(url, timeout = 5000) {
  try {
    // À implémenter avec tous les cas d'erreur...
  } catch (err) {
    // Gérez les différents types d'erreurs
  }
}

// Testez avec différentes URL problématiques
```

---

### Exercice 6.3 : Pattern Repository
```javascript
// TODO : Créez un "repository" pour gérer les données
// - getUserById(id)
// - getPostsByUserId(userId)
// - createPost(userId, title, body)
// - deletePost(postId)
// - updatePost(postId, title, body)
//
// Utilisez un cache et une gestion d'erreur robuste

class PostRepository {
  constructor() {
    this.cache = {};
  }
  
  async getUserById(id) {
    // À implémenter...
  }
  
  async getPostsByUserId(userId) {
    // À implémenter...
  }
  
  // ... autres méthodes
}

// Testez :
// const repo = new PostRepository();
// const user = await repo.getUserById(1);
// const posts = await repo.getPostsByUserId(1);
```

---

## 📊 Récapitulatif des TP

| TP | Difficulté | Concepts | Nombre d'exercices |
|----|-----------|----------|------------------|
| TP 1 | ⭐ Facile | Promesses, resolve, reject, .then(), .catch() | 3 |
| TP 2 | ⭐⭐ Moyen | Async/await, try/catch, Promise.all() | 3 |
| TP 3 | ⭐⭐ Moyen | API réelle, fetching data | 3 |
| TP 4 | ⭐⭐⭐ Intermédiaire | Retry, timeout, parallélisation | 3 |
| TP 5 | ⭐⭐⭐ Intermédiaire | Mini-projets pratiques | 2 |
| TP 6 | ⭐⭐⭐⭐ Difficile | Défis complets | 3 |

**Total : 17 exercices** 🎯

---

## 💡 Conseils pour les TP

1. **Testez en console** : Utilisez `node` ou la console du navigateur
2. **Utilisez curl ou Postman** pour tester les API en premier
3. **N'oubliez pas les erreurs** : Une requête peut échouer !
4. **Lisez la doc de jsonplaceholder** : https://jsonplaceholder.typicode.com/
5. **Faites du logging** : `console.log()` partout pour comprendre le flux
6. **Progressez graduellement** : Ne sautez pas les niveaux

---

## Ressources

### API Test
- https://jsonplaceholder.typicode.com/ (API gratuite pour tester)
- https://api.github.com (API GitHub)
- https://pokeapi.co (Pokémon API)

### Documentation
- MDN: Promises - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
- MDN: Async/Await - https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_Js
- JavaScript.info - https://javascript.info/async

---

## Conclusion

**Async/Await** vous permet de :
- 💪 Faire des requêtes sans bloquer le code
- 🔗 Gérer les opérations complexes simplement
- 🚀 Construire des applications web modernes
- 📡 Consommer des API facilement

### Prochaines étapes :
1. ✏️ Complétez tous les TP
2. 📖 Explorez fetch vs axios
3. 🔄 Apprenez Redux ou Context API (état)
4. ⚛️ Découvrez React avec les hooks async
5. 🛠️ Construire une vrai app web !

---

**À vous de jouer ! 🚀**

*Créé : 16 avril 2026*
