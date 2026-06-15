# 📘 Bootstrap — Bible Complète (v5.x)

> **Guide de référence complet pour examen** — Toutes les classes, composants et utilitaires Bootstrap 5.

---

## 📚 Table des Matières

1. [Installation & Setup](#1-installation--setup)
2. [Système de Grille (Grid)](#2-système-de-grille-grid)
3. [Typographie](#3-typographie)
4. [Couleurs & Thèmes](#4-couleurs--thèmes)
5. [Espacements (Margin & Padding)](#5-espacements-margin--padding)
6. [Flexbox Utilities](#6-flexbox-utilities)
7. [Boutons](#7-boutons)
8. [Formulaires](#8-formulaires)
9. [Navbars & Navigation](#9-navbars--navigation)
10. [Cards](#10-cards)
11. [Tables](#11-tables)
12. [Modals](#12-modals)
13. [Alerts & Badges](#13-alerts--badges)
14. [Dropdowns](#14-dropdowns)
15. [Accordéon & Collapse](#15-accordéon--collapse)
16. [Carousel](#16-carousel)
17. [Tooltips & Popovers](#17-tooltips--popovers)
18. [Offcanvas](#18-offcanvas)
19. [Spinners & Progress](#19-spinners--progress)
20. [Utilitaires Divers](#20-utilitaires-divers)
21. [Breakpoints de référence](#21-breakpoints-de-référence)
22. [Cheatsheet rapide](#22-cheatsheet-rapide)

---

## 1. Installation & Setup

### Via CDN (HTML)
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon App Bootstrap</title>
  <!-- CSS Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

  <!-- JS Bundle (inclut Popper.js) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### Via NPM
```bash
npm install bootstrap
```

```js
// Dans main.js ou index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

### Via SCSS (personnalisation)
```scss
// Importer Bootstrap SCSS complet
@import "~bootstrap/scss/bootstrap";

// Ou partiellement :
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/grid";
```

---

## 2. Système de Grille (Grid)

Bootstrap utilise un système de **12 colonnes** basé sur Flexbox.

### Structure de base
```html
<div class="container">
  <div class="row">
    <div class="col">Colonne auto</div>
    <div class="col">Colonne auto</div>
  </div>
</div>
```

### Types de Containers

| Classe             | Description                              |
|--------------------|------------------------------------------|
| `.container`       | Centré, largeur max par breakpoint       |
| `.container-fluid` | Pleine largeur (100%)                    |
| `.container-sm`    | 100% jusqu'à sm, puis fixe              |
| `.container-md`    | 100% jusqu'à md, puis fixe              |
| `.container-lg`    | 100% jusqu'à lg, puis fixe              |
| `.container-xl`    | 100% jusqu'à xl, puis fixe              |
| `.container-xxl`   | 100% jusqu'à xxl, puis fixe             |

### Colonnes — Tailles fixes

```html
<div class="row">
  <div class="col-6">6 colonnes sur 12 (50%)</div>
  <div class="col-6">6 colonnes sur 12 (50%)</div>
</div>

<div class="row">
  <div class="col-4">33%</div>
  <div class="col-4">33%</div>
  <div class="col-4">33%</div>
</div>
```

### Colonnes — Responsive (breakpoints)

| Classe     | Déclenchement |
|------------|---------------|
| `col-`     | Toutes tailles (xs, <576px) |
| `col-sm-`  | ≥ 576px       |
| `col-md-`  | ≥ 768px       |
| `col-lg-`  | ≥ 992px       |
| `col-xl-`  | ≥ 1200px      |
| `col-xxl-` | ≥ 1400px      |

```html
<!-- Mobile: full width, Tablet: 50%, Desktop: 33% -->
<div class="col-12 col-md-6 col-lg-4">Responsive</div>
```

### Offset, Order, Gutter

```html
<!-- Offset : déplacer les colonnes -->
<div class="col-md-4 offset-md-4">Centré</div>

<!-- Order : réordonner -->
<div class="col order-3">Troisième</div>
<div class="col order-1">Premier</div>

<!-- Gutter (espacement entre colonnes) -->
<div class="row g-3">  <!-- g-0 à g-5 -->
<div class="row gx-3"> <!-- gutter horizontal seulement -->
<div class="row gy-3"> <!-- gutter vertical seulement -->
```

### Auto-layout & Equal width

```html
<div class="row">
  <div class="col">Auto-égal</div>   <!-- se partagent l'espace -->
  <div class="col">Auto-égal</div>
</div>

<div class="row">
  <div class="col-auto">Contenu naturel</div>  <!-- largeur selon contenu -->
  <div class="col">Reste de l'espace</div>
</div>
```

---

## 3. Typographie

### Titres HTML et classes

```html
<h1>Titre H1</h1>
<h2>Titre H2</h2>
<!-- ... jusqu'à h6 -->

<!-- Utiliser la taille de titre sans balise sémantique : -->
<p class="h1">Paragraphe style H1</p>
<p class="h3">Paragraphe style H3</p>
```

### Display Headings (très grand)

```html
<h1 class="display-1">Display 1</h1>
<h1 class="display-2">Display 2</h1>
<h1 class="display-3">Display 3</h1>
<h1 class="display-4">Display 4</h1>
<h1 class="display-5">Display 5</h1>
<h1 class="display-6">Display 6</h1>
```

### Lead & Texte

```html
<p class="lead">Paragraphe en avant (plus grand, plus léger)</p>

<!-- Alignement -->
<p class="text-start">Gauche</p>
<p class="text-center">Centre</p>
<p class="text-end">Droite</p>

<!-- Responsive -->
<p class="text-md-center">Centre à partir de md</p>

<!-- Transformation -->
<p class="text-uppercase">MAJUSCULES</p>
<p class="text-lowercase">minuscules</p>
<p class="text-capitalize">Première Lettre Majuscule</p>

<!-- Style -->
<p class="fw-bold">Gras (700)</p>
<p class="fw-semibold">Semi-Gras (600)</p>
<p class="fw-normal">Normal (400)</p>
<p class="fw-light">Léger (300)</p>
<p class="fst-italic">Italique</p>
<p class="text-decoration-underline">Souligné</p>
<p class="text-decoration-line-through">Barré</p>
<p class="text-decoration-none">Pas de décoration</p>

<!-- Taille de police -->
<p class="fs-1">Font-size 1 (h1)</p>
<p class="fs-2">Font-size 2 (h2)</p>
<p class="fs-3">Font-size 3 (h3)</p>
<p class="fs-4">Font-size 4 (h4)</p>
<p class="fs-5">Font-size 5 (h5)</p>
<p class="fs-6">Font-size 6 (h6)</p>

<!-- Troncature -->
<p class="text-truncate" style="max-width: 200px;">Texte trop long qui sera tronqué...</p>

<!-- Coupure de mots -->
<p class="text-break">Longmotquinesecasserait&nbsp;pas</p>

<!-- Monospace -->
<code class="font-monospace">Code monospace</code>
```

### Listes

```html
<!-- Sans style -->
<ul class="list-unstyled">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Inline -->
<ul class="list-inline">
  <li class="list-inline-item">Item 1</li>
  <li class="list-inline-item">Item 2</li>
</ul>
```

### Blockquote

```html
<blockquote class="blockquote">
  <p>Citation importante.</p>
  <footer class="blockquote-footer">Auteur <cite>Source</cite></footer>
</blockquote>
```

---

## 4. Couleurs & Thèmes

### Couleurs de texte

```html
<p class="text-primary">Primaire (bleu)</p>
<p class="text-secondary">Secondaire (gris)</p>
<p class="text-success">Succès (vert)</p>
<p class="text-danger">Danger (rouge)</p>
<p class="text-warning">Avertissement (jaune)</p>
<p class="text-info">Info (cyan)</p>
<p class="text-light">Clair</p>
<p class="text-dark">Sombre</p>
<p class="text-white">Blanc</p>
<p class="text-muted">Atténué (gris clair)</p>
<p class="text-black-50">Noir à 50% opacité</p>
<p class="text-white-50">Blanc à 50% opacité</p>

<!-- Bootstrap 5.3+ (color mode) -->
<p class="text-body">Couleur corps par défaut</p>
<p class="text-body-secondary">Corps secondaire</p>
<p class="text-body-tertiary">Corps tertiaire</p>
<p class="text-body-emphasis">Corps emphasis</p>
```

### Couleurs de fond (background)

```html
<div class="bg-primary text-white">Primaire</div>
<div class="bg-secondary text-white">Secondaire</div>
<div class="bg-success text-white">Succès</div>
<div class="bg-danger text-white">Danger</div>
<div class="bg-warning text-dark">Avertissement</div>
<div class="bg-info text-dark">Info</div>
<div class="bg-light text-dark">Clair</div>
<div class="bg-dark text-white">Sombre</div>
<div class="bg-white text-dark">Blanc</div>
<div class="bg-transparent">Transparent</div>

<!-- Gradient -->
<div class="bg-primary bg-gradient">Avec dégradé</div>

<!-- Opacité du fond (BS5.1+) -->
<div class="bg-success bg-opacity-75">75% opaque</div>
<div class="bg-success bg-opacity-50">50% opaque</div>
<div class="bg-success bg-opacity-25">25% opaque</div>
<div class="bg-success bg-opacity-10">10% opaque</div>
```

### Opacité du texte

```html
<p class="text-primary text-opacity-75">75%</p>
<p class="text-primary text-opacity-50">50%</p>
<p class="text-primary text-opacity-25">25%</p>
```

---

## 5. Espacements (Margin & Padding)

### Syntaxe générale : `{propriété}{côté}-{taille}`

**Propriété :**
- `m` = margin
- `p` = padding

**Côté :**
- `t` = top
- `b` = bottom
- `s` = start (left en LTR)
- `e` = end (right en LTR)
- `x` = horizontal (left + right)
- `y` = vertical (top + bottom)
- _(vide)_ = tous les côtés

**Taille :**
- `0` = 0
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `3` = 1rem (16px)
- `4` = 1.5rem (24px)
- `5` = 3rem (48px)
- `auto` = auto (margin seulement)

```html
<!-- Exemples -->
<div class="mt-3">margin-top: 1rem</div>
<div class="mb-2">margin-bottom: 0.5rem</div>
<div class="mx-auto">margin horizontal auto (centrage)</div>
<div class="p-4">padding: 1.5rem</div>
<div class="py-2 px-4">padding vertical 0.5rem, horizontal 1.5rem</div>
<div class="ms-3">margin-start: 1rem</div>
<div class="me-3">margin-end: 1rem</div>

<!-- Responsive -->
<div class="mt-0 mt-md-3">margin-top 0 mobile, 1rem ≥md</div>

<!-- Margin négatif (nécessite enableNegativeMargins en SCSS) -->
<div class="mt-n3">margin-top négatif</div>
```

---

## 6. Flexbox Utilities

### Activer Flex

```html
<div class="d-flex">Flex container</div>
<div class="d-inline-flex">Inline Flex container</div>

<!-- Responsive -->
<div class="d-md-flex">Flex à partir de md</div>
```

### Direction

```html
<div class="d-flex flex-row">Horizontal (défaut)</div>
<div class="d-flex flex-row-reverse">Horizontal inversé</div>
<div class="d-flex flex-column">Vertical</div>
<div class="d-flex flex-column-reverse">Vertical inversé</div>
```

### Justify Content (axe principal)

```html
<div class="d-flex justify-content-start">Début</div>
<div class="d-flex justify-content-end">Fin</div>
<div class="d-flex justify-content-center">Centre</div>
<div class="d-flex justify-content-between">Espace entre</div>
<div class="d-flex justify-content-around">Espace autour</div>
<div class="d-flex justify-content-evenly">Espace égal</div>
```

### Align Items (axe transversal)

```html
<div class="d-flex align-items-start">Haut</div>
<div class="d-flex align-items-end">Bas</div>
<div class="d-flex align-items-center">Centre</div>
<div class="d-flex align-items-baseline">Baseline</div>
<div class="d-flex align-items-stretch">Étirer (défaut)</div>
```

### Align Self (sur un enfant)

```html
<div class="align-self-start">Haut</div>
<div class="align-self-end">Bas</div>
<div class="align-self-center">Centre</div>
<div class="align-self-baseline">Baseline</div>
<div class="align-self-stretch">Étirer</div>
```

### Wrap

```html
<div class="d-flex flex-wrap">Retour à la ligne</div>
<div class="d-flex flex-nowrap">Pas de retour</div>
<div class="d-flex flex-wrap-reverse">Retour inversé</div>
```

### Grow & Shrink

```html
<div class="flex-grow-0">Ne grandit pas</div>
<div class="flex-grow-1">Grandit pour remplir</div>
<div class="flex-shrink-0">Ne rétrécit pas</div>
<div class="flex-shrink-1">Rétrécit</div>
```

### Align Content (multi-lignes)

```html
<div class="d-flex flex-wrap align-content-start">Début</div>
<div class="d-flex flex-wrap align-content-end">Fin</div>
<div class="d-flex flex-wrap align-content-center">Centre</div>
<div class="d-flex flex-wrap align-content-between">Espace entre</div>
<div class="d-flex flex-wrap align-content-around">Espace autour</div>
<div class="d-flex flex-wrap align-content-stretch">Étirer</div>
```

### Order

```html
<div class="order-0">Premier</div>
<div class="order-1">Deuxième</div>
<div class="order-2">Troisième</div>
<!-- ... jusqu'à order-5 -->
<div class="order-first">Tout premier (-1)</div>
<div class="order-last">Tout dernier (6)</div>
```

---

## 7. Boutons

### Boutons de base

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-light">Light</button>
<button class="btn btn-dark">Dark</button>
<button class="btn btn-link">Link</button>
```

### Boutons Outline

```html
<button class="btn btn-outline-primary">Outline Primary</button>
<button class="btn btn-outline-secondary">Outline Secondary</button>
<button class="btn btn-outline-success">Outline Success</button>
<button class="btn btn-outline-danger">Outline Danger</button>
<button class="btn btn-outline-warning">Outline Warning</button>
<button class="btn btn-outline-info">Outline Info</button>
<button class="btn btn-outline-light">Outline Light</button>
<button class="btn btn-outline-dark">Outline Dark</button>
```

### Tailles

```html
<button class="btn btn-primary btn-lg">Grand</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-sm">Petit</button>
```

### États

```html
<!-- Désactivé -->
<button class="btn btn-primary" disabled>Désactivé</button>
<a class="btn btn-primary disabled" aria-disabled="true">Lien désactivé</a>

<!-- Actif -->
<button class="btn btn-primary active" aria-pressed="true">Actif</button>
```

### Pleine largeur (block)

```html
<div class="d-grid gap-2">
  <button class="btn btn-primary">Bouton pleine largeur</button>
  <button class="btn btn-primary">Bouton pleine largeur</button>
</div>

<!-- Responsive : block sur mobile, auto sur md+ -->
<div class="d-grid d-md-block gap-2">
  <button class="btn btn-primary">Adaptatif</button>
</div>
```

### Groupe de boutons

```html
<div class="btn-group" role="group">
  <button class="btn btn-primary">Gauche</button>
  <button class="btn btn-primary">Centre</button>
  <button class="btn btn-primary">Droite</button>
</div>

<!-- Vertical -->
<div class="btn-group-vertical">
  <button class="btn btn-primary">Haut</button>
  <button class="btn btn-primary">Bas</button>
</div>

<!-- Taille du groupe -->
<div class="btn-group btn-group-lg">...</div>
<div class="btn-group btn-group-sm">...</div>
```

### Bouton avec spinner (chargement)

```html
<button class="btn btn-primary" disabled>
  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
  Chargement...
</button>
```

---

## 8. Formulaires

### Input basique

```html
<div class="mb-3">
  <label for="email" class="form-label">Adresse email</label>
  <input type="email" class="form-control" id="email" placeholder="nom@exemple.com">
  <div class="form-text">Aide contextuelle sous le champ.</div>
</div>

<div class="mb-3">
  <label for="password" class="form-label">Mot de passe</label>
  <input type="password" class="form-control" id="password">
</div>
```

### Textarea

```html
<div class="mb-3">
  <label for="description" class="form-label">Description</label>
  <textarea class="form-control" id="description" rows="3"></textarea>
</div>
```

### Select

```html
<div class="mb-3">
  <label for="pays" class="form-label">Pays</label>
  <select class="form-select" id="pays">
    <option selected>Choisir...</option>
    <option value="fr">France</option>
    <option value="be">Belgique</option>
  </select>
</div>

<!-- Tailles -->
<select class="form-select form-select-lg">Grand</select>
<select class="form-select form-select-sm">Petit</select>

<!-- Multiple -->
<select class="form-select" multiple>...</select>
```

### Checkbox & Radio

```html
<!-- Checkbox -->
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="check1">
  <label class="form-check-label" for="check1">Option 1</label>
</div>

<!-- Checkbox inline -->
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="cb1">
  <label class="form-check-label" for="cb1">Un</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="cb2">
  <label class="form-check-label" for="cb2">Deux</label>
</div>

<!-- Radio -->
<div class="form-check">
  <input class="form-check-input" type="radio" name="options" id="radio1" value="1">
  <label class="form-check-label" for="radio1">Option A</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="options" id="radio2" value="2">
  <label class="form-check-label" for="radio2">Option B</label>
</div>

<!-- Switch (toggle) -->
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="switch1">
  <label class="form-check-label" for="switch1">Activer</label>
</div>
```

### Range

```html
<div class="mb-3">
  <label for="range" class="form-label">Volume</label>
  <input type="range" class="form-range" id="range" min="0" max="100" step="5">
</div>
```

### Validation (états)

```html
<div class="mb-3">
  <label class="form-label">Email</label>
  <input type="email" class="form-control is-valid" value="ok@ok.com">
  <div class="valid-feedback">Parfait !</div>
</div>

<div class="mb-3">
  <label class="form-label">Email</label>
  <input type="email" class="form-control is-invalid" value="mauvais">
  <div class="invalid-feedback">Email invalide.</div>
</div>
```

### Tailles des inputs

```html
<input class="form-control form-control-lg" type="text" placeholder="Grand">
<input class="form-control" type="text" placeholder="Normal">
<input class="form-control form-control-sm" type="text" placeholder="Petit">
```

### Input de fichier

```html
<div class="mb-3">
  <label for="file" class="form-label">Fichier</label>
  <input class="form-control" type="file" id="file">
</div>
<div class="mb-3">
  <label for="files" class="form-label">Plusieurs fichiers</label>
  <input class="form-control" type="file" id="files" multiple>
</div>
```

### Input Group (icône/texte autour de l'input)

```html
<div class="input-group mb-3">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control" placeholder="Nom d'utilisateur">
</div>

<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Prix">
  <span class="input-group-text">€</span>
</div>

<div class="input-group mb-3">
  <span class="input-group-text">€</span>
  <input type="text" class="form-control">
  <span class="input-group-text">,00</span>
</div>

<!-- Avec bouton -->
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Recherche...">
  <button class="btn btn-outline-secondary">Chercher</button>
</div>

<!-- Tailles du groupe -->
<div class="input-group input-group-lg">...</div>
<div class="input-group input-group-sm">...</div>
```

### Formulaire en ligne (horizontal)

```html
<form class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="nom" class="col-form-label">Nom</label>
  </div>
  <div class="col-auto">
    <input type="text" class="form-control" id="nom">
  </div>
  <div class="col-auto">
    <button class="btn btn-primary">Valider</button>
  </div>
</form>
```

### Formulaire horizontal (label + champ côte à côte)

```html
<form>
  <div class="row mb-3">
    <label for="email" class="col-sm-2 col-form-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="email">
    </div>
  </div>
  <div class="row mb-3">
    <label for="pwd" class="col-sm-2 col-form-label">Mot de passe</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="pwd">
    </div>
  </div>
</form>
```

### Floating Labels

```html
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatEmail" placeholder="nom@ex.com">
  <label for="floatEmail">Adresse email</label>
</div>

<div class="form-floating">
  <textarea class="form-control" id="floatArea" style="height: 100px" placeholder="..."></textarea>
  <label for="floatArea">Commentaire</label>
</div>
```

---

## 9. Navbars & Navigation

### Navbar de base

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <!-- Logo/Brand -->
    <a class="navbar-brand" href="#">MonSite</a>

    <!-- Bouton hamburger (mobile) -->
    <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Liens (collapsibles) -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Accueil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Fonctionnalités</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled">Désactivé</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

### Navbar Sombre

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  ...
</nav>

<!-- Couleur personnalisée -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  ...
</nav>
```

### Navbar avec dropdown, recherche et bouton

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <!-- Navigation principale -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" href="#">Accueil</a>
        </li>
        <!-- Dropdown -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
            Services
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Service 1</a></li>
            <li><a class="dropdown-item" href="#">Service 2</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Autre</a></li>
          </ul>
        </li>
      </ul>
      <!-- Recherche -->
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Rechercher">
        <button class="btn btn-outline-light" type="submit">Chercher</button>
      </form>
    </div>
  </div>
</nav>
```

### Navbar fixée

```html
<!-- Fixée en haut -->
<nav class="navbar fixed-top navbar-dark bg-dark">...</nav>

<!-- Fixée en bas -->
<nav class="navbar fixed-bottom navbar-dark bg-dark">...</nav>

<!-- Sticky (reste visible lors du scroll jusqu'à la sortie du viewport) -->
<nav class="navbar sticky-top navbar-dark bg-dark">...</nav>
```

### Navbar avec image en brand

```html
<a class="navbar-brand" href="#">
  <img src="logo.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
  MonSite
</a>
```

### Nav (tabs, pills)

```html
<!-- Tabs -->
<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Actif</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Lien</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled">Désactivé</a>
  </li>
</ul>

<!-- Pills -->
<ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link active" href="#">Actif</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Lien</a>
  </li>
</ul>

<!-- Fill : occupe tout l'espace -->
<ul class="nav nav-tabs nav-fill">...</ul>

<!-- Justified : largeur égale -->
<ul class="nav nav-tabs nav-justified">...</ul>

<!-- Vertical -->
<ul class="nav flex-column">
  <li class="nav-item"><a class="nav-link active" href="#">Item 1</a></li>
  <li class="nav-item"><a class="nav-link" href="#">Item 2</a></li>
</ul>
```

### Tabs avec contenu dynamique

```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab"
            data-bs-target="#home-tab-pane" type="button" role="tab">Accueil</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profil-tab" data-bs-toggle="tab"
            data-bs-target="#profil-tab-pane" type="button" role="tab">Profil</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel">
    Contenu Accueil
  </div>
  <div class="tab-pane fade" id="profil-tab-pane" role="tabpanel">
    Contenu Profil
  </div>
</div>
```

### Breadcrumb

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Accueil</a></li>
    <li class="breadcrumb-item"><a href="#">Bibliothèque</a></li>
    <li class="breadcrumb-item active" aria-current="page">Données</li>
  </ol>
</nav>
```

### Pagination

```html
<nav aria-label="Pagination">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1">Précédent</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Suivant</a>
    </li>
  </ul>
</nav>

<!-- Tailles -->
<ul class="pagination pagination-lg">...</ul>
<ul class="pagination pagination-sm">...</ul>

<!-- Alignement -->
<ul class="pagination justify-content-center">...</ul>
<ul class="pagination justify-content-end">...</ul>
```

---

## 10. Cards

### Card de base

```html
<div class="card" style="width: 18rem;">
  <img src="image.jpg" class="card-img-top" alt="Image">
  <div class="card-body">
    <h5 class="card-title">Titre de la carte</h5>
    <p class="card-text">Contenu de la carte. Texte de description.</p>
    <a href="#" class="btn btn-primary">Voir plus</a>
  </div>
</div>
```

### Éléments de card

```html
<div class="card">
  <!-- En-tête -->
  <div class="card-header">En-tête</div>

  <!-- Image haut -->
  <img src="..." class="card-img-top" alt="...">

  <!-- Corps -->
  <div class="card-body">
    <h5 class="card-title">Titre</h5>
    <h6 class="card-subtitle mb-2 text-muted">Sous-titre</h6>
    <p class="card-text">Description...</p>
    <a href="#" class="card-link">Lien 1</a>
    <a href="#" class="card-link">Lien 2</a>
    <a href="#" class="btn btn-primary">Bouton</a>
  </div>

  <!-- Liste dans la card -->
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis</li>
  </ul>

  <!-- Pied de page -->
  <div class="card-footer text-muted">Il y a 3 jours</div>

  <!-- Image bas -->
  <img src="..." class="card-img-bottom" alt="...">
</div>
```

### Card avec overlay image

```html
<div class="card bg-dark text-white">
  <img src="image.jpg" class="card-img" alt="...">
  <div class="card-img-overlay">
    <h5 class="card-title">Titre</h5>
    <p class="card-text">Texte sur l'image.</p>
  </div>
</div>
```

### Couleurs de card

```html
<div class="card text-white bg-primary">...</div>
<div class="card text-white bg-secondary">...</div>
<div class="card text-white bg-success">...</div>
<div class="card text-white bg-danger">...</div>
<div class="card text-bg-warning">...</div>  <!-- BS5.3+ -->
<div class="card text-bg-info">...</div>
<div class="card text-white bg-dark">...</div>

<!-- Outline style -->
<div class="card border-primary">...</div>
<div class="card border-danger">...</div>
```

### Card horizontal

```html
<div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="image.jpg" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Titre</h5>
        <p class="card-text">Description</p>
        <p class="card-text"><small class="text-muted">Mis à jour hier</small></p>
      </div>
    </div>
  </div>
</div>
```

### Card Groups & Deck

```html
<!-- Group : hauteur égale, bord commun -->
<div class="card-group">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>

<!-- Grid de cards responsive -->
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col">
    <div class="card h-100">...</div>
  </div>
  <div class="col">
    <div class="card h-100">...</div>
  </div>
</div>
```

---

## 11. Tables

### Table de base

```html
<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Prénom</th>
      <th scope="col">Nom</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jean</td>
      <td>Dupont</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Pied de tableau</td>
    </tr>
  </tfoot>
</table>
```

### Variantes de tables

```html
<!-- Couleur de fond -->
<table class="table table-primary">...</table>
<table class="table table-dark">...</table>

<!-- Lignes rayées -->
<table class="table table-striped">...</table>
<table class="table table-striped-columns">...</table>  <!-- colonnes rayées -->

<!-- Survol (hover) -->
<table class="table table-hover">...</table>

<!-- Bordures -->
<table class="table table-bordered">...</table>
<table class="table table-borderless">...</table>

<!-- Compacte -->
<table class="table table-sm">...</table>

<!-- Combinaisons -->
<table class="table table-dark table-striped table-hover">...</table>
```

### Couleurs de lignes

```html
<tr class="table-primary">...</tr>
<tr class="table-secondary">...</tr>
<tr class="table-success">...</tr>
<tr class="table-danger">...</tr>
<tr class="table-warning">...</tr>
<tr class="table-info">...</tr>
<tr class="table-light">...</tr>
<tr class="table-dark">...</tr>
```

### Table responsive (scroll horizontal)

```html
<div class="table-responsive">
  <table class="table">...</table>
</div>

<!-- Responsive par breakpoint -->
<div class="table-responsive-sm">...</div>
<div class="table-responsive-md">...</div>
<div class="table-responsive-lg">...</div>
<div class="table-responsive-xl">...</div>
```

### En-tête sombre/clair

```html
<thead class="table-dark">...</thead>
<thead class="table-light">...</thead>
```

---

## 12. Modals

### Modal de base

```html
<!-- Bouton déclencheur -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#monModal">
  Ouvrir Modal
</button>

<!-- Structure du Modal -->
<div class="modal fade" id="monModal" tabindex="-1" aria-labelledby="monModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <!-- En-tête -->
      <div class="modal-header">
        <h5 class="modal-title" id="monModalLabel">Titre du Modal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
      </div>
      <!-- Corps -->
      <div class="modal-body">
        Contenu du modal ici...
      </div>
      <!-- Pied -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary">Confirmer</button>
      </div>
    </div>
  </div>
</div>
```

### Tailles du Modal

```html
<div class="modal-dialog modal-sm">...</div>     <!-- Petit -->
<div class="modal-dialog">...</div>               <!-- Normal (défaut) -->
<div class="modal-dialog modal-lg">...</div>     <!-- Grand -->
<div class="modal-dialog modal-xl">...</div>     <!-- Très grand -->
<div class="modal-dialog modal-fullscreen">...</div>  <!-- Plein écran -->

<!-- Plein écran responsive -->
<div class="modal-dialog modal-fullscreen-sm-down">...</div>
<div class="modal-dialog modal-fullscreen-md-down">...</div>
```

### Modal centré verticalement

```html
<div class="modal-dialog modal-dialog-centered">...</div>
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">...</div>
```

### Modal avec scroll interne

```html
<div class="modal-dialog modal-dialog-scrollable">...</div>
```

### Modal via JavaScript

```js
// Ouvrir
const modal = new bootstrap.Modal(document.getElementById('monModal'));
modal.show();

// Fermer
modal.hide();

// Toggle
modal.toggle();

// Disposer
modal.dispose();

// Options
const modal = new bootstrap.Modal('#monModal', {
  backdrop: true,       // true, false, 'static'
  keyboard: true,       // fermer avec Échap
  focus: true
});

// Événements
const el = document.getElementById('monModal');
el.addEventListener('show.bs.modal', event => { ... });
el.addEventListener('shown.bs.modal', event => { ... });
el.addEventListener('hide.bs.modal', event => { ... });
el.addEventListener('hidden.bs.modal', event => { ... });
```

---

## 13. Alerts & Badges

### Alerts

```html
<div class="alert alert-primary" role="alert">Alert primaire</div>
<div class="alert alert-secondary" role="alert">Alert secondaire</div>
<div class="alert alert-success" role="alert">Succès !</div>
<div class="alert alert-danger" role="alert">Erreur !</div>
<div class="alert alert-warning" role="alert">Attention !</div>
<div class="alert alert-info" role="alert">Information</div>
<div class="alert alert-light" role="alert">Clair</div>
<div class="alert alert-dark" role="alert">Sombre</div>

<!-- Alert avec lien -->
<div class="alert alert-primary">
  Un lien <a href="#" class="alert-link">exemple</a>.
</div>

<!-- Alert avec contenu riche -->
<div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Bien joué !</h4>
  <p>Opération réussie avec succès.</p>
  <hr>
  <p class="mb-0">N'oubliez pas de vérifier vos données.</p>
</div>

<!-- Alert dismissible (fermer) -->
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  Attention ! Vérifiez vos paramètres.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
</div>
```

### Badges

```html
<!-- Inline badge -->
<h1>Titre <span class="badge bg-secondary">Nouveau</span></h1>

<!-- Couleurs -->
<span class="badge bg-primary">Primary</span>
<span class="badge bg-secondary">Secondary</span>
<span class="badge bg-success">Success</span>
<span class="badge bg-danger">Danger</span>
<span class="badge bg-warning text-dark">Warning</span>
<span class="badge bg-info text-dark">Info</span>
<span class="badge bg-light text-dark">Light</span>
<span class="badge bg-dark">Dark</span>

<!-- Pill (arrondi) -->
<span class="badge rounded-pill bg-primary">Primary</span>

<!-- Compteur sur bouton -->
<button type="button" class="btn btn-primary position-relative">
  Notifications
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    99+
    <span class="visually-hidden">messages non lus</span>
  </span>
</button>

<!-- Point indicateur -->
<button type="button" class="btn btn-primary position-relative">
  Inbox
  <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
    <span class="visually-hidden">Nouveaux messages</span>
  </span>
</button>
```

---

## 14. Dropdowns

### Dropdown de base

```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button"
          data-bs-toggle="dropdown" aria-expanded="false">
    Menu déroulant
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action 1</a></li>
    <li><a class="dropdown-item" href="#">Action 2</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Séparée</a></li>
  </ul>
</div>
```

### Dropdown avec header, texte, formulaire

```html
<ul class="dropdown-menu">
  <li><h6 class="dropdown-header">Section</h6></li>
  <li><a class="dropdown-item" href="#">Item</a></li>
  <li><span class="dropdown-item-text">Texte simple</span></li>
  <li><hr class="dropdown-divider"></li>
  <li>
    <form class="px-4 py-3">
      <input type="email" class="form-control mb-2" placeholder="Email">
      <button type="submit" class="btn btn-primary w-100">Connexion</button>
    </form>
  </li>
</ul>
```

### Sens du dropdown

```html
<div class="dropdown">...</div>      <!-- Bas (défaut) -->
<div class="dropup">...</div>        <!-- Haut -->
<div class="dropstart">...</div>     <!-- Gauche -->
<div class="dropend">...</div>       <!-- Droite -->
```

### Split button dropdown

```html
<div class="btn-group">
  <button type="button" class="btn btn-danger">Action</button>
  <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Menu</span>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Option 1</a></li>
    <li><a class="dropdown-item" href="#">Option 2</a></li>
  </ul>
</div>
```

### Alignement du menu

```html
<ul class="dropdown-menu dropdown-menu-end">...</ul>   <!-- Droite -->
<ul class="dropdown-menu dropdown-menu-start">...</ul> <!-- Gauche (défaut) -->

<!-- Responsive -->
<ul class="dropdown-menu dropdown-menu-md-end">...</ul>
```

### Items actif et désactivé

```html
<li><a class="dropdown-item active" href="#">Actif</a></li>
<li><a class="dropdown-item disabled">Désactivé</a></li>
```

---

## 15. Accordéon & Collapse

### Collapse simple

```html
<button class="btn btn-primary" type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample">
  Afficher/Masquer
</button>

<div class="collapse" id="collapseExample">
  <div class="card card-body">
    Contenu masqué par défaut.
  </div>
</div>
```

### Accordéon (Accordion)

```html
<div class="accordion" id="accordionExample">
  <!-- Item 1 (ouvert par défaut) -->
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne">
        Section 1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show"
         data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Contenu de la section 1.
      </div>
    </div>
  </div>

  <!-- Item 2 -->
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo">
        Section 2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse"
         data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Contenu de la section 2.
      </div>
    </div>
  </div>
</div>

<!-- Accordéon toujours ouvert (sans data-bs-parent) -->
<div id="collapseOne" class="accordion-collapse collapse show">

<!-- Accordéon flush (sans bordure extérieure) -->
<div class="accordion accordion-flush">...</div>
```

---

## 16. Carousel

### Carousel de base

```html
<div id="myCarousel" class="carousel slide" data-bs-ride="carousel">

  <!-- Indicateurs (points) -->
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0"
            class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
  </div>

  <!-- Slides -->
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="slide1.jpg" class="d-block w-100" alt="Slide 1">
      <div class="carousel-caption d-none d-md-block">
        <h5>Titre Slide 1</h5>
        <p>Description du slide 1.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="slide2.jpg" class="d-block w-100" alt="Slide 2">
    </div>
    <div class="carousel-item" data-bs-interval="2000">
      <!-- data-bs-interval : durée personnalisée en ms -->
      <img src="slide3.jpg" class="d-block w-100" alt="Slide 3">
    </div>
  </div>

  <!-- Contrôles précédent/suivant -->
  <button class="carousel-control-prev" type="button"
          data-bs-target="#myCarousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Précédent</span>
  </button>
  <button class="carousel-control-next" type="button"
          data-bs-target="#myCarousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Suivant</span>
  </button>
</div>
```

### Options Carousel

```html
<!-- Fondu au lieu du slide -->
<div class="carousel slide carousel-fade" ...>

<!-- Pas d'autoplay -->
<div class="carousel" data-bs-ride="false" ...>

<!-- Pause au survol (défaut: hover) -->
<div class="carousel" data-bs-pause="hover" ...>

<!-- Pas de wrap (s'arrête au dernier) -->
<div class="carousel" data-bs-wrap="false" ...>
```

```js
// Via JS
const carousel = new bootstrap.Carousel('#myCarousel', {
  interval: 2000,   // ms entre slides
  ride: 'carousel', // ou false
  pause: 'hover',
  wrap: true,
  touch: true,      // support tactile
  keyboard: true
});

carousel.next();
carousel.prev();
carousel.to(2);   // aller au slide 3 (index 0)
carousel.pause();
carousel.cycle();
```

---

## 17. Tooltips & Popovers

### Tooltips

> ⚠️ Les tooltips nécessitent une **initialisation JS** !

```html
<!-- HTML -->
<button type="button" class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Mon tooltip">
  Survolez-moi
</button>
```

```js
// Initialisation (tous les tooltips)
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

// Individual
const tooltip = new bootstrap.Tooltip('#monBouton', {
  placement: 'top',    // top, bottom, left, right, auto
  trigger: 'hover',   // hover, click, focus, manual
  title: 'Mon texte',
  html: false,         // si true, accepte HTML dans title
  delay: 0,            // ou { show: 500, hide: 100 }
  container: 'body'
});

tooltip.show();
tooltip.hide();
tooltip.toggle();
tooltip.dispose();
```

```html
<!-- Placements disponibles -->
data-bs-placement="top"
data-bs-placement="bottom"
data-bs-placement="left"
data-bs-placement="right"

<!-- HTML dans tooltip -->
<button data-bs-toggle="tooltip" data-bs-html="true" title="<em>Italique</em>">...</button>
```

### Popovers

> ⚠️ Les popovers nécessitent aussi une **initialisation JS** !

```html
<button type="button" class="btn btn-lg btn-danger"
        data-bs-toggle="popover"
        data-bs-title="Titre Popover"
        data-bs-content="Contenu détaillé du popover.">
  Popover
</button>
```

```js
// Initialisation
const popoverList = [...document.querySelectorAll('[data-bs-toggle="popover"]')]
  .map(el => new bootstrap.Popover(el));

// Individual
const popover = new bootstrap.Popover('#monElement', {
  placement: 'right',
  trigger: 'click',     // click, hover, focus, manual
  title: 'Titre',
  content: 'Contenu',
  html: false,
  container: 'body',
  sanitize: true
});
```

---

## 18. Offcanvas

### Offcanvas de base

```html
<!-- Bouton déclencheur -->
<button class="btn btn-primary" type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasDemo"
        aria-controls="offcanvasDemo">
  Ouvrir panneau
</button>

<!-- Panneau Offcanvas -->
<div class="offcanvas offcanvas-start" tabindex="-1"
     id="offcanvasDemo" aria-labelledby="offcanvasDemoLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasDemoLabel">Titre</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fermer"></button>
  </div>
  <div class="offcanvas-body">
    Contenu du panneau latéral...
  </div>
</div>
```

### Positions

```html
<div class="offcanvas offcanvas-start">...</div>   <!-- Gauche -->
<div class="offcanvas offcanvas-end">...</div>     <!-- Droite -->
<div class="offcanvas offcanvas-top">...</div>     <!-- Haut -->
<div class="offcanvas offcanvas-bottom">...</div>  <!-- Bas -->
```

### Options

```html
<!-- Backdrop statique (ne se ferme pas en cliquant dehors) -->
<div class="offcanvas" data-bs-backdrop="static" ...>

<!-- Sans backdrop -->
<div class="offcanvas" data-bs-backdrop="false" ...>

<!-- Scroll du body autorisé -->
<div class="offcanvas" data-bs-scroll="true" ...>
```

```js
const offcanvas = new bootstrap.Offcanvas('#offcanvasDemo', {
  backdrop: true,
  keyboard: true,
  scroll: false
});
offcanvas.show();
offcanvas.hide();
offcanvas.toggle();
```

---

## 19. Spinners & Progress

### Spinners

```html
<!-- Border spinner -->
<div class="spinner-border" role="status">
  <span class="visually-hidden">Chargement...</span>
</div>

<!-- Couleurs -->
<div class="spinner-border text-primary" role="status"></div>
<div class="spinner-border text-danger" role="status"></div>

<!-- Taille -->
<div class="spinner-border spinner-border-sm" role="status"></div>

<!-- Growing spinner -->
<div class="spinner-grow" role="status">
  <span class="visually-hidden">Chargement...</span>
</div>
<div class="spinner-grow text-success" role="status"></div>
<div class="spinner-grow spinner-grow-sm" role="status"></div>

<!-- Dans un bouton -->
<button class="btn btn-primary" disabled>
  <span class="spinner-border spinner-border-sm me-2"></span>
  Chargement...
</button>

<!-- Centré -->
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status"></div>
</div>
```

### Progress Bars

```html
<!-- Barre de base -->
<div class="progress" role="progressbar">
  <div class="progress-bar" style="width: 25%"></div>
</div>

<!-- Avec étiquette -->
<div class="progress" style="height: 20px;" role="progressbar">
  <div class="progress-bar" style="width: 50%">50%</div>
</div>

<!-- Couleurs -->
<div class="progress">
  <div class="progress-bar bg-success" style="width: 75%"></div>
</div>
<div class="progress">
  <div class="progress-bar bg-info" style="width: 50%"></div>
</div>
<div class="progress">
  <div class="progress-bar bg-warning" style="width: 25%"></div>
</div>
<div class="progress">
  <div class="progress-bar bg-danger" style="width: 10%"></div>
</div>

<!-- Striped -->
<div class="progress">
  <div class="progress-bar progress-bar-striped" style="width: 60%"></div>
</div>

<!-- Striped animée -->
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 75%"></div>
</div>

<!-- Multi-barres -->
<div class="progress">
  <div class="progress-bar bg-success" style="width: 30%"></div>
  <div class="progress-bar bg-info" style="width: 20%"></div>
  <div class="progress-bar bg-warning" style="width: 15%"></div>
</div>

<!-- Hauteur personnalisée -->
<div class="progress" style="height: 5px;">
  <div class="progress-bar" style="width: 80%"></div>
</div>

<!-- Via JS -->
<div class="progress">
  <div id="maBar" class="progress-bar" role="progressbar"
       aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
       style="width: 25%">
  </div>
</div>
```

---

## 20. Utilitaires Divers

### Display (affichage)

```html
<div class="d-none">Caché</div>
<div class="d-inline">Inline</div>
<div class="d-inline-block">Inline-block</div>
<div class="d-block">Block</div>
<div class="d-grid">Grid</div>
<div class="d-table">Table</div>
<div class="d-flex">Flex</div>

<!-- Responsive -->
<div class="d-none d-md-block">Caché mobile, visible ≥md</div>
<div class="d-block d-md-none">Visible mobile, caché ≥md</div>

<!-- Impression -->
<div class="d-print-none">Masqué à l'impression</div>
<div class="d-print-block">Visible à l'impression</div>
```

### Position

```html
<div class="position-static">Static</div>
<div class="position-relative">Relative</div>
<div class="position-absolute">Absolute</div>
<div class="position-fixed">Fixed</div>
<div class="position-sticky">Sticky</div>

<!-- Coin supérieur droit -->
<div class="position-absolute top-0 end-0">Coin haut-droite</div>
<!-- Centré -->
<div class="position-absolute top-50 start-50 translate-middle">Centré</div>
<!-- Haut centre -->
<div class="position-absolute top-0 start-50 translate-middle-x">Haut-centre</div>

<!-- Valeurs disponibles : 0, 50, 100 -->
<div class="top-0">top: 0</div>
<div class="top-50">top: 50%</div>
<div class="top-100">top: 100%</div>
<div class="bottom-0">...</div>
<div class="start-0">...</div>
<div class="end-0">...</div>
```

### Taille (Width & Height)

```html
<!-- Width -->
<div class="w-25">25%</div>
<div class="w-50">50%</div>
<div class="w-75">75%</div>
<div class="w-100">100%</div>
<div class="w-auto">auto</div>

<!-- Height -->
<div class="h-25">25%</div>
<div class="h-50">50%</div>
<div class="h-75">75%</div>
<div class="h-100">100%</div>
<div class="h-auto">auto</div>

<!-- Viewport -->
<div class="vw-100">100vw</div>
<div class="vh-100">100vh</div>
<div class="min-vw-100">min-width: 100vw</div>
<div class="min-vh-100">min-height: 100vh</div>
```

### Bordures

```html
<!-- Ajouter une bordure -->
<div class="border">Toutes les bordures</div>
<div class="border-top">Haut seulement</div>
<div class="border-bottom">Bas seulement</div>
<div class="border-start">Gauche seulement</div>
<div class="border-end">Droite seulement</div>

<!-- Supprimer une bordure -->
<div class="border-0">Aucune bordure</div>
<div class="border border-top-0">Sans haut</div>

<!-- Couleurs de bordure -->
<div class="border border-primary">Bleue</div>
<div class="border border-danger">Rouge</div>
<div class="border border-success">Verte</div>
<div class="border border-white">Blanche</div>

<!-- Épaisseur -->
<div class="border border-1">1px</div>
<div class="border border-2">2px</div>
<div class="border border-3">3px</div>
<div class="border border-4">4px</div>
<div class="border border-5">5px</div>

<!-- Opacité -->
<div class="border border-primary border-opacity-75">75%</div>
<div class="border border-primary border-opacity-50">50%</div>
<div class="border border-primary border-opacity-25">25%</div>
<div class="border border-primary border-opacity-10">10%</div>
```

### Arrondi (Border Radius)

```html
<img class="rounded" src="...">           <!-- Légèrement arrondi -->
<img class="rounded-0" src="...">         <!-- Pas d'arrondi -->
<img class="rounded-1" src="...">         <!-- Petit -->
<img class="rounded-2" src="...">         <!-- Moyen (défaut) -->
<img class="rounded-3" src="...">         <!-- Grand -->
<img class="rounded-4" src="...">         <!-- Plus grand -->
<img class="rounded-5" src="...">         <!-- Très grand -->
<img class="rounded-circle" src="...">    <!-- Cercle -->
<img class="rounded-pill" src="...">      <!-- Pilule (capsule) -->
<img class="rounded-top" src="...">       <!-- Haut arrondi -->
<img class="rounded-bottom" src="...">    <!-- Bas arrondi -->
<img class="rounded-start" src="...">     <!-- Gauche arrondi -->
<img class="rounded-end" src="...">       <!-- Droite arrondi -->
```

### Ombre (Shadow)

```html
<div class="shadow-none">Sans ombre</div>
<div class="shadow-sm">Petite ombre</div>
<div class="shadow">Ombre normale</div>
<div class="shadow-lg">Grande ombre</div>
```

### Overflow

```html
<div class="overflow-auto">Scroll si nécessaire</div>
<div class="overflow-hidden">Masquer le débordement</div>
<div class="overflow-visible">Visible</div>
<div class="overflow-scroll">Toujours scroll</div>

<div class="overflow-x-auto">Scroll horizontal</div>
<div class="overflow-y-auto">Scroll vertical</div>
```

### Visibilité

```html
<div class="visible">Visible</div>
<div class="invisible">Invisible (prend de l'espace)</div>
```

### Float

```html
<div class="float-start">À gauche</div>
<div class="float-end">À droite</div>
<div class="float-none">Aucun float</div>

<!-- Responsive -->
<div class="float-md-end">À droite ≥md</div>

<!-- Clearfix (parent d'éléments flottants) -->
<div class="clearfix">
  <div class="float-start">Flottant</div>
</div>
```

### Ratio (Aspect Ratio)

```html
<div class="ratio ratio-16x9">
  <iframe src="https://www.youtube.com/embed/..." allowfullscreen></iframe>
</div>

<div class="ratio ratio-4x3">
  <iframe src="..."></iframe>
</div>

<div class="ratio ratio-1x1">...</div>
<div class="ratio ratio-21x9">...</div>

<!-- Personnalisé -->
<div class="ratio" style="--bs-aspect-ratio: 50%;">...</div>
```

### Z-index

```html
<div class="z-0">z-index: 0</div>
<div class="z-1">z-index: 1</div>
<div class="z-2">z-index: 2</div>
<div class="z-3">z-index: 3</div>
<div class="z-n1">z-index: -1</div>
```

### Objet Fit (images/vidéos)

```html
<img class="object-fit-contain" src="...">
<img class="object-fit-cover" src="...">
<img class="object-fit-fill" src="...">
<img class="object-fit-scale" src="...">
<img class="object-fit-none" src="...">

<!-- Responsive -->
<img class="object-fit-md-cover" src="...">
```

### Images utilitaires

```html
<img src="..." class="img-fluid" alt="...">      <!-- Responsive (max-width: 100%) -->
<img src="..." class="img-thumbnail" alt="...">  <!-- Arrondi + bordure + padding -->
<img src="..." class="rounded-circle" alt="..."> <!-- Cercle -->
```

### Figures

```html
<figure class="figure">
  <img src="..." class="figure-img img-fluid rounded" alt="...">
  <figcaption class="figure-caption">Légende de l'image.</figcaption>
</figure>
```

### Accessibilité

```html
<!-- Visible seulement pour les lecteurs d'écran -->
<span class="visually-hidden">Texte pour accessibilité</span>
<span class="visually-hidden-focusable">Visible au focus</span>

<!-- Skip link -->
<a class="visually-hidden-focusable" href="#contenu">Aller au contenu</a>
```

### Interactions

```html
<div class="user-select-all">Sélectionner tout</div>
<div class="user-select-auto">Auto</div>
<div class="user-select-none">Pas de sélection</div>

<div class="pe-none">pointer-events: none</div>
<div class="pe-auto">pointer-events: auto</div>
```

### List Group

```html
<!-- Basique -->
<ul class="list-group">
  <li class="list-group-item">Item 1</li>
  <li class="list-group-item">Item 2</li>
  <li class="list-group-item">Item 3</li>
</ul>

<!-- Avec états -->
<ul class="list-group">
  <li class="list-group-item active" aria-current="true">Actif</li>
  <li class="list-group-item disabled" aria-disabled="true">Désactivé</li>
  <li class="list-group-item">Normal</li>
</ul>

<!-- Avec action (liens/boutons) -->
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">Actif</a>
  <a href="#" class="list-group-item list-group-item-action">Lien</a>
  <button class="list-group-item list-group-item-action">Bouton</button>
</div>

<!-- Flush (sans bordures ext.) -->
<ul class="list-group list-group-flush">...</ul>

<!-- Horizontal -->
<ul class="list-group list-group-horizontal">...</ul>
<ul class="list-group list-group-horizontal-md">...</ul>  <!-- responsive -->

<!-- Numéroté -->
<ol class="list-group list-group-numbered">
  <li class="list-group-item">Item A</li>
  <li class="list-group-item">Item B</li>
</ol>

<!-- Couleurs -->
<li class="list-group-item list-group-item-primary">Primary</li>
<li class="list-group-item list-group-item-success">Success</li>
<li class="list-group-item list-group-item-danger">Danger</li>
<li class="list-group-item list-group-item-warning">Warning</li>

<!-- Avec badge -->
<li class="list-group-item d-flex justify-content-between align-items-center">
  Messages
  <span class="badge bg-primary rounded-pill">14</span>
</li>

<!-- List group avec tabs (JS) -->
<div class="row">
  <div class="col-4">
    <div class="list-group" id="list-tab" role="tablist">
      <a class="list-group-item list-group-item-action active"
         data-bs-toggle="list" href="#list-home" role="tab">Accueil</a>
      <a class="list-group-item list-group-item-action"
         data-bs-toggle="list" href="#list-profil" role="tab">Profil</a>
    </div>
  </div>
  <div class="col-8">
    <div class="tab-content">
      <div class="tab-pane fade show active" id="list-home" role="tabpanel">Contenu Accueil</div>
      <div class="tab-pane fade" id="list-profil" role="tabpanel">Contenu Profil</div>
    </div>
  </div>
</div>
```

### Toast (Notifications)

```html
<!-- Structure du Toast -->
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="monToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <img src="logo.png" class="rounded me-2" alt="logo" width="20">
      <strong class="me-auto">Bootstrap</strong>
      <small>Il y a 11 min</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fermer"></button>
    </div>
    <div class="toast-body">
      Notification reçue !
    </div>
  </div>
</div>
```

```js
const toast = new bootstrap.Toast('#monToast', {
  animation: true,
  autohide: true,
  delay: 5000   // ms
});
toast.show();
toast.hide();
```

### Jumbotron (BS5 : utiliser card ou section)

```html
<!-- En BS5, Jumbotron a été supprimé. Alternative : -->
<div class="p-5 mb-4 bg-light rounded-3">
  <div class="container-fluid py-5">
    <h1 class="display-5 fw-bold">Titre héro</h1>
    <p class="col-md-8 fs-4">Sous-titre description.</p>
    <button class="btn btn-primary btn-lg" type="button">Commencer</button>
  </div>
</div>
```

---

## 21. Breakpoints de référence

| Breakpoint | Préfixe | Largeur min |
|------------|---------|-------------|
| Extra small | _(aucun)_ | < 576px |
| Small       | `sm`      | ≥ 576px |
| Medium      | `md`      | ≥ 768px |
| Large       | `lg`      | ≥ 992px |
| Extra large | `xl`      | ≥ 1200px |
| XXL         | `xxl`     | ≥ 1400px |

### Utilisation des préfixes (Mobile First)

Les classes sans préfixe s'appliquent **à toutes les tailles**.
Les préfixes s'appliquent **à cette taille ET au-delà** :

```html
<!-- Mobile: centré, Tablet+: à gauche -->
<p class="text-center text-md-start">Texte</p>

<!-- Mobile: caché, Desktop+: affiché -->
<div class="d-none d-lg-block">Affiché sur grand écran</div>

<!-- Mobile: full width, Medium+: 6 colonnes, Large+: 4 colonnes -->
<div class="col-12 col-md-6 col-lg-4">...</div>
```

---

## 22. Cheatsheet rapide

### Classes utilitaires essentielles

| Catégorie | Exemple | Description |
|-----------|---------|-------------|
| **Couleurs text** | `text-primary` | Couleur primaire |
| **Couleurs fond** | `bg-danger` | Fond rouge |
| **Margin** | `mt-3`, `mx-auto` | Margin top, auto horiz |
| **Padding** | `p-4`, `py-2` | Padding all, vertical |
| **Flex** | `d-flex justify-content-center` | Centrer horizontalement |
| **Align** | `align-items-center` | Centrer verticalement |
| **Grid** | `col-md-6` | 6 colonnes sur md+ |
| **Taille** | `w-100`, `h-auto` | Pleine largeur |
| **Texte** | `fw-bold`, `text-center` | Gras, centré |
| **Border** | `border rounded-3` | Bordure, arrondie |
| **Ombre** | `shadow-sm` | Petite ombre |
| **Position** | `position-relative` | Position relative |
| **Display** | `d-none d-md-block` | Caché mobile |
| **Overflow** | `overflow-hidden` | Cache débordement |

### Composants JS — Attributs data

| Composant | Attribut clé |
|-----------|-------------|
| Modal | `data-bs-toggle="modal" data-bs-target="#id"` |
| Dropdown | `data-bs-toggle="dropdown"` |
| Collapse | `data-bs-toggle="collapse" data-bs-target="#id"` |
| Tooltip | `data-bs-toggle="tooltip" title="..."` |
| Popover | `data-bs-toggle="popover" data-bs-content="..."` |
| Tab | `data-bs-toggle="tab" data-bs-target="#id"` |
| Offcanvas | `data-bs-toggle="offcanvas" data-bs-target="#id"` |
| Carousel | `data-bs-ride="carousel"` |
| Toast | `data-bs-dismiss="toast"` |

### API JS Bootstrap

```js
// Récupérer une instance existante
const instance = bootstrap.Modal.getInstance('#myModal');

// Ou créer une nouvelle instance
const instance = new bootstrap.Modal('#myModal', options);

// Classes disponibles
bootstrap.Modal
bootstrap.Dropdown
bootstrap.Collapse
bootstrap.Tooltip
bootstrap.Popover
bootstrap.Tab
bootstrap.Offcanvas
bootstrap.Carousel
bootstrap.Toast
bootstrap.ScrollSpy
bootstrap.Alert
bootstrap.Button
```

### Centrage d'un élément (techniques courantes)

```html
<!-- Flex centrage complet -->
<div class="d-flex justify-content-center align-items-center vh-100">
  <div>Centré verticalement et horizontalement</div>
</div>

<!-- Margin auto (horizontal) -->
<div class="mx-auto" style="width: 300px;">Centré horizontalement</div>

<!-- Position absolute centré -->
<div class="position-absolute top-50 start-50 translate-middle">Centré</div>

<!-- Text centré -->
<div class="text-center">Texte centré</div>
```

### Template de page complet

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon Application</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">MonApp</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="#">Accueil</a></li>
          <li class="nav-item"><a class="nav-link" href="#">À propos</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <div class="bg-primary text-white py-5">
    <div class="container text-center py-5">
      <h1 class="display-4 fw-bold">Bienvenue !</h1>
      <p class="lead mb-4">Une application Bootstrap 5 complète.</p>
      <a href="#" class="btn btn-light btn-lg me-2">Commencer</a>
      <a href="#" class="btn btn-outline-light btn-lg">En savoir plus</a>
    </div>
  </div>

  <!-- Contenu principal -->
  <main class="container my-5">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Carte 1</h5>
            <p class="card-text">Description de la carte 1.</p>
            <a href="#" class="btn btn-primary">En savoir plus</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Carte 2</h5>
            <p class="card-text">Description de la carte 2.</p>
            <a href="#" class="btn btn-primary">En savoir plus</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Carte 3</h5>
            <p class="card-text">Description de la carte 3.</p>
            <a href="#" class="btn btn-primary">En savoir plus</a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-dark text-white text-center py-4 mt-5">
    <div class="container">
      <p class="mb-0">&copy; 2024 MonApp. Tous droits réservés.</p>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

> **📌 Notes importantes :**
> - Bootstrap 5 **ne dépend plus de jQuery** (contrairement à BS4)
> - Les tooltips et popovers nécessitent une initialisation JS manuelle
> - Préférer `data-bs-*` (BS5) à `data-*` (BS4)
> - Bootstrap 5 utilise **Popper.js** (inclus dans `bootstrap.bundle.min.js`)
> - Mobile First : les classes sans préfixe s'appliquent **à toutes tailles**
> - BS5.3+ introduit le **color mode** (dark/light) via `data-bs-theme="dark"`

---

*📅 Référence basée sur Bootstrap v5.3 — [Documentation officielle](https://getbootstrap.com/docs/5.3)*
