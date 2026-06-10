
`react-sortablejs` est un wrapper React pour la célèbre librairie JavaScript `SortableJS`. Elle permet de créer des interfaces de "Drag and Drop" (Glisser-Déposer) performantes, fluides et complètes avec très peu d'efforts.

---

## 1. Installation

```bash
npm install react-sortablejs sortablejs
# ou
yarn add react-sortablejs sortablejs
```

> **Note TypeScript** : Si vous utilisez TypeScript, vous aurez aussi besoin des types de base de `sortablejs` :
> ```bash
> npm install -D @types/sortablejs
> ```

---

## 2. Concepts de base

Pour utiliser `react-sortablejs`, vous devez importer le composant `<ReactSortable>`. Ce composant remplace le conteneur de votre liste (par exemple `<ul>` ou `<div>`) et gère toute la logique du Drag and Drop de manière transparente.

### A. Liste Simple (L'essentiel)

La propriété `list` doit toujours être un tableau d'objets, et **chaque objet doit avoir au minimum une propriété `id` unique**.

```jsx
import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";

export const SimpleList = () => {
  const [state, setState] = useState([
    { id: 1, name: "🍎 Pomme" },
    { id: 2, name: "🍌 Banane" },
    { id: 3, name: "🍒 Cerise" },
    { id: 4, name: "🥥 Noix de coco" },
  ]);

  return (
    <ReactSortable 
      list={state} 
      setList={setState}
      animation={200} // Ajoute une transition fluide de 200ms
    >
      {state.map((item) => (
        // IMPORTANT : Toujours utiliser l'id pour la key, JAMAIS l'index !
        <div key={item.id} className="list-item">
          {item.name}
        </div>
      ))}
    </ReactSortable>
  );
};
```

---

## 3. Listes Partagées (Déplacer d'une liste à l'autre)

Pour déplacer des éléments entre plusieurs listes (style Kanban, Trello), utilisez la propriété `group`. Les listes ayant le même nom de groupe peuvent échanger leurs éléments.

```jsx
import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";

export const KanbanBoard = () => {
  const [todo, setTodo] = useState([
    { id: 1, name: "Faire les courses" },
    { id: 2, name: "Appeler le docteur" },
  ]);

  const [done, setDone] = useState([
    { id: 3, name: "Payer les factures" },
  ]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Colonne À Faire */}
      <div className="column">
        <h3>À faire</h3>
        <ReactSortable 
          group="kanban" // Même nom de groupe
          animation={150}
          list={todo} 
          setList={setTodo}
          className="sortable-container"
        >
          {todo.map((item) => (
            <div key={item.id} className="task-card">{item.name}</div>
          ))}
        </ReactSortable>
      </div>

      {/* Colonne Terminé */}
      <div className="column">
        <h3>Terminé</h3>
        <ReactSortable 
          group="kanban" // Même nom de groupe
          animation={150}
          list={done} 
          setList={setDone}
          className="sortable-container"
        >
          {done.map((item) => (
            <div key={item.id} className="task-card">{item.name}</div>
          ))}
        </ReactSortable>
      </div>
    </div>
  );
};
```

---

## 4. Clonage (Dupliquer au lieu de déplacer)

Si vous construisez un outil de type "Form Builder" où vous glissez des composants depuis une palette vers un espace de travail sans vider la palette.

```jsx
export const FormBuilder = () => {
  const [palette, setPalette] = useState([
    { id: "input", name: "Champ Texte" },
    { id: "checkbox", name: "Case à cocher" },
  ]);
  const [form, setForm] = useState([]);

  return (
    <div style={{ display: "flex" }}>
      {/* Palette : Source */}
      <ReactSortable
        group={{ 
          name: 'builder', 
          pull: 'clone', // "clone" au lieu de déplacer
          put: false     // On ne peut rien déposer dans la palette
        }}
        list={palette}
        setList={setPalette}
        // Il est CRUCIAL de générer un nouvel id pour le clone, sinon React plante avec des keys dupliquées
        clone={(item) => ({ ...item, id: Math.random().toString() })} 
        sort={false} // Désactive le tri au sein de la palette elle-même
      >
        {palette.map(item => <div key={item.id}>{item.name}</div>)}
      </ReactSortable>

      {/* Zone de construction : Destination */}
      <ReactSortable
        group="builder" // Accepte les éléments du groupe 'builder'
        list={form}
        setList={setForm}
      >
        {form.map(item => <div key={item.id}>{item.name}</div>)}
      </ReactSortable>
    </div>
  );
};
```

---

## 5. Poignées de Déplacement (Drag Handles)

