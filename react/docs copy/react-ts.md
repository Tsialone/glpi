# Guide React.js et Travaux Pratiques

## Table des matieres
1. [Pourquoi React ?](#pourquoi-react-)
2. [Pre-requis et installation](#pre-requis-et-installation)
3. [Concepts de base](#concepts-de-base)
4. [Composants, Props et State](#composants-props-et-state)
5. [Hooks essentiels](#hooks-essentiels)
6. [Gestion des formulaires](#gestion-des-formulaires)
7. [Rendu conditionnel et listes](#rendu-conditionnel-et-listes)
8. [Cycle de vie avec useEffect](#cycle-de-vie-avec-useeffect)
9. [Architecture de projet](#architecture-de-projet)
10. [Travaux Pratiques (TP)](#travaux-pratiques-tp)

---

## Pourquoi React ?

React.js est une bibliotheque JavaScript pour construire des interfaces utilisateur modernes.

### Avantages principaux
- UI declarative: vous decrivez l interface, React met a jour le DOM.
- Composants reutilisables: code plus propre et maintenable.
- Ecosysteme tres riche: React Router, Redux, React Query, etc.
- Grande adoption: beaucoup d offres d emploi et de ressources.

### Quand utiliser React ?
- Applications web interactives
- Dashboards et back-offices
- SPA (Single Page Applications)
- Frontend connecte a une API

---

## Pre-requis et installation

### Pre-requis
- Connaissances de base en JavaScript (variables, fonctions, objets)
- Node.js installe
- npm ou yarn

### Creer un projet React rapidement (Vite)

```bash
npm create vite@latest mon-app-react -- --template react
cd mon-app-react
npm install
npm run dev
```

### Structure classique d un projet

```text
mon-app-react/
  src/
    App.jsx
    main.jsx
    components/
  public/
  package.json
  vite.config.js
```

---

## Concepts de base

### JSX

JSX permet d ecrire du HTML dans du JavaScript.

```jsx
function App() {
  return <h1>Bonjour React</h1>;
}
```

### Regles importantes JSX
- Toujours retourner un seul element parent.
- Utiliser `className` au lieu de `class`.
- Les expressions JS se mettent entre `{}`.

```jsx
function Message() {
  const nom = "Alice";
  return <p>Bonjour {nom}</p>;
}
```

---

## Composants, Props et State

### Composant fonctionnel

Un composant c'est juste une fonction JavaScript qui retourne du JSX (HTML en JavaScript).

```jsx
function Welcome() {
  return <h2>Bienvenue</h2>;
}
```

**IMPORTANT** : Le nom du composant DOIT être en camelcase commencer par une majuscule (Welcome, pas welcome).

### Props : Comment passer des donnees

Les Props sont comme les **parametres d'une fonction**. Le parent envoie des donnees au composant enfant.

**Parent envoie** :
```jsx
<Carte nom="Alice" age={28} />
```

**Enfant recoit** :
```jsx
function Carte({ nom, age }) {
  // nom = "Alice"
  // age = 28
  return (
    <div>
      <h3>{nom}</h3>
      <p>Age: {age}</p>
    </div>
  );
}
```

**Piegé courant** : Les Props sont **read-only** - tu ne peux pas modifier une prop. C'est unidirectionnel (parent → enfant).

```jsx
// ❌ MAUVAIS
function MonComposant({ nom }) {
  nom = "Bob";  // Erreur !
}

// ✅ BON
function MonComposant({ nom }) {
  console.log(nom); // OK, juste lire
}
```

### State : La memoire du composant

Le **State** c'est la memoire du composant. Quand il change, React re-affiche le composant.

Utilise `useState` :

```jsx
import { useState } from "react";

function Compteur() {
  const [count, setCount] = useState(0);
  // count = valeur actuelle
  // setCount = fonction pour changer la valeur
  // 0 = valeur initiale

  return (
    <div>
      <p>Valeur: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementer
      </button>
    </div>
  );
}
```

**Comment ca marche** :
1. Au debut, `count` vaut 0
2. L'utilisateur clique le bouton
3. `setCount(1)` est appelee
4. React voit que l'état a changé
5. React **re-render** le composant avec count = 1
6. L'interface met a jour

**Piege courant** : Modifier directement l'état ne marche pas.

```jsx
// ❌ MAUVAIS - React ne verra pas le changement
count = count + 1;

// ✅ BON - React verra et re-affichera
setCount(count + 1);
```

---

## Hooks essentiels

### useState
Permet de stocker un etat local dans un composant.

### useEffect : Faire des actions apres le rendu

`useEffect` c'est **"fais quelque chose apres que React ait affiche le composant"**.

C'est utile pour :
- Appels API (charger des donnees)
- Timers
- S'abonner a des donnees
- Modifier le document.title

**Structure** :
```jsx
useEffect(() => {
  // Code qui s'execute APRES le rendu
}, [dependances]);
```

**Les 3 cas d'usage** :

**1) A CHAQUE RENDU** (Mauvaise idee, boucle infinie possible) :
```jsx
useEffect(() => {
  console.log("Le composant vient d'afficher (ou re-afficher)");
  // S'execute a chaque fois que le composant se re-rend
  // ATTENTION : peut causer des boucles infinies !
});
```

**2) UNE SEULE FOIS au montage** (comme `ngOnInit` en Angular) :
```jsx
useEffect(() => {
  console.log("Composant monte (premiere fois)");
  // S'execute UNE SEULE FOIS quand le composant apparait
}, []); // Array vide = "une seule fois"
```

**3) QUAND UNE VARIABLE CHANGE** :
```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("count a change, nouvelle valeur:", count);
  // S'execute chaque fois que count change
}, [count]); // Dependance = count
```

**Exemple reel : Charger des donnees** :
```jsx
import { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ca s'execute UNE FOIS au montage du composant
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // Array vide = une seule fois

  if (loading) return <p>Chargement...</p>;
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**Nettoyage avec cleanup** :

Si tu utilises un timer, une souscription, etc., tu dois les nettoyer (sinon tu vas creer des fuites memoire).

```jsx
useEffect(() => {
  // Creer un timer
  const id = setInterval(() => {
    console.log("Tick!");
  }, 1000);

  // Retourner une fonction cleanup
  return () => {
    clearInterval(id); // Nettoyer quand le composant se detruit
  };
}, []);
```

---

## Gestion des formulaires

### Controlled Components (Composants controles)

En React, un `<input>` qui change l'état React s'appelle un "controlled component".

**Pourquoi** ? Parce que React controle la valeur, pas le DOM.

```jsx
import { useState } from "react";

function Formulaire() {
  const [nom, setNom] = useState("");
  // nom = valeur actuelle du champ
  // setNom = fonction appelée quand l'utilisateur tape

  return (
    <input
      value={nom}
      // La valeur vient du State React
      
      onChange={(e) => setNom(e.target.value)}
      // Quand l'utilisateur tape, on met a jour l'état
      
      placeholder="Votre nom"
    />
  );
}
```

**Flow** :
1. Utilisateur tape "Alice"
2. onChange se declenche
3. setNom("A"), setNom("Al"), setNom("Ali"), etc.
4. React re-affiche avec la nouvelle valeur
5. L'input affiche "Alice"

**Pourquoi c'est mieux** ? Parce que React connait TOUJOURS la valeur, tu peux facilement ajouter de la logique.

### Soumettre un formulaire

```jsx
function FormulaireNom() {
  const [nom, setNom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Empecher le rechargement de la page
    console.log("Nom soumis:", nom);
    setNom(""); // Vider le champ apres submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Votre nom"
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### Validation simple

Au lieu de faire la validation dans le formulaire, fais une fonction :

```jsx
function FormulaireInscription() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Fonction pour valider
  const valider = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email obligatoire";
    if (password.length < 8) newErrors.password = "Min 8 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si valide
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valider()) {
      console.log("Formulaire valide, envoyer au serveur");
      // Faire l'appel API ici
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
      </div>

      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### localStorage : Persister les donnees

`localStorage` sauvegarde les donnees dans le navigateur.

**Charger au demarrage** :
```jsx
const [todos, setTodos] = useState(() => {
  // Cette fonction s'execute UNE SEULE FOIS au montage
  const saved = localStorage.getItem("mes-todos");
  return saved ? JSON.parse(saved) : [];
  // Si rien en cache, retourner array vide
});
```

**Sauvegarder quand ca change** :
```jsx
useEffect(() => {
  localStorage.setItem("mes-todos", JSON.stringify(todos));
  // Chaque fois que todos change, sauvegarder
}, [todos]);
```

**Exemple complet** :
```jsx
import { useState, useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarder chaque fois que todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title) => {
    setTodos([...todos, { id: Date.now(), title, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div>
      <input
        placeholder="Nouvelle tache..."
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addTodo(e.target.value);
            e.target.value = "";
          }
        }}
      />
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTodo(t.id)}
            />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
              {t.title}
            </span>
            <button onClick={() => deleteTodo(t.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Rendu conditionnel et listes

### Rendu conditionnel

```jsx
function Statut({ connecte }) {
  return <p>{connecte ? "Connecte" : "Non connecte"}</p>;
}
```

### Listes avec key

```jsx
function ListeCourses({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.nom}</li>
      ))}
    </ul>
  );
}
```

### Children Props

Les `children` c'est le contenu qu'on passe a un composant.

**Sans children** :
```jsx
<MonBouton text="Cliquez-moi" />
```

**Avec children** :
```jsx
<MonBouton>Cliquez-moi</MonBouton>
// "Cliquez-moi" devient "children"
```

**Pourquoi utiliser children** ? C'est plus flexible et lisible.

Exemple : Une boite d'alerte

```jsx
// Composant Alert
function Alert({ type, children }) {
  const couleur = type === "error" ? "red" : "blue";
  return (
    <div style={{ color: couleur, padding: "10px", border: "1px solid" }}>
      {children}
      {/* Le contenu passe va s'afficher ici */}
    </div>
  );
}

// Utilisation
function App() {
  return (
    <>
      <Alert type="error">
        <strong>Erreur !</strong> Quelque chose s'est mal passe.
      </Alert>

      <Alert type="info">
        <strong>Info :</strong> Voici une information importante.
      </Alert>
    </>
  );
}
```

**Composant wrapper** : Un composant qui structure le layout

```jsx
function Panel({ titre, children }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <h3>{titre}</h3>
      <div>{children}</div>
    </div>
  );
}

// Utilisation
function Dashboard() {
  return (
    <Panel titre="Mon Dashboard">
      <p>Quelconque contenu</p>
      <button>Cliquez-moi</button>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </Panel>
  );
}
```

---

## Gestion avancée des états

### Combiner plusieurs states

Quand tu as plusieurs champs de formulaire, tu dois avoir plusieurs states :

```jsx
function Formulaire() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />
    </form>
  );
}
```

**C'est repetitif**, on peut simplifier avec un objet :

```jsx
function Formulaire() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form, // Copier toutes les proprietes
      [name]: value // Remplacer celle qui change
    });
  };

  return (
    <form>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} />
      <input name="phone" value={form.phone} onChange={handleChange} />
    </form>
  );
}
```

### useReducer pour les états complexes

Quand l'état devient trop complique (beaucoup de logique), utilise `useReducer`.

C'est comme Redux en mini.

```jsx
import { useReducer } from "react";

// 1. Creer une fonction reducer (elle decide quoi faire avec l'état)
function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        todos: [...state.todos, { id: Date.now(), title: action.payload, done: false }]
      };
    case "DELETE_TODO":
      return {
        todos: state.todos.filter((t) => t.id !== action.id)
      };
    case "TOGGLE_TODO":
      return {
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, done: !t.done } : t
        )
      };
    default:
      return state;
  }
}

// 2. Utiliser useReducer dans le composant
function TodoListAvancee() {
  const initialState = { todos: [] };
  const [state, dispatch] = useReducer(reducer, initialState);
  // state = l'état actuel
  // dispatch = fonction pour declencher des actions

  const addTodo = (title) => {
    dispatch({ type: "ADD_TODO", payload: title });
  };

  const toggleTodo = (id) => {
    dispatch({ type: "TOGGLE_TODO", id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", id });
  };

  return (
    <div>
      <button onClick={() => addTodo("Nouvelle tache")}>Ajouter</button>
      <ul>
        {state.todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTodo(t.id)}
            />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
              {t.title}
            </span>
            <button onClick={() => deleteTodo(t.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**useState vs useReducer** :
- `useState` : Pour des états simples (un nombre, une chaîne, un booléen)
- `useReducer` : Pour des états complexes avec beaucoup de logique

---

## Cycle de vie avec useEffect

`useEffect` peut etre utilise de differentes facons:

```jsx
// 1) A chaque rendu
useEffect(() => {
  console.log("Render");
});

// 2) Une seule fois (montage)
useEffect(() => {
  console.log("Mount");
}, []);

// 3) Quand une valeur change
useEffect(() => {
  console.log("count a change");
}, [count]);
```

---

## React Router (Navigation multi-pages)

React Router permet de naviguer entre differentes pages **sans recharger la page** (SPA - Single Page App).

### Installation

```bash
npm install react-router-dom
```

### Concept : Routes et composants

Au lieu d'avoir un seul component App, tu crées plusieurs "pages" (des composants).

**Ancien (sans routing)** :
```jsx
function App() {
  const [page, setPage] = useState("accueil");
  
  return (
    <div>
      {page === "accueil" && <Accueil />}
      {page === "users" && <Users />}
      {page === "about" && <About />}
    </div>
  );
}
```

**Nouveau (avec Router)** :
```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/users">Utilisateurs</Link>
        <Link to="/about">A propos</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/users" element={<Users />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

function Accueil() {
  return <h1>Bienvenue sur l'accueil</h1>;
}

function Users() {
  return <h1>Liste des utilisateurs</h1>;
}

function About() {
  return <h1>A propos</h1>;
}
```

**Comment ca marche** :
1. L'utilisateur clique sur un `<Link>`
2. React Router change l'URL (ex: `/users`)
3. React Router affiche le composant correspondant (`<Users />`)
4. **Pas de rechargement de page** - juste un affichage different

### Parametres d'URL

Parfois tu veux passer des infos dans l'URL (ex: `/users/123`).

```jsx
import { useParams } from "react-router-dom";

function UserDetail() {
  const { id } = useParams();
  // Si l'URL est /users/123, alors id = "123"
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((r) => r.json())
      .then(setUser);
  }, [id]); // Recharger quand id change

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Ville: {user.address.city}</p>
    </div>
  );
}

// Dans App
<Routes>
  <Route path="/users/:id" element={<UserDetail />} />
  {/* :id = parametre variable */}
</Routes>
```

### Navigation programmatique

Parfois tu veux naviguer en JavaScript (pas juste avec des liens).

```jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Envoyer au serveur
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      // Rediriger vers le dashboard
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

---

## Hooks personnalises

Un hook personnalise c'est une fonction qu'on crée pour **reutiliser de la logique**.

**Exemple : Une logique d'appel API** que tu dois faire dans 5 composants differents.

**Sans hook personnalise** (tu repetes du code) :
```jsx
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // ... rendu ...
}

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // ... meme logique !
}
```

**Avec hook personnalise** (tu mutualises) :

```jsx
// 1. Creer le hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// 2. Utiliser le hook partout
function UsersList() {
  const { data: users, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

function PostsList() {
  const { data: posts, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

**Regles pour les hooks** :
- Doit commencer par `use` (useFetch, useForm, useAuth, etc.)
- Peut utiliser d'autres hooks (useState, useEffect, useReducer)
- A appeler que dans les composants, pas dans des fonctions normales

**Autre exemple : Hook pour gerer un formulaire** :

```jsx
function useForm(initialState) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const reset = () => {
    setForm(initialState);
  };

  return { form, handleChange, reset };
}

// Utiliser
function LoginForm() {
  const { form, handleChange, reset } = useForm({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Soumettre", form);
    reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} />
      <button>Envoyer</button>
    </form>
  );
}
```

---

## Architecture de projet

Organisation simple et efficace:

```text
src/
  components/
    ui/
    layout/
  pages/
  hooks/
  services/
  utils/
  App.jsx
  main.jsx
```

Bonnes pratiques:
- Un composant = une responsabilite.
- Eviter la logique API directement dans les composants volumineux.
- Extraire la logique repetitive dans des hooks personnalises.
- Garder les composants petits et testables.

---

# Travaux Pratiques (TP)

## TP 1 : Demarrage React (Facile)

### Exercice 1.1 : Premier composant
```jsx
// TODO:
// Creez un composant HelloReact qui affiche:
// "Bonjour, je commence React!"
```

### Exercice 1.2 : JSX dynamique
```jsx
// TODO:
// Creez une variable prenom = "Nina"
// Affichez: "Bonjour Nina" dans un composant
```

### Exercice 1.3 : Mini carte profil
```jsx
// TODO:
// Creez un composant Profil avec:
// - nom
// - metier
// - ville
// Affichez les infos dans une carte simple
```

---

## TP 2 : Props et composants (Moyen)

### Exercice 2.1 : Carte produit
```jsx
// TODO:
// Creez un composant ProductCard qui recoit:
// - titre
// - prix
// - stock (boolean)
// Affichez "En stock" ou "Rupture" selon stock
```

### Exercice 2.2 : Liste de cartes
```jsx
// TODO:
// Creez un tableau de 3 produits
// Affichez un ProductCard pour chaque produit avec map()
```

### Exercice 2.3 : Props children
```jsx
// TODO:
// Creez un composant Panel qui affiche children
// Utilisez Panel pour encapsuler un titre et un paragraphe
```

---

## TP 3 : State et interactions (Moyen)

### Exercice 3.1 : Compteur
```jsx
// TODO:
// Creez un compteur avec deux boutons:
// +1 et -1
```

### Exercice 3.2 : Toggle theme
```jsx
// TODO:
// Creez un bouton qui alterne entre "clair" et "sombre"
// Affichez le theme actif
```

### Exercice 3.3 : Champ live
```jsx
// TODO:
// Creez un input texte
// Affichez en direct: "Vous ecrivez: ..."
```

---

## TP 4 : useEffect et API (Intermediaire)

### Exercice 4.1 : Fetch utilisateurs
```jsx
// TODO:
// Au montage du composant:
// - recuperer https://jsonplaceholder.typicode.com/users
// - afficher nom + email
```

### Exercice 4.2 : Loader et erreur
```jsx
// TODO:
// Ajoutez:
// - un state loading
// - un state erreur
// Affichez "Chargement..." puis la liste
// et un message en cas d echec
```

### Exercice 4.3 : Recherche client-side
```jsx
// TODO:
// Ajoutez un input recherche
// Filtrez les utilisateurs par nom en temps reel
```

---

## TP 5 : Formulaires et gestion de donnees (Intermediaire)

### Exercice 5.1 : Formulaire TODO
```jsx
// TODO:
// Creez une todo list:
// - ajouter une tache
// - marquer complete
// - supprimer une tache
```

### Exercice 5.2 : Validation simple
```jsx
// TODO:
// Formulaire d inscription:
// - email obligatoire
// - mot de passe >= 8 caracteres
// Affichez les erreurs sous les champs
```

### Exercice 5.3 : Persistance locale
```jsx
// TODO:
// Sauvegardez la todo list dans localStorage
// Rechargez les donnees au demarrage
```

---

## TP 6 : Mini projet React (Avance)

### Exercice 6.1 : Dashboard utilisateur
```jsx
// TODO:
// Construisez une page dashboard avec:
// - profil utilisateur
// - liste des posts
// - stats simples (nombre de posts)
```

### Exercice 6.2 : Routing basique
```jsx
// TODO:
// Ajoutez react-router-dom
// Creez 3 pages:
// - / (Accueil)
// - /users (Utilisateurs)
// - /about (A propos)
```

### Exercice 6.3 : Hook personnalise
```jsx
// TODO:
// Creez un hook useFetch(url) qui retourne:
// { data, loading, error }
// Reutilisez-le sur au moins 2 pages
```

---

## Recapitulatif TP

| TP | Niveau | Concepts | Nb exercices |
|----|--------|----------|-------------|
| TP 1 | Facile | JSX, composant simple | 3 |
| TP 2 | Moyen | Props, map, children | 3 |
| TP 3 | Moyen | useState, events | 3 |
| TP 4 | Intermediaire | useEffect, fetch, erreurs | 3 |
| TP 5 | Intermediaire | formulaires, validation, storage | 3 |
| TP 6 | Avance | routing, hook custom, mini projet | 3 |

Total: 18 exercices

---

## Conseils pratiques

1. Commencez par les composants les plus simples.
2. Testez chaque etape avec `console.log` et React DevTools.
3. Isolez la logique metier dans des hooks utilitaires.
4. Gereez les etats `loading` et `error` pour chaque appel API.
5. Ecrivez du code lisible avant d optimiser.
6. Refactorisez regulierement les composants trop longs.

---

## Ressources utiles

- Documentation React: https://react.dev/
- Vite: https://vitejs.dev/
- React Router: https://reactrouter.com/
- MDN JavaScript: https://developer.mozilla.org/fr/docs/Web/JavaScript

---

## Conclusion

Avec React.js, vous pouvez:
- construire des interfaces modulaires et modernes,
- mieux organiser votre frontend,
- gerer les donnees asynchrones proprement,
- preparer des projets web professionnels.

Prochaines etapes:
1. Faire tous les TP dans l ordre.
2. Construire une mini app complete (auth + API + UI).
3. Ajouter des tests (Vitest, Testing Library).
4. Explorer TypeScript avec React.

Bon apprentissage React.
