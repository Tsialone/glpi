# 📚 Bible Record<> & Types Utilitaires TypeScript

> TypeScript · Utility Types · Mapped Types · Conditional Types

---

## Table des matières

1. [Record\<K, V\>](#1-recordk-v)
2. [Types utilitaires — Transformation d'objets](#2-types-utilitaires--transformation-dobjets)
3. [Types utilitaires — Unions & intersections](#3-types-utilitaires--unions--intersections)
4. [Types utilitaires — Fonctions](#4-types-utilitaires--fonctions)
5. [Types utilitaires — Promesses & Awaited](#5-types-utilitaires--promesses--awaited)
6. [Mapped Types](#6-mapped-types)
7. [Conditional Types](#7-conditional-types)
8. [Template Literal Types](#8-template-literal-types)
9. [Infer](#9-infer)
10. [Index Types & Keyof](#10-index-types--keyof)
11. [Discriminated Unions](#11-discriminated-unions)
12. [Patterns courants](#12-patterns-courants)
13. [Aide-mémoire rapide](#13-aide-mémoire-rapide)

---

## 1. Record\<K, V\>

`Record<K, V>` crée un type objet dont toutes les clés sont de type `K` et toutes les valeurs de type `V`.

```typescript
Record<Keys, Values>
// Équivalent à : { [K in Keys]: Values }
```

### Cas de base

```typescript
// Clés string, valeurs number
const scores: Record<string, number> = {
  alice: 42,
  bob: 17,
};

// Clés number, valeurs string
const labels: Record<number, string> = {
  1: "un",
  2: "deux",
  3: "trois",
};

// Clés et valeurs fixes
type Direction = "north" | "south" | "east" | "west";
const moves: Record<Direction, number> = {
  north: 0,
  south: 0,
  east: 0,
  west: 0,
  // Toutes les clés de Direction sont OBLIGATOIRES
};
```

### Avec un enum comme clé

```typescript
enum Status { PENDING = "pending", ACTIVE = "active", BANNED = "banned" }

const statusLabels: Record<Status, string> = {
  [Status.PENDING]: "En attente",
  [Status.ACTIVE]:  "Actif",
  [Status.BANNED]:  "Banni",
};

// Accès
statusLabels[Status.ACTIVE]   // "Actif"
statusLabels["active"]        // "Actif"
```

### Avec un type union comme clé

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const methodDescriptions: Record<HttpMethod, string> = {
  GET:    "Lire une ressource",
  POST:   "Créer une ressource",
  PUT:    "Remplacer une ressource",
  PATCH:  "Mettre à jour partiellement",
  DELETE: "Supprimer une ressource",
};
```

### Record imbriqué

```typescript
type UserId = string;
type Permission = "read" | "write" | "delete";

// Utilisateur → permission → autorisé
const acl: Record<UserId, Record<Permission, boolean>> = {
  "user-1": { read: true,  write: true,  delete: false },
  "user-2": { read: true,  write: false, delete: false },
};

// Accès
acl["user-1"]["write"]   // true
```

### Record avec valeur complexe

```typescript
interface UserInfo {
  name: string;
  email: string;
  role: "admin" | "user";
}

// Dictionnaire id → infos utilisateur
const users: Record<string, UserInfo> = {
  "abc123": { name: "Alice", email: "alice@mail.com", role: "admin" },
  "def456": { name: "Bob",   email: "bob@mail.com",   role: "user"  },
};
```

### Record avec valeur optionnelle

```typescript
// Toutes les clés existent mais la valeur peut être undefined
type Cache = Record<string, string | undefined>;

const cache: Cache = {};
cache["key"] = "value";
const val = cache["missing"];  // string | undefined
```

### Différence avec les Index Signatures

```typescript
// Index signature — clés non énumérables, moins strict
type A = { [key: string]: number };

// Record — équivalent, mais plus lisible et composable
type B = Record<string, number>;

// Record force TOUTES les clés d'une union
type C = Record<"a" | "b", number>;
// { a: number; b: number }  ← les deux clés sont obligatoires

// Index signature avec union → moins strict
type D = { [key in "a" | "b"]: number };  // même chose que Record<"a"|"b", number>
```

---

## 2. Types utilitaires — Transformation d'objets

### Partial\<T\>

Rend toutes les propriétés optionnelles.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// Cas d'usage : DTO de mise à jour
function updateUser(id: number, data: Partial<User>): User { ... }
updateUser(1, { name: "Alice" });  // email omis → OK
```

### Required\<T\>

Rend toutes les propriétés obligatoires (inverse de Partial).

```typescript
interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; debug: boolean }
```

### Readonly\<T\>

Rend toutes les propriétés en lecture seule.

```typescript
interface User {
  id: number;
  name: string;
}

const user: Readonly<User> = { id: 1, name: "Alice" };
user.name = "Bob";  // ❌ Erreur : Cannot assign to 'name'

// Tableau en lecture seule
const ids: Readonly<number[]> = [1, 2, 3];
// ou :
const ids: ReadonlyArray<number> = [1, 2, 3];
ids.push(4);  // ❌ Erreur
```

### Pick\<T, K\>

Garde seulement les propriétés listées.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

// Cas d'usage : DTO de réponse sans le mot de passe
function getPublicProfile(user: User): PublicUser {
  const { id, name, email } = user;
  return { id, name, email };
}
```

### Omit\<T, K\>

Supprime les propriétés listées (inverse de Pick).

```typescript
type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string; role: string }

type UserWithoutPasswordAndRole = Omit<User, "password" | "role">;
```

### Partial + Omit + Pick combinés

```typescript
// DTO de création : tout sauf id (auto-généré)
type CreateUserDto = Omit<User, "id">;

// DTO de mise à jour : tout optionnel sauf id
type UpdateUserDto = Partial<Omit<User, "id">>;

// Réponse publique partielle
type UserPreview = Partial<Pick<User, "name" | "email">>;
```

---

## 3. Types utilitaires — Unions & intersections

### Exclude\<T, U\>

Retire de l'union T les membres assignables à U.

```typescript
type A = "a" | "b" | "c" | "d";
type B = Exclude<A, "b" | "c">;
// "a" | "d"

type NonNullableString = Exclude<string | null | undefined, null | undefined>;
// string

// Exclure un type
type NotString = Exclude<string | number | boolean, string>;
// number | boolean
```

### Extract\<T, U\>

Garde de l'union T seulement les membres assignables à U (inverse de Exclude).

```typescript
type A = "a" | "b" | "c" | number;
type OnlyStrings = Extract<A, string>;
// "a" | "b" | "c"

type Common = Extract<"a" | "b" | "c", "a" | "c" | "d">;
// "a" | "c"
```

### NonNullable\<T\>

Retire `null` et `undefined` d'un type.

```typescript
type A = NonNullable<string | null | undefined>;
// string

type B = NonNullable<number | null>;
// number

// Cas d'usage
function process(value: string | null | undefined): string {
  const safe: NonNullable<typeof value> = value!;
  return safe.toUpperCase();
}
```

---

## 4. Types utilitaires — Fonctions

### ReturnType\<T\>

Extrait le type de retour d'une fonction.

```typescript
function getUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }

// Avec une fonction générique
type F = () => Promise<string[]>;
type R = ReturnType<F>;
// Promise<string[]>
```

### Parameters\<T\>

Extrait les types des paramètres d'une fonction sous forme de tuple.

```typescript
function createUser(name: string, age: number, role: "admin" | "user") {}

type Params = Parameters<typeof createUser>;
// [name: string, age: number, role: "admin" | "user"]

type FirstParam = Parameters<typeof createUser>[0];
// string
```

### ConstructorParameters\<T\>

Extrait les paramètres du constructeur d'une classe.

```typescript
class UserService {
  constructor(private db: Database, private logger: Logger) {}
}

type Args = ConstructorParameters<typeof UserService>;
// [db: Database, logger: Logger]
```

### InstanceType\<T\>

Extrait le type d'instance d'un constructeur.

```typescript
class ApiClient {
  get(url: string) { ... }
  post(url: string, body: any) { ... }
}

type Client = InstanceType<typeof ApiClient>;
// ApiClient

// Cas d'usage : factory générique
function createInstance<T extends new (...args: any[]) => any>(
  Cls: T
): InstanceType<T> {
  return new Cls();
}
```

---

## 5. Types utilitaires — Promesses & Awaited

### Awaited\<T\>

Extrait le type résolu d'une Promise (récursif).

```typescript
type A = Awaited<Promise<string>>;
// string

type B = Awaited<Promise<Promise<number>>>;
// number

type C = Awaited<string>;
// string (non-Promise → inchangé)

// Cas d'usage
async function fetchUser(): Promise<{ id: number; name: string }> { ... }

type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: number; name: string }
```

---

## 6. Mapped Types

Les Mapped Types transforment les propriétés d'un type existant.

### Syntaxe de base

```typescript
// { [K in Keys]: Type }
type Flags<T> = { [K in keyof T]: boolean };

interface User { id: number; name: string; email: string; }
type UserFlags = Flags<User>;
// { id: boolean; name: boolean; email: boolean }
```

### Modifiers (+/-)

```typescript
// Rendre optionnel
type MyPartial<T> = { [K in keyof T]?: T[K] };

// Rendre obligatoire (enlever ?)
type MyRequired<T> = { [K in keyof T]-?: T[K] };

// Rendre readonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Enlever readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
```

### Remapper les clés avec `as`

```typescript
// Renommer les clés
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface User { id: number; name: string; }
type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string }

// Filtrer les clés (exclure certaines)
type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
};

// Garder seulement les propriétés string
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
};
```

---

## 7. Conditional Types

### Syntaxe

```typescript
T extends U ? TrueType : FalseType
```

### Exemples

```typescript
// Est-ce une string ?
type IsString<T> = T extends string ? true : false;
type A = IsString<string>;   // true
type B = IsString<number>;   // false

// Est-ce un tableau ?
type IsArray<T> = T extends any[] ? true : false;

// Extraire le type d'un tableau
type UnpackArray<T> = T extends (infer Item)[] ? Item : T;
type C = UnpackArray<string[]>;   // string
type D = UnpackArray<number>;     // number

// Conditional distribué sur les unions
type ToArray<T> = T extends any ? T[] : never;
type E = ToArray<string | number>;   // string[] | number[]
```

### NonNullable implémenté manuellement

```typescript
type MyNonNullable<T> = T extends null | undefined ? never : T;
```

---

## 8. Template Literal Types

```typescript
type Greeting = `Hello, ${string}`;
const g: Greeting = "Hello, World";   // OK
const g2: Greeting = "Bye";           // ❌

// Combinaison d'unions
type Direction = "top" | "bottom" | "left" | "right";
type Property = "margin" | "padding";
type CSSProp = `${Property}-${Direction}`;
// "margin-top" | "margin-bottom" | ... | "padding-right"  (8 combinaisons)

// Manipulation de casse
type Upper  = Uppercase<"hello">;    // "HELLO"
type Lower  = Lowercase<"HELLO">;    // "hello"
type Cap    = Capitalize<"hello">;   // "Hello"
type Uncap  = Uncapitalize<"Hello">; // "hello"

// Cas d'usage : event handlers
type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// Getters et setters typés
type Getter<T extends string> = `get${Capitalize<T>}`;
type Setter<T extends string> = `set${Capitalize<T>}`;
type G = Getter<"name">;  // "getName"
type S = Setter<"age">;   // "setAge"
```

---

## 9. Infer

`infer` permet d'extraire un type dans un Conditional Type.

```typescript
// Extraire le type de retour (comme ReturnType)
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extraire le type d'un tableau
type ElementType<T> = T extends (infer E)[] ? E : never;
type A = ElementType<string[]>;   // string
type B = ElementType<number[]>;   // number

// Extraire le type d'une Promise
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
type C = UnwrapPromise<Promise<string>>;  // string
type D = UnwrapPromise<number>;           // number

// Extraire le premier paramètre
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;
type F = FirstParam<(a: string, b: number) => void>;  // string

// Extraire les types d'un tuple
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never;
type H = Head<[string, number, boolean]>;  // string
type Ta = Tail<[string, number, boolean]>; // [number, boolean]
```

---

## 10. Index Types & Keyof

### keyof

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User;
// "id" | "name" | "email"

// Cas d'usage : accès typé à une propriété
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "Alice", email: "a@b.com" };
const name = getProperty(user, "name");   // string ✅
const id   = getProperty(user, "id");     // number ✅
// getProperty(user, "password");         // ❌ Erreur : pas une clé de User
```

### Indexed Access Types T[K]

```typescript
type User = { id: number; name: string; email: string };

type IdType    = User["id"];     // number
type NameType  = User["name"];   // string

// Plusieurs clés
type NameOrEmail = User["name" | "email"];  // string | string → string

// Avec keyof
type AnyPropType = User[keyof User];   // number | string

// Tableau : accéder au type des éléments
type Arr = string[];
type Elem = Arr[number];   // string

// Tuple
type Tuple = [string, number, boolean];
type Second = Tuple[1];    // number
type AllElems = Tuple[number];  // string | number | boolean
```

---

## 11. Discriminated Unions

Une union discriminée utilise une propriété commune (le "discriminant") pour différencier les membres.

```typescript
// ── Formes géométriques ────────────────────────────────────
interface Circle   { kind: "circle";   radius: number; }
interface Square   { kind: "square";   side: number; }
interface Triangle { kind: "triangle"; base: number; height: number; }

type Shape = Circle | Square | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.side ** 2;
    case "triangle": return (shape.base * shape.height) / 2;
    // TypeScript sait que tous les cas sont couverts
  }
}

// ── État d'une requête asynchrone ─────────────────────────
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error";   error: string };

function render<T>(state: RequestState<T>) {
  switch (state.status) {
    case "idle":    return "Prêt";
    case "loading": return "Chargement...";
    case "success": return `Données: ${JSON.stringify(state.data)}`;
    case "error":   return `Erreur: ${state.error}`;
  }
}

// ── Exhaustivité avec never ───────────────────────────────
function assertNever(value: never): never {
  throw new Error(`Cas non géré: ${JSON.stringify(value)}`);
}

function area2(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.side ** 2;
    case "triangle": return (shape.base * shape.height) / 2;
    default:         return assertNever(shape);  // ❌ Erreur si un cas est oublié
  }
}
```

---

## 12. Patterns courants

### Dictionnaire typé (Record vs Map)

```typescript
// Record : clés connues à la compilation
type Config = Record<"host" | "port" | "database", string>;

// Record : dictionnaire dynamique
const cache: Record<string, unknown> = {};

// Map : clés dynamiques, méthodes .get/.set/.has
const userMap = new Map<string, User>();
userMap.set("abc", { id: 1, name: "Alice", email: "a@b.com" });
userMap.get("abc");     // User | undefined
userMap.has("abc");     // boolean
```

### Grouper par clé

```typescript
function groupBy<T, K extends string>(
  items: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob",   role: "user"  },
  { name: "Carol", role: "admin" },
];

const byRole = groupBy(users, (u) => u.role);
// { admin: [{...}, {...}], user: [{...}] }
```

### Builder de Record typé

```typescript
// Construire un Record depuis un tableau
const permissions = ["read", "write", "delete"] as const;
type Permission = (typeof permissions)[number];  // "read" | "write" | "delete"

const defaultPerms: Record<Permission, boolean> = Object.fromEntries(
  permissions.map((p) => [p, false])
) as Record<Permission, boolean>;
// { read: false, write: false, delete: false }
```

### DeepPartial

```typescript
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface Config {
  server: { host: string; port: number };
  db: { url: string; pool: number };
}

type PartialConfig = DeepPartial<Config>;
// { server?: { host?: string; port?: number }; db?: { url?: string; pool?: number } }
```

### DeepReadonly

```typescript
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

### Flatten un Record

```typescript
// Aplatir Record<string, string[]> en string[]
const tagsByUser: Record<string, string[]> = {
  alice: ["ts", "nest"],
  bob:   ["react", "ts"],
};

const allTags = Object.values(tagsByUser).flat();
// ["ts", "nest", "react", "ts"]

const uniqueTags = [...new Set(allTags)];
// ["ts", "nest", "react"]
```

### Inverser un Record

```typescript
function invertRecord<K extends string, V extends string>(
  record: Record<K, V>
): Record<V, K> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [v, k])
  ) as Record<V, K>;
}

const codeToName: Record<string, string> = { fr: "France", de: "Allemagne" };
const nameToCode = invertRecord(codeToName);
// { France: "fr", Allemagne: "de" }
```

### Typage de `Object.entries` et `Object.keys`

```typescript
// Object.keys retourne string[] — peu pratique
const user = { id: 1, name: "Alice" };
const keys = Object.keys(user);           // string[]

// Helper typé
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

// Object.entries helper
function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

typedKeys(user);    // ("id" | "name")[]
typedEntries(user); // ["id" | "name", number | string][]
```

### Valider exhaustivement une union avec Record

```typescript
// Force à gérer tous les cas d'une union
type Status = "pending" | "active" | "banned";

// ✅ TypeScript vérifie que toutes les clés sont présentes
const statusMessages: Record<Status, string> = {
  pending: "En attente de validation",
  active:  "Compte actif",
  banned:  "Compte suspendu",
  // Si on oublie une clé → erreur de compilation ✅
};
```

### Partial Record (clés optionnelles)

```typescript
// Toutes les clés optionnelles (différent de Record)
type PartialRecord<K extends string, V> = Partial<Record<K, V>>;
// Équivalent : { [key in K]?: V }

type Overrides = PartialRecord<"color" | "size" | "weight", string>;
// { color?: string; size?: string; weight?: string }

const overrides: Overrides = { color: "red" };  // OK, size et weight omis
```

---

## 13. Aide-mémoire rapide

### Tous les types utilitaires natifs

```typescript
// ── Objets ──────────────────────────────────────────────────
Partial<T>                  // Toutes les props optionnelles
Required<T>                 // Toutes les props obligatoires
Readonly<T>                 // Toutes les props en lecture seule
Record<K, V>                // Objet avec clés K et valeurs V
Pick<T, K>                  // Garder seulement les clés K
Omit<T, K>                  // Supprimer les clés K

// ── Unions ──────────────────────────────────────────────────
Exclude<T, U>               // Retirer de T les membres de U
Extract<T, U>               // Garder de T les membres de U
NonNullable<T>              // Retirer null et undefined

// ── Fonctions ───────────────────────────────────────────────
ReturnType<T>               // Type de retour d'une fonction
Parameters<T>               // Tuple des paramètres
ConstructorParameters<T>    // Paramètres du constructeur
InstanceType<T>             // Type d'instance d'une classe

// ── Promesses ───────────────────────────────────────────────
Awaited<T>                  // Type résolu d'une Promise

// ── Strings (Template Literal) ──────────────────────────────
Uppercase<S>                // "HELLO"
Lowercase<S>                // "hello"
Capitalize<S>               // "Hello"
Uncapitalize<S>             // "hELLO"
```

### Record — cas d'usage en un coup d'œil

```typescript
Record<string, number>              // Dictionnaire quelconque
Record<"a" | "b" | "c", boolean>   // Union → toutes les clés requises
Record<Status, string>              // Enum → toutes les clés requises
Record<string, User>                // Dictionnaire id → entité
Record<string, string[]>            // Groupement
Partial<Record<K, V>>               // Clés optionnelles
Record<K, Record<K2, V>>            // Imbriqué (matrice, ACL...)
```

### Checklist types utilitaires

```
Record<K, V>  → dictionnaire ou table de correspondance
Partial<T>    → DTO de mise à jour, options de config
Omit<T, K>    → DTO sans les champs auto-générés (id, createdAt...)
Pick<T, K>    → DTO de réponse publique (sans password...)
Required<T>   → forcer la présence après merge d'options
Readonly<T>   → constantes, state immuable
ReturnType<>  → inférer le type de retour sans dupliquer
Awaited<>     → extraire le type d'une Promise
keyof T       → contraindre une clé à celles d'un objet
T[K]          → accéder au type d'une propriété
```

---

*Bonne chance pour ton exam ! 🎯*