Pour restreindre la zone cliquable pour glisser un élément. Très utile si vous avez des inputs textuels dans vos éléments (sans poignée, on ne pourrait pas cliquer dans l'input sans déclencher le drag).

```jsx
<ReactSortable 
  list={state} 
  setList={setState} 
  handle=".drag-handle" // Sélecteur CSS de la poignée
>
  {state.map((item) => (
    <div key={item.id} style={{ display: 'flex' }}>
      {/* SEUL ce bouton permet de glisser l'élément */}
      <span className="drag-handle" style={{ cursor: 'grab', padding: '10px' }}>
        ☰
      </span>
      <input type="text" defaultValue={item.name} />
    </div>
  ))}
</ReactSortable>
```

---

## 6. Ignorer des éléments (Filtrer & Verrouiller)

Pour empêcher certains éléments d'être glissés.

```jsx
<ReactSortable 
  list={state} 
  setList={setState} 
  filter=".ignore-elements" // Empêche ces éléments d'être bougés
  preventOnFilter={true}
>
  {state.map((item) => (
    <div 
      key={item.id} 
      className={item.isLocked ? "ignore-elements" : ""}
    >
      {item.name} {item.isLocked && "(Verrouillé 🔒)"}
    </div>
  ))}
</ReactSortable>
```

---

## 7. Apparence & Animations CSS

`SortableJS` applique automatiquement des classes CSS à vos éléments pendant le déplacement.

```jsx
<ReactSortable
  list={state}
  setList={setState}
  ghostClass="my-ghost-class"   // L'emplacement cible de l'élément (l'ombre)
  chosenClass="my-chosen-class" // L'élément cliqué
  dragClass="my-drag-class"     // L'élément en vol (attaché à la souris)
  animation={150}               // Animation fluide de réorganisation
  easing="cubic-bezier(1, 0, 0, 1)" // Courbe d'animation
>
```

**Exemple de CSS associé :**
```css
.my-ghost-class {
  opacity: 0.4;
  background-color: #f4f4f4;
  border: 2px dashed #0088ff;
}
.my-chosen-class {
  background-color: #e6f7ff;
}
.my-drag-class {
  cursor: grabbing !important;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
```

---

## 8. Utilisation avec des Composants Personnalisés

Si vos enfants sont des composants React personnalisés au lieu de simples `<div>` ou `<li>`, **ils doivent obligatoirement utiliser `React.forwardRef`**. `ReactSortable` a besoin de la référence au DOM direct pour fonctionner.

```jsx
// ❌ Ne marchera pas
const BadCard = ({ children }) => <div className="card">{children}</div>;

// ✅ Bonne méthode
const GoodCard = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="card" {...props}>
      {props.children}
    </div>
  );
});

// Utilisation
<ReactSortable list={state} setList={setState}>
  {state.map(item => (
    <GoodCard key={item.id}>{item.name}</GoodCard>
  ))}
</ReactSortable>
```

---

## 9. Changer la balise HTML racine (Le Wrapper)

Par défaut, `ReactSortable` génère une `<div>`. Vous pouvez changer la balise générée avec `tag`. Utile pour les tableaux ou les listes pures.

```jsx
// Création d'un tableau triable
<table>
  <thead>
    <tr><th>ID</th><th>Nom</th></tr>
  </thead>
  {/* On remplace la div par tbody */}
  <ReactSortable tag="tbody" list={state} setList={setState}>
    {state.map(item => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.name}</td>
      </tr>
    ))}
  </ReactSortable>
</table>
```

---

## 10. Les Événements et Callbacks

Vous pouvez réagir à presque tout ce qu'il se passe durant le cycle de vie du Drag and Drop.

```jsx
<ReactSortable
  list={state}
  setList={setState}
  onStart={(evt) => console.log('Le drag commence', evt.oldIndex)}
  onEnd={(evt) => console.log('Le drag se termine', evt.newIndex)}
  onAdd={(evt) => console.log('Un élément arrive depuis une autre liste', evt)}
  onRemove={(evt) => console.log('Un élément est parti vers une autre liste', evt)}
  onUpdate={(evt) => console.log('L\'ordre a changé dans la même liste', evt)}
  onChange={(evt) => console.log('Se déclenche pendant le mouvement si l\'ordre change', evt)}
>
```

---

## 11. Multi-Drag (Sélection Multiple)

`react-sortablejs` supporte les plugins officiels de SortableJS. Le plus utilisé est le Multi-Drag (sélectionner plusieurs éléments en cliquant, puis les glisser tous en même temps).

```jsx
import React, { useState } from "react";
import { ReactSortable, Sortable, MultiDrag } from "react-sortablejs";

// 1. Initialiser le plugin
Sortable.mount(new MultiDrag());

export const MultiDragExample = () => {
  const [state, setState] = useState([
    { id: 1, name: "Image 1" },
    { id: 2, name: "Image 2" },
    { id: 3, name: "Image 3" },
  ]);

  return (
    <ReactSortable
      list={state}
      setList={setState}
      multiDrag={true} // 2. Activer le multidrag
      selectedClass="my-selected-class" // 3. Classe pour styliser les éléments sélectionnés
      animation={150}
    >
      {state.map((item) => (
        <div key={item.id} className="file-item">{item.name}</div>
      ))}
    </ReactSortable>
  );
};
```
*Le fonctionnement habituel est de cliquer sur plusieurs éléments pour les "marquer" via `selectedClass`, puis de les glisser.*

---

## ⚠️ Les 3 Règles d'Or pour éviter les bugs

1. **JAMAIS D'INDEX COMME KEY** : `key={index}` fera crasher React lors du déplacement. Utilisez toujours une clé unique issue de vos données (`key={item.id}`).
2. **PAS DE MODIFICATION DIRECTE** : Ne mutez jamais le tableau passé à `list`. C'est le rôle exclusif de `setList` géré par le composant.
3. **SYMBIOSE STATE/DOM** : Si vous rencontrez des glitchs (l'élément retourne à sa place puis saute), assurez-vous que `list` et `setList` font bien référence au même `state` et que vos `id` sont constants.
