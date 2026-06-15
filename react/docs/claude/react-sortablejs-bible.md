# 📘 react-sortablejs — Bible Complète

> **Guide de référence complet** — Drag & Drop avec `react-sortablejs` (basé sur SortableJS).

---

## 📚 Table des Matières

1. [Installation & Dépendances](#1-installation--dépendances)
2. [Concepts Fondamentaux](#2-concepts-fondamentaux)
3. [Composant ReactSortable](#3-composant-reactsortable)
4. [Props — Référence Complète](#4-props--référence-complète)
5. [Options SortableJS Passées via Props](#5-options-sortablejs-passées-via-props)
6. [Événements (onXxx)](#6-événements-onxxx)
7. [Exemples de Base](#7-exemples-de-base)
8. [Listes Multiples (Partage entre listes)](#8-listes-multiples-partage-entre-listes)
9. [Drag Handle Personnalisé](#9-drag-handle-personnalisé)
10. [Clonage d'éléments](#10-clonage-déléments)
11. [Groupes & Restrictions de déplacement](#11-groupes--restrictions-de-déplacement)
12. [Tri avec état complexe (objets)](#12-tri-avec-état-complexe-objets)
13. [Utilisation avec des composants custom (tag)](#13-utilisation-avec-des-composants-custom-tag)
14. [SortableJS natif dans React (ref)](#14-sortablejs-natif-dans-react-ref)
15. [TypeScript — Typage](#15-typescript--typage)
16. [Cas d'usage avancés](#16-cas-dusage-avancés)
17. [Cheatsheet rapide](#17-cheatsheet-rapide)

---

## 1. Installation & Dépendances

### NPM / Yarn

```bash
# Avec npm
npm install react-sortablejs sortablejs

# Avec yarn
yarn add react-sortablejs sortablejs

# Types TypeScript (si nécessaire)
npm install --save-dev @types/sortablejs
```

### Dépendances requises

| Package | Rôle |
|---------|------|
| `sortablejs` | Librairie JS de drag & drop (peer dep) |
| `react-sortablejs` | Wrapper React pour SortableJS |
| `react` / `react-dom` | ≥ v16.8 (hooks requis) |

### Import dans le composant

```tsx
import { ReactSortable } from 'react-sortablejs';
// ou
import ReactSortable from 'react-sortablejs'; // si default export
```

---

## 2. Concepts Fondamentaux

### Principe de base

`react-sortablejs` est un wrapper React autour de **SortableJS**.

- Il gère la mise à jour d'état via `setList` à chaque réorganisation
- Chaque élément de la liste **doit avoir un `id` unique**
- Le composant `<ReactSortable>` remplace le conteneur natif (div, ul, etc.)

### Architecture

```
<ReactSortable list={items} setList={setItems}>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</ReactSortable>
```

**Ce qui se passe :**
1. L'utilisateur glisse un élément
2. SortableJS réorganise le DOM
3. `setList` est appelé avec le nouveau tableau ordonné
4. React re-render avec le nouvel état

### Règle d'or : l'ID est obligatoire

```tsx
// ✅ Correct
const [items, setItems] = useState([
  { id: 1, name: 'Item A' },
  { id: 2, name: 'Item B' },
]);

// ❌ Incorrect — pas d'id → bug de tri
const [items, setItems] = useState(['Item A', 'Item B']);
```

---

## 3. Composant ReactSortable

### Signature complète

```tsx
<ReactSortable
  // Requis
  list={items}               // ItemInterface[] — tableau d'état
  setList={setItems}         // Dispatch<SetStateAction<ItemInterface[]>>

  // Optionnel — wrapper HTML
  tag="ul"                   // string | React.ComponentType (défaut: "div")
  className="ma-liste"
  style={{ padding: '10px' }}

  // Options SortableJS (voir section 5)
  group="shared"
  animation={150}
  handle=".drag-handle"
  filter=".non-draggable"
  ghostClass="ghost"
  chosenClass="chosen"
  dragClass="dragging"
  disabled={false}
  sort={true}
  delay={0}
  delayOnTouchOnly={false}
  touchStartThreshold={0}
  forceFallback={false}
  fallbackClass="fallback"
  fallbackOnBody={false}
  fallbackTolerance={0}
  scroll={true}
  scrollFn={...}
  scrollSensitivity={30}
  scrollSpeed={10}
  bubbleScroll={true}
  dataIdAttr="data-id"
  direction="vertical"
  removeCloneOnHide={true}
  emptyInsertThreshold={5}
  swap={false}
  swapClass="highlight"
  invertSwap={false}
  invertedSwapThreshold={1}
  multiDrag={false}
  selectedClass="selected"

  // Événements
  onStart={handleStart}
  onEnd={handleEnd}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onUpdate={handleUpdate}
  onSort={handleSort}
  onFilter={handleFilter}
  onMove={handleMove}
  onClone={handleClone}
  onChange={handleChange}

  // Clone
  clone={item => ({ ...item, id: Math.random() })}
>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ReactSortable>
```

---

## 4. Props — Référence Complète

### Props propres à ReactSortable

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `list` | `ItemInterface[]` | ✅ | Le tableau d'état à trier |
| `setList` | `(items: ItemInterface[]) => void` | ✅ | Setter d'état (du useState) |
| `tag` | `string \| ComponentType` | ❌ | Balise HTML ou composant wrapper (défaut: `"div"`) |
| `clone` | `(item: T) => T` | ❌ | Fonction de clonage (pour `pull: 'clone'`) |
| `onSpill` | `SortableEvent => void` | ❌ | Appelé quand un élément est rejeté hors d'un groupe |

### Interface ItemInterface

Chaque objet de la liste doit implémenter :

```ts
interface ItemInterface {
  id: string | number;  // OBLIGATOIRE et UNIQUE
  [key: string]: any;   // autres propriétés libres
}
```

---

## 5. Options SortableJS Passées via Props

### Comportement général

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `animation` | `number` | `0` | Durée animation en ms (ex: 150) |
| `sort` | `boolean` | `true` | Autoriser le tri dans la liste |
| `disabled` | `boolean` | `false` | Désactiver complètement le drag |
| `delay` | `number` | `0` | Délai avant le début du drag (ms) |
| `delayOnTouchOnly` | `boolean` | `false` | Appliquer le délai seulement au tactile |
| `touchStartThreshold` | `number` | `0` | Distance de mouvement avant drag (px) |
| `direction` | `"horizontal" \| "vertical"` | auto | Direction du tri |
| `dataIdAttr` | `string` | `"data-id"` | Attribut HTML utilisé comme ID |

### Classes CSS

| Prop | Type | Description |
|------|------|-------------|
| `ghostClass` | `string` | Classe de l'élément "fantôme" (placeholder) |
| `chosenClass` | `string` | Classe de l'élément en cours de drag |
| `dragClass` | `string` | Classe de l'élément clone en déplacement |
| `fallbackClass` | `string` | Classe lors du mode fallback |
| `selectedClass` | `string` | Classe des éléments sélectionnés (multiDrag) |
| `swapClass` | `string` | Classe de l'élément cible (plugin Swap) |

### Handle & Filter

| Prop | Type | Description |
|------|------|-------------|
| `handle` | `string` | Sélecteur CSS de la poignée de drag |
| `filter` | `string \| Function` | Sélecteur CSS des éléments non-draggables |
| `preventOnFilter` | `boolean` | Appeler `preventDefault()` sur les éléments filtrés |

### Groupes (multi-listes)

| Prop | Type | Description |
|------|------|-------------|
| `group` | `string \| GroupOptions` | Nom du groupe ou objet de configuration |

```ts
// Chaîne simple
group="shared"

// Objet complet
group={{
  name: 'shared',
  pull: true,        // true | false | 'clone' | Function
  put: true,         // true | false | string[] | Function
  revertClone: false
}}
```

### Scroll automatique

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `scroll` | `boolean \| HTMLElement` | `true` | Activer le scroll auto |
| `scrollSensitivity` | `number` | `30` | Distance déclenchant le scroll (px) |
| `scrollSpeed` | `number` | `10` | Vitesse du scroll (px/frame) |
| `bubbleScroll` | `boolean` | `true` | Scroll sur les parents aussi |
| `scrollFn` | `Function` | — | Fonction de scroll personnalisée |

### Fallback (compatibilité)

| Prop | Type | Description |
|------|------|-------------|
| `forceFallback` | `boolean` | Forcer l'utilisation du fallback HTML5 |
| `fallbackOnBody` | `boolean` | Ajouter le clone au body |
| `fallbackTolerance` | `number` | Distance avant considérer comme drag |

### Swap (plugin)

| Prop | Type | Description |
|------|------|-------------|
| `swap` | `boolean` | Activer le plugin Swap |
| `swapClass` | `string` | Classe CSS de la cible |
| `invertSwap` | `boolean` | Inverser la zone de swap |
| `invertedSwapThreshold` | `number` | Seuil de swap inversé |

### MultiDrag (plugin)

| Prop | Type | Description |
|------|------|-------------|
| `multiDrag` | `boolean` | Activer la sélection multiple |
| `selectedClass` | `string` | Classe des éléments sélectionnés |
| `multiDragKey` | `string` | Touche modificatrice (ex: `"CTRL"`) |
| `avoidImplicitDeselect` | `boolean` | Ne pas désélectionner sans touche |

### Autres

| Prop | Type | Description |
|------|------|-------------|
| `emptyInsertThreshold` | `number` | Distance pour insérer dans une liste vide |
| `removeCloneOnHide` | `boolean` | Supprimer le clone quand caché |

---

## 6. Événements (onXxx)

Tous les événements reçoivent un objet `SortableEvent`.

### Structure de SortableEvent

```ts
interface SortableEvent {
  from: HTMLElement;      // Conteneur source
  to: HTMLElement;        // Conteneur destination
  item: HTMLElement;      // Élément déplacé
  clone: HTMLElement;     // Élément cloné (si clone)
  oldIndex: number;       // Index de départ
  newIndex: number;       // Index d'arrivée
  oldDraggableIndex: number;
  newDraggableIndex: number;
  originalEvent: MouseEvent | TouchEvent;
  pullMode: string | boolean;
}
```

### Tableau des événements

| Événement | Déclenchement |
|-----------|---------------|
| `onStart` | Début du drag |
| `onEnd` | Fin du drag (relâchement) |
| `onAdd` | Élément ajouté depuis une autre liste |
| `onRemove` | Élément retiré vers une autre liste |
| `onUpdate` | Ordre changé dans la même liste |
| `onSort` | Toute modification de tri |
| `onFilter` | Tentative de drag sur un élément filtré |
| `onMove` | Pendant le déplacement (retourne `false` pour bloquer) |
| `onClone` | Élément cloné |
| `onChange` | Tout changement (plus générique) |
| `onSpill` | Élément rejeté hors du groupe autorisé |

### Exemples d'utilisation

```tsx
<ReactSortable
  list={items}
  setList={setItems}
  onStart={(evt) => {
    console.log('Drag started, old index:', evt.oldIndex);
  }}
  onEnd={(evt) => {
    console.log(`De ${evt.oldIndex} vers ${evt.newIndex}`);
  }}
  onAdd={(evt) => {
    console.log('Ajouté depuis une autre liste');
  }}
  onRemove={(evt) => {
    console.log('Retiré vers une autre liste');
  }}
  onMove={(evt, originalEvt) => {
    // Retourner false pour annuler le déplacement
    if (evt.related.classList.contains('no-drop')) {
      return false;
    }
    return true;
  }}
>
```

---

## 7. Exemples de Base

### Liste simple draggable

```tsx
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface Item {
  id: number;
  name: string;
}

export default function SimpleList() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ]);

  return (
    <ReactSortable
      list={items}
      setList={setItems}
      animation={150}
    >
      {items.map((item) => (
        <div key={item.id} style={{ padding: '8px', border: '1px solid #ccc', marginBottom: '4px', cursor: 'grab' }}>
          {item.name}
        </div>
      ))}
    </ReactSortable>
  );
}
```

### Liste avec styles "ghost" et "chosen"

```tsx
<ReactSortable
  list={items}
  setList={setItems}
  animation={200}
  ghostClass="ghost"
  chosenClass="chosen"
  dragClass="dragging"
>
  {items.map(item => (
    <div key={item.id} className="sortable-item">{item.name}</div>
  ))}
</ReactSortable>
```

```css
/* CSS associé */
.sortable-item {
  padding: 10px 15px;
  margin: 5px 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  transition: background 0.2s;
}

/* Placeholder fantôme */
.ghost {
  opacity: 0.4;
  background: #c8ebfb;
}

/* Élément sélectionné */
.chosen {
  background: #e3f2fd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Élément en train d'être déplacé */
.dragging {
  transform: rotate(2deg);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
```

### Liste en tant que `<ul>` avec `<li>`

```tsx
<ReactSortable
  tag="ul"
  list={items}
  setList={setItems}
  animation={150}
  style={{ listStyle: 'none', padding: 0 }}
>
  {items.map(item => (
    <li key={item.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
      📌 {item.name}
    </li>
  ))}
</ReactSortable>
```

### Afficher l'ordre actuel en temps réel

```tsx
export default function LiveOrder() {
  const [items, setItems] = useState([
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
    { id: 3, name: 'Gamma' },
  ]);

  return (
    <div>
      <ReactSortable list={items} setList={setItems} animation={150}>
        {items.map(item => (
          <div key={item.id} style={{ padding: '10px', background: '#f0f0f0', margin: '5px' }}>
            {item.name}
          </div>
        ))}
      </ReactSortable>

      <div style={{ marginTop: '20px' }}>
        <strong>Ordre actuel :</strong>
        <pre>{JSON.stringify(items.map(i => i.name), null, 2)}</pre>
      </div>
    </div>
  );
}
```

---

## 8. Listes Multiples (Partage entre listes)

### Principe

- Les listes du **même groupe** (`group="nom"`) peuvent échanger des éléments
- `setList` de chaque liste est appelé lors d'un transfert

```tsx
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface Task {
  id: number;
  name: string;
}

export default function KanbanBoard() {
  const [todo, setTodo] = useState<Task[]>([
    { id: 1, name: 'Tâche A' },
    { id: 2, name: 'Tâche B' },
  ]);

  const [inProgress, setInProgress] = useState<Task[]>([
    { id: 3, name: 'Tâche C' },
  ]);

  const [done, setDone] = useState<Task[]>([
    { id: 4, name: 'Tâche D' },
  ]);

  const columnStyle = {
    width: '200px',
    minHeight: '200px',
    padding: '10px',
    background: '#f4f5f7',
    borderRadius: '4px',
  };

  const itemStyle = {
    padding: '8px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'grab',
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div>
        <h3>À faire</h3>
        <ReactSortable
          list={todo}
          setList={setTodo}
          group="kanban"
          animation={150}
          style={columnStyle}
        >
          {todo.map(task => (
            <div key={task.id} style={itemStyle}>{task.name}</div>
          ))}
        </ReactSortable>
      </div>

      <div>
        <h3>En cours</h3>
        <ReactSortable
          list={inProgress}
          setList={setInProgress}
          group="kanban"
          animation={150}
          style={columnStyle}
        >
          {inProgress.map(task => (
            <div key={task.id} style={itemStyle}>{task.name}</div>
          ))}
        </ReactSortable>
      </div>

      <div>
        <h3>Terminé</h3>
        <ReactSortable
          list={done}
          setList={setDone}
          group="kanban"
          animation={150}
          style={columnStyle}
        >
          {done.map(task => (
            <div key={task.id} style={itemStyle}>{task.name}</div>
          ))}
        </ReactSortable>
      </div>
    </div>
  );
}
```

---

## 9. Drag Handle Personnalisé

Permet de restreindre le drag à une zone spécifique de l'élément (icône, bouton...).

```tsx
<ReactSortable
  list={items}
  setList={setItems}
  handle=".drag-handle"   // ← Sélecteur CSS de la poignée
  animation={150}
>
  {items.map(item => (
    <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', border: '1px solid #ccc', marginBottom: '4px' }}>
      {/* Poignée drag */}
      <span className="drag-handle" style={{ cursor: 'grab', marginRight: '10px', fontSize: '18px' }}>
        ⠿
      </span>
      {/* Contenu cliquable normalement */}
      <span>{item.name}</span>
      <button style={{ marginLeft: 'auto' }} onClick={() => alert(item.name)}>
        Cliquer
      </button>
    </div>
  ))}
</ReactSortable>
```

> ✅ Avec `handle`, seule la zone `.drag-handle` déclenche le drag.  
> Les boutons et liens à l'intérieur de l'élément fonctionnent normalement.

---

## 10. Clonage d'éléments

Avec `pull: 'clone'`, l'élément source reste en place et une copie est créée dans la liste cible.

```tsx
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface Block {
  id: number;
  label: string;
}

let nextId = 100;

export default function CloneExample() {
  const [palette, setPalette] = useState<Block[]>([
    { id: 1, label: 'Bloc Texte' },
    { id: 2, label: 'Bloc Image' },
    { id: 3, label: 'Bloc Vidéo' },
  ]);

  const [canvas, setCanvas] = useState<Block[]>([]);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Palette (source avec clone) */}
      <div>
        <h3>Palette</h3>
        <ReactSortable
          list={palette}
          setList={setPalette}
          group={{
            name: 'builder',
            pull: 'clone',  // Clone au lieu de déplacer
            put: false,      // Ne pas accepter de retour
          }}
          sort={false}       // Pas de tri dans la palette
          animation={150}
          clone={(item) => ({ ...item, id: nextId++ })}  // Nouvel ID pour le clone
          style={{ minHeight: '100px', padding: '10px', background: '#e8f4f8' }}
        >
          {palette.map(block => (
            <div key={block.id} style={{ padding: '8px', background: 'white', border: '1px solid #aaa', marginBottom: '4px', cursor: 'copy' }}>
              {block.label}
            </div>
          ))}
        </ReactSortable>
      </div>

      {/* Canvas (destination) */}
      <div>
        <h3>Canvas</h3>
        <ReactSortable
          list={canvas}
          setList={setCanvas}
          group={{
            name: 'builder',
            pull: true,
            put: true,
          }}
          animation={150}
          style={{ minHeight: '200px', padding: '10px', background: '#f9f9f9', border: '2px dashed #ccc' }}
        >
          {canvas.map(block => (
            <div key={block.id} style={{ padding: '8px', background: 'white', border: '1px solid #ddd', marginBottom: '4px' }}>
              {block.label} (id: {block.id})
            </div>
          ))}
        </ReactSortable>
      </div>
    </div>
  );
}
```

---

## 11. Groupes & Restrictions de déplacement

### Groupe basique (bidirectionnel)

```tsx
// Les deux listes acceptent les éléments de l'autre
<ReactSortable group="shared" list={listA} setList={setListA}>...</ReactSortable>
<ReactSortable group="shared" list={listB} setList={setListB}>...</ReactSortable>
```

### Groupe unidirectionnel (A → B seulement)

```tsx
// Liste A : peut envoyer, mais pas recevoir
<ReactSortable
  list={listA}
  setList={setListA}
  group={{ name: 'flow', pull: true, put: false }}
>...</ReactSortable>

// Liste B : peut recevoir, mais pas envoyer
<ReactSortable
  list={listB}
  setList={setListB}
  group={{ name: 'flow', pull: false, put: true }}
>...</ReactSortable>
```

### Groupe avec liste blanche

```tsx
// Accepter seulement depuis les groupes "liste1" et "liste3"
<ReactSortable
  list={listB}
  setList={setListB}
  group={{ name: 'liste2', put: ['liste1', 'liste3'] }}
>
```

### Restriction par fonction

```tsx
<ReactSortable
  list={listB}
  setList={setListB}
  group={{
    name: 'custom',
    put: (to, from, dragEl) => {
      // Autoriser seulement si l'élément a la classe "allowed"
      return dragEl.classList.contains('allowed');
    },
    pull: (to, from) => {
      // Autoriser seulement si destination a au moins 1 élément
      return to.el.children.length > 0;
    }
  }}
>
```

### Résumé GroupOptions

```ts
interface GroupOptions {
  name: string;                         // Nom du groupe
  pull?: boolean | 'clone' | Function;  // Comportement sortant
  put?: boolean | string[] | Function;  // Comportement entrant
  revertClone?: boolean;               // Remettre le clone à sa place après drop
}
```

---

## 12. Tri avec état complexe (objets)

### Objets imbriqués

```tsx
interface Project {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: 'Site Web', priority: 'high', tags: ['react', 'ts'] },
    { id: 2, title: 'API REST', priority: 'medium', tags: ['node'] },
    { id: 3, title: 'Mobile App', priority: 'low', tags: ['react-native'] },
  ]);

  const priorityColors = {
    high: '#ffebee',
    medium: '#fff8e1',
    low: '#e8f5e9',
  };

  return (
    <ReactSortable
      list={projects}
      setList={setProjects}
      animation={200}
      ghostClass="ghost-item"
    >
      {projects.map(project => (
        <div
          key={project.id}
          style={{
            padding: '12px',
            marginBottom: '8px',
            background: priorityColors[project.priority],
            borderRadius: '6px',
            cursor: 'grab',
          }}
        >
          <strong>{project.title}</strong>
          <span style={{ float: 'right', fontSize: '12px' }}>
            {project.priority}
          </span>
          <div style={{ marginTop: '4px' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{ background: '#ddd', borderRadius: '3px', padding: '2px 6px', marginRight: '4px', fontSize: '11px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </ReactSortable>
  );
}
```

### Persistance après réorganisation

```tsx
const handleSetList = (newList: Project[]) => {
  setProjects(newList);

  // Sauvegarder en base ou localStorage
  const order = newList.map(p => p.id);
  localStorage.setItem('project-order', JSON.stringify(order));
  // ou : await api.saveOrder(order);
};

<ReactSortable list={projects} setList={handleSetList} ...>
```

---

## 13. Utilisation avec des composants custom (tag)

### Prop `tag` avec string HTML

```tsx
// Liste ordonnée
<ReactSortable tag="ol" list={items} setList={setItems}>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ReactSortable>

// Section
<ReactSortable tag="section" list={items} setList={setItems}>
  {items.map(item => <article key={item.id}>{item.name}</article>)}
</ReactSortable>

// Table body
<table>
  <tbody>
    <ReactSortable tag="tbody" list={rows} setList={setRows}>
      {rows.map(row => (
        <tr key={row.id}>
          <td>{row.col1}</td>
          <td>{row.col2}</td>
        </tr>
      ))}
    </ReactSortable>
  </tbody>
</table>
```

> ⚠️ **Problème connu** : utiliser `<ReactSortable tag="tbody">` directement dans `<table>` peut provoquer des warnings React car ReactSortable crée un `<div>` intermédiaire. Utiliser `forwardRef` dans ce cas.

### Prop `tag` avec composant React (forwardRef)

Pour utiliser un composant stylé comme conteneur :

```tsx
import React, { forwardRef } from 'react';
import { ReactSortable } from 'react-sortablejs';

// Composant conteneur avec forwardRef OBLIGATOIRE
const CustomList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} className="custom-sortable-list" {...props}>
      {children}
    </div>
  )
);
CustomList.displayName = 'CustomList';

// Utilisation
<ReactSortable
  tag={CustomList}
  list={items}
  setList={setItems}
  animation={150}
>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</ReactSortable>
```

### Avec un composant stylé (styled-components)

```tsx
import styled from 'styled-components';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f9f9f9;
  border: 2px dashed #ccc;
  border-radius: 8px;
  min-height: 100px;
`;

// styled-components retourne déjà un composant avec forwardRef
<ReactSortable tag={StyledList} list={items} setList={setItems}>
  ...
</ReactSortable>
```

---

## 14. SortableJS natif dans React (ref)

Pour accéder directement à l'instance SortableJS :

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { ReactSortable, SortableEvent } from 'react-sortablejs';

export default function WithRef() {
  const sortableRef = useRef<any>(null);
  const [items, setItems] = useState([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]);

  useEffect(() => {
    if (sortableRef.current) {
      // Accéder à l'instance SortableJS
      const sortableInstance = sortableRef.current.sortable;
      console.log('SortableJS instance:', sortableInstance);

      // Désactiver programmatiquement
      // sortableInstance.option('disabled', true);
    }
  }, []);

  return (
    <ReactSortable
      ref={sortableRef}
      list={items}
      setList={setItems}
    >
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
}
```

---

## 15. TypeScript — Typage

### Import des types

```ts
import {
  ReactSortable,
  SortableEvent,
  SortableMoveEvent,
  ItemInterface,
  ReactSortableProps,
  Store,
  GroupOptions,
} from 'react-sortablejs';
```

### Typer une liste correctement

```ts
// Interface de base
interface MyItem extends ItemInterface {
  id: number;          // REQUIS (défini dans ItemInterface)
  name: string;
  description?: string;
  order?: number;
}

// useState typé
const [items, setItems] = useState<MyItem[]>([]);
```

### Composant typé complet

```tsx
import React, { useState } from 'react';
import { ReactSortable, ItemInterface, SortableEvent } from 'react-sortablejs';

interface Task extends ItemInterface {
  id: number;
  title: string;
  done: boolean;
}

interface SortableListProps {
  initialTasks: Task[];
  onOrderChange?: (tasks: Task[]) => void;
}

const SortableList: React.FC<SortableListProps> = ({ initialTasks, onOrderChange }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleSetList = (newTasks: Task[]) => {
    setTasks(newTasks);
    onOrderChange?.(newTasks);
  };

  const handleEnd = (evt: SortableEvent) => {
    console.log(`Déplacé de l'index ${evt.oldIndex} vers ${evt.newIndex}`);
  };

  return (
    <ReactSortable<Task>
      list={tasks}
      setList={handleSetList}
      animation={150}
      onEnd={handleEnd}
    >
      {tasks.map(task => (
        <div key={task.id}>
          {task.done ? '✅' : '⬜'} {task.title}
        </div>
      ))}
    </ReactSortable>
  );
};
```

### Typer les événements

```ts
import { SortableEvent, SortableMoveEvent } from 'react-sortablejs';

// onEnd, onStart, onAdd, onRemove, onUpdate, onSort
const handleEnd = (evt: SortableEvent): void => {
  const { oldIndex, newIndex, from, to, item } = evt;
};

// onMove (retourne boolean ou -1)
const handleMove = (evt: SortableMoveEvent, originalEvt: MouseEvent): boolean | -1 => {
  return true; // autoriser
};
```

---

## 16. Cas d'usage avancés

### Liste avec filtre (éléments non-draggables)

```tsx
<ReactSortable
  list={items}
  setList={setItems}
  filter=".locked"            // Éléments avec classe "locked" = non draggables
  preventOnFilter={true}
  animation={150}
>
  {items.map(item => (
    <div
      key={item.id}
      className={item.locked ? 'locked' : ''}
      style={{ cursor: item.locked ? 'not-allowed' : 'grab', padding: '8px', marginBottom: '4px', background: item.locked ? '#f5f5f5' : 'white', border: '1px solid #ddd' }}
    >
      {item.locked ? '🔒' : '⠿'} {item.name}
    </div>
  ))}
</ReactSortable>
```

### Listes imbriquées (nested sortable)

```tsx
interface TreeNode extends ItemInterface {
  id: number;
  name: string;
  children: TreeNode[];
}

function NestedList({ nodes, setNodes }: { nodes: TreeNode[]; setNodes: (n: TreeNode[]) => void }) {
  return (
    <ReactSortable
      list={nodes}
      setList={setNodes}
      group="nested"
      animation={150}
      style={{ paddingLeft: '20px' }}
    >
      {nodes.map(node => (
        <div key={node.id}>
          <div style={{ padding: '6px', background: '#eee', marginBottom: '4px', cursor: 'grab' }}>
            {node.name}
          </div>
          {node.children.length > 0 && (
            <NestedList
              nodes={node.children}
              setNodes={(newChildren) => {
                setNodes(nodes.map(n =>
                  n.id === node.id ? { ...n, children: newChildren } : n
                ));
              }}
            />
          )}
        </div>
      ))}
    </ReactSortable>
  );
}
```

### Réinitialiser l'ordre

```tsx
const [items, setItems] = useState(initialItems);
const [originalItems] = useState(initialItems);

const handleReset = () => setItems([...originalItems]);

<button onClick={handleReset}>Réinitialiser l'ordre</button>
<ReactSortable list={items} setList={setItems} animation={150}>
  ...
</ReactSortable>
```

### Drag & Drop avec suppression

```tsx
const handleRemove = (id: number) => {
  setItems(prev => prev.filter(item => item.id !== id));
};

<ReactSortable list={items} setList={setItems} animation={150}>
  {items.map(item => (
    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #ddd', marginBottom: '4px' }}>
      <span style={{ cursor: 'grab' }}>⠿ {item.name}</span>
      <button onClick={() => handleRemove(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}>
        ✕
      </button>
    </div>
  ))}
</ReactSortable>
```

### Désactiver/Activer le tri dynamiquement

```tsx
const [isLocked, setIsLocked] = useState(false);

<button onClick={() => setIsLocked(prev => !prev)}>
  {isLocked ? '🔓 Déverrouiller' : '🔒 Verrouiller'}
</button>

<ReactSortable
  list={items}
  setList={setItems}
  disabled={isLocked}      // ← désactive le drag
  animation={150}
>
  ...
</ReactSortable>
```

### Drag horizontal

```tsx
<ReactSortable
  list={items}
  setList={setItems}
  direction="horizontal"
  animation={150}
  style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}
>
  {items.map(item => (
    <div
      key={item.id}
      style={{ padding: '10px 20px', background: '#3498db', color: 'white', borderRadius: '4px', cursor: 'grab', flexShrink: 0 }}
    >
      {item.name}
    </div>
  ))}
</ReactSortable>
```

### Avec useCallback pour optimiser

```tsx
import React, { useState, useCallback } from 'react';
import { ReactSortable, ItemInterface } from 'react-sortablejs';

interface Item extends ItemInterface {
  id: number;
  name: string;
}

export default function Optimized() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ]);

  // Mémoiser le setter pour éviter des re-renders inutiles
  const handleSetList = useCallback((newList: Item[]) => {
    setItems(newList);
  }, []);

  return (
    <ReactSortable list={items} setList={handleSetList} animation={150}>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
}
```

### Sauvegarde automatique à chaque drag

```tsx
const [items, setItems] = useState<Item[]>(initialData);

const handleSetList = async (newList: Item[]) => {
  setItems(newList);

  try {
    await fetch('/api/items/order', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newList.map(i => i.id) }),
    });
  } catch (err) {
    console.error('Échec de la sauvegarde:', err);
    // Remettre l'ancien ordre si erreur
    setItems(items);
  }
};
```

### Delay sur mobile uniquement

```tsx
<ReactSortable
  list={items}
  setList={setItems}
  delay={500}               // 500ms de délai
  delayOnTouchOnly={true}   // Seulement sur écran tactile
  touchStartThreshold={3}   // 3px de mouvement avant drag
>
```

---

## 17. Cheatsheet rapide

### Props essentielles

```tsx
<ReactSortable
  list={items}           // ← État (tableau avec id)
  setList={setItems}     // ← Setter de l'état
  animation={150}        // ← Animation fluide (ms)
  group="nom"            // ← Partage entre listes
  handle=".handle"       // ← Poignée de drag
  filter=".locked"       // ← Éléments non-draggables
  disabled={false}       // ← Désactiver le drag
  sort={true}            // ← Autoriser le tri
  ghostClass="ghost"     // ← Classe du placeholder
  chosenClass="chosen"   // ← Classe de l'élément actif
  clone={item => ({...item, id: newId()})}  // ← Clone
  onEnd={evt => ...}     // ← Événement fin de drag
>
```

### Tableau récapitulatif des événements

| Événement | Quand ? | Paramètre |
|-----------|---------|-----------|
| `onStart` | Début du drag | `SortableEvent` |
| `onEnd` | Fin du drag | `SortableEvent` |
| `onAdd` | Ajout depuis autre liste | `SortableEvent` |
| `onRemove` | Retrait vers autre liste | `SortableEvent` |
| `onUpdate` | Tri dans la même liste | `SortableEvent` |
| `onSort` | Tout changement de tri | `SortableEvent` |
| `onMove` | Pendant déplacement | `SortableMoveEvent` |
| `onClone` | Clonage | `SortableEvent` |
| `onFilter` | Drag sur filtré | `SortableEvent` |

### Configuration de groupe

```ts
// Simple (nom uniquement, bidirectionnel)
group="shared"

// Clone (source garde ses éléments)
group={{ name: 'g', pull: 'clone', put: false }}

// Unidirectionnel (source → destination seulement)
// Source:
group={{ name: 'g', pull: true, put: false }}
// Destination:
group={{ name: 'g', pull: false, put: true }}

// Liste blanche
group={{ name: 'dest', put: ['sourceA', 'sourceB'] }}
```

### Problèmes fréquents et solutions

| Problème | Cause | Solution |
|---------|-------|----------|
| Items ne se trient pas | Pas d'`id` dans les objets | Ajouter `id` unique à chaque objet |
| Bugs visuels après drag | IDs dupliqués | Vérifier l'unicité des IDs |
| `setList` non appelé | Pas de changement détecté | Vérifier que les IDs sont bien définis |
| Composant custom ne marche pas | Pas de `forwardRef` | Entourer le composant avec `forwardRef` |
| Tooltips/Click ne marchent pas | drag déclenché trop tôt | Utiliser `delay` ou `handle` |
| Listes imbriquées conflictuelles | Même groupe sur parent et enfant | Utiliser des groupes différents ou gérer `put` |
| Clones ont même ID | Pas de fonction `clone` | Définir prop `clone={(item) => ({...item, id: newId()})}` |

### Structure type d'un item

```ts
// Minimum requis
{ id: number | string }

// Exemple complet
interface Item extends ItemInterface {
  id: number;          // OBLIGATOIRE
  name: string;
  selected?: boolean;
  locked?: boolean;
  order?: number;
}
```

### Template complet minimal

```tsx
import React, { useState } from 'react';
import { ReactSortable, ItemInterface } from 'react-sortablejs';

interface Item extends ItemInterface {
  id: number;
  name: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Premier' },
    { id: 2, name: 'Deuxième' },
    { id: 3, name: 'Troisième' },
  ]);

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Liste triable</h2>
      <ReactSortable
        list={items}
        setList={setItems}
        animation={200}
        ghostClass="ghost"
        chosenClass="chosen"
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '12px 16px',
              marginBottom: '6px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              cursor: 'grab',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              userSelect: 'none',
            }}
          >
            ⠿ {item.name}
          </div>
        ))}
      </ReactSortable>

      <hr style={{ margin: '20px 0' }} />
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify(items.map(i => i.name), null, 2)}
      </pre>
    </div>
  );
}
```

---

> **📌 Points clés à retenir :**
> - Chaque item **doit avoir un `id` unique** — sans ça, rien ne marche
> - `setList` est appelé automatiquement par le composant après chaque réorganisation
> - `group` = partage entre plusieurs listes (même nom = même groupe)
> - `handle` = zone de drag restreinte (les boutons et liens restent cliquables)
> - `clone` = la source reste intacte, une copie est créée à destination
> - Les composants custom comme `tag` nécessitent **forwardRef**
> - Tooltips et Popovers nécessitent une initialisation JS — pas nécessaire ici
> - `animation={150}` ou `200` = transition fluide recommandée

---

*📅 Référence basée sur react-sortablejs v6.x / SortableJS v1.15.x*



import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import Sortable, { Swap } from 'sortablejs';

// Activer le plugin Swap pour SortableJS
Sortable.mount(new Swap());

export function SwapList() {
  const [state, setState] = useState([
    { id: 1, name: "Élément A" },
    { id: 2, name: "Élément B" },
    { id: 3, name: "Élément C" },
    { id: 4, name: "Élément D" }
  ]);

  const handleEnd = (evt) => {
    const { oldIndex, newIndex } = evt;

    // Si l'élément est relâché au même endroit, on ne fait rien
    if (oldIndex === newIndex) return;

    // Créer une copie de l'état actuel pour le modifier
    const newState = [...state];

    // Échanger (swap) directement les deux éléments dans le tableau
    const temp = newState[oldIndex];
    newState[oldIndex] = newState[newIndex];
    newState[newIndex] = temp;

    // Mettre à jour le state de React avec le nouveau tableau swappé
    setState(newState);
  };

  return (
    {/* 
      1. swap: true -> Active le comportement visuel de swap du plugin
      2. setList: () => {} -> Bloque la mise à jour automatique de react-sortablejs 
         pour nous laisser le contrôle total dans onEnd
    */}
    <ReactSortable 
      list={state} 
      setList={() => {}} 
      onEnd={handleEnd}
      swap={true} 
      swapClass="highlighted-swap" // Classe CSS optionnelle pendant le survol
    >
      {state.map((item) => (
        <div 
          key={item.id} 
          style={{ 
            padding: '10px', 
            margin: '5px 0', 
            background: '#eee', 
            cursor: 'grab' 
          }}
        >
          {item.name}
        </div>
      ))}
    </ReactSortable>
  );
}
