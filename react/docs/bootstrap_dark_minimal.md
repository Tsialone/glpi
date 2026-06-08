# 📖 La Bible Bootstrap 5 : 100% Dark Mode & 0% CSS

Tu veux tout savoir sur Bootstrap pour construire une interface complète, belle et responsive, le tout en **Dark Mode natif** sans jamais toucher à un fichier CSS ? Ce guide est ton manuel complet. Prends ton temps pour le parcourir, **tout** y est.

---

## 🚀 1. L'Installation (Le Boilerplate Ultime)

Voici le code HTML de départ. L'attribut magique `data-bs-theme="dark"` sur la balise `<html>` fait basculer instantanément tous les composants et couleurs en mode sombre.

```html
<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon App Dark</title>
  
  <!-- CSS Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Icônes Bootstrap (Optionnel mais très utile) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>

  <div class="container mt-4">
    <h1>Bienvenue dans le côté obscur !</h1>
  </div>

  <!-- JS Bootstrap (Obligatoire pour les menus, modales, tooltips...) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## 📐 2. La Grille (Layout System)

Le système de grille est le cœur de Bootstrap. Il divise la largeur de l'écran en **12 colonnes virtuelles**.

### Les Conteneurs
- `<div class="container">` : Largeur fixe qui s'adapte par paliers (laisse de l'espace sur les côtés).
- `<div class="container-fluid">` : Prend 100% de la largeur de l'écran (colle aux bords).

### Lignes et Colonnes (Rows & Cols)
```html
<div class="container">
  <div class="row">
    <!-- Prend 6 colonnes sur 12 (donc la moitié) -->
    <div class="col-6">Moitié gauche</div>
    <div class="col-6">Moitié droite</div>
  </div>

  <div class="row mt-3">
    <!-- Prend 4 colonnes (donc 1/3) -->
    <div class="col-4">Tiers 1</div>
    <div class="col-4">Tiers 2</div>
    <div class="col-4">Tiers 3</div>
  </div>
</div>
```

### Le Responsive (S'adapter aux écrans)
On utilise des préfixes pour indiquer à partir de quelle taille d'écran la règle s'applique : `sm` (téléphones paysage), `md` (tablettes), `lg` (petits ordis), `xl` (grands écrans).
```html
<div class="row">
  <!-- Prend 100% (12) sur mobile, puis 50% (6) sur tablette, puis 25% (3) sur grand écran -->
  <div class="col-12 col-md-6 col-lg-3">Bloc responsive</div>
</div>
```

---

## 🎨 3. Les Couleurs et Textes

Les noms de couleurs Bootstrap sont sémantiques (ils ont un sens). En Dark Mode, elles sont automatiquement ajustées pour ne pas arracher les yeux.
Les principales sont : `primary` (bleu), `secondary` (gris), `success` (vert), `danger` (rouge), `warning` (jaune), `info` (bleu clair), `light` (blanc/gris très clair), `dark` (noir/gris très foncé).

### Couleurs de texte
```html
<p class="text-primary">Texte principal</p>
<p class="text-success">Action réussie</p>
<p class="text-danger">Erreur critique</p>
<p class="text-warning">Attention</p>
<p class="text-muted">Texte secondaire (plus discret, très utilisé)</p>
<p class="text-body">Couleur de base du texte</p>
<p class="text-body-secondary">Couleur de base légèrement atténuée</p>
```

### Couleurs de fond (Backgrounds)
```html
<div class="bg-primary text-white p-3">Fond bleu, texte blanc</div>
<div class="bg-success text-white p-3">Fond vert</div>
<!-- Très utiles en Dark Mode pour créer des "tuiles" -->
<div class="bg-dark-subtle p-3">Fond sombre subtil</div>
<div class="bg-body-tertiary p-3">Couleur de fond tertiaire (légèrement différente du fond de page)</div>
```

### Typographie
```html
<p class="fs-1">Texte géant (font-size 1)</p>
<p class="fs-6">Texte tout petit</p>
<p class="fw-bold">Texte en gras (font-weight bold)</p>
<p class="fst-italic">Texte en italique</p>
<p class="text-center">Texte centré</p>
<p class="text-end">Texte aligné à droite</p>
```

---

## 📏 4. Utilitaires de Positionnement (Flexbox & Espaces)

C'est là que tu t'épargnes 90% du CSS.

### Marges (Margin) et Remplissages (Padding)
- `m` (Margin extérieure), `p` (Padding intérieur).
- Côtés : `t` (top), `b` (bottom), `s` (start/gauche), `e` (end/droite), `x` (horizontal), `y` (vertical).
- Échelles de 0 à 5.
```html
<div class="mt-4">Marge en haut de 4</div>
<div class="mb-5">Énorme marge en bas de 5</div>
<div class="px-3">Padding gauche/droite de 3</div>
<div class="p-4">Padding de tous les côtés de 4</div>
```

### Flexbox (Pour tout aligner sans pleurer)
- `d-flex` : Transforme l'élément en conteneur Flexbox.
- `justify-content-center` : Centre horizontalement.
- `align-items-center` : Centre verticalement.
- `justify-content-between` : Écarte les éléments (un à gauche, un à droite).
- `gap-2` : Met un espace régulier de 2 entre les éléments enfants.

```html
<!-- Centrer parfaitement -->
<div class="d-flex justify-content-center align-items-center vh-100">
  <p>Je suis au centre de l'écran !</p>
</div>

<!-- Une ligne avec des éléments espacés -->
<div class="d-flex justify-content-between align-items-center mb-3">
  <h2>Titre à gauche</h2>
  <button class="btn btn-primary">Bouton à droite</button>
</div>
```

---

## 🧩 5. Les Composants d'Interface (UI)

Voici TOUS les composants essentiels pour construire ton application.

### 🔘 Boutons et Boutons Groupés
```html
<button class="btn btn-primary">Bouton Normal</button>
<button class="btn btn-outline-success">Bouton Transparent (Contour)</button>
<button class="btn btn-danger btn-sm">Petit bouton</button>
<button class="btn btn-warning btn-lg">Gros bouton</button>

<div class="btn-group" role="group">
  <button type="button" class="btn btn-secondary">Gauche</button>
  <button type="button" class="btn btn-secondary">Milieu</button>
  <button type="button" class="btn btn-secondary">Droite</button>
</div>
```

### 🏷️ Badges (Étiquettes)
```html
<h1>Notifications <span class="badge bg-danger">4</span></h1>
<span class="badge rounded-pill text-bg-info">Tag arrondi</span>
```

### 🃏 Cartes (Cards)
Le composant le plus utilisé pour structurer du contenu en blocs. En mode sombre, elles ont automatiquement une belle teinte grisée avec une légère bordure.
```html
<div class="card" style="width: 18rem;">
  <div class="card-header">En-tête de la carte</div>
  <div class="card-body">
    <h5 class="card-title">Titre principal</h5>
    <h6 class="card-subtitle mb-2 text-muted">Sous-titre discret</h6>
    <p class="card-text">Texte descriptif de ma carte géniale.</p>
    <a href="#" class="btn btn-primary">Go !</a>
  </div>
  <div class="card-footer text-muted">Mise à jour il y a 2h</div>
</div>
```

### ⚠️ Alertes
Pour afficher des messages importants.
```html
<div class="alert alert-success" role="alert">
  Opération réussie avec succès !
</div>
<div class="alert alert-danger d-flex align-items-center" role="alert">
  <i class="bi bi-exclamation-triangle-fill me-2"></i> <!-- Si tu as bootstrap-icons -->
  <div>Attention, un problème est survenu.</div>
</div>
```

### 🗂️ Tables (Tableaux)
En Dark Mode natif, la classe `table` s'adapte automatiquement.
```html
<table class="table table-striped table-hover table-bordered">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Prénom</th>
      <th scope="col">Nom</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>John</td>
      <td>Doe</td>
      <td><button class="btn btn-sm btn-danger">Supprimer</button></td>
    </tr>
  </tbody>
</table>
```

### 📝 Formulaires (Inputs)
Le design des formulaires est superbe en Dark Mode. L'effet "Floating labels" donne un style très moderne façon Material Design.

**Simple :**
```html
<div class="mb-3">
  <label for="email" class="form-label">Adresse Email</label>
  <input type="email" class="form-control" id="email" placeholder="nom@exemple.com">
</div>
<div class="mb-3">
  <label for="desc" class="form-label">Description</label>
  <textarea class="form-control" id="desc" rows="3"></textarea>
</div>
```

**Floating Labels (Le plus beau) :**
```html
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Adresse Email</label>
</div>
```

**Menus Déroulants (Select) :**
Ne jamais utiliser `<select>` sans classe. Toujours utiliser `form-select`. En Dark Mode natif (grâce à `data-bs-theme="dark"` au-dessus), la flèche et le fond s'adaptent parfaitement !
```html
<select class="form-select mb-3" aria-label="Menu de sélection">
  <option selected>Ouvrir ce menu</option>
  <option value="1">Un</option>
  <option value="2">Deux</option>
</select>

<!-- Select taille réduite -->
<select class="form-select form-select-sm">
  <option>Petit select</option>
</select>
```

**Upload de Fichier (File Input) :**
Utiliser `form-control` comme pour un input normal, Bootstrap s'occupe de styliser le bouton "Parcourir..." automatiquement.
```html
<div class="mb-3">
  <label for="formFile" class="form-label">Uploader un document</label>
  <input class="form-control" type="file" id="formFile">
</div>
```

**Checkboxes et Switches :**
```html
<div class="form-check form-switch mb-4">
  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
  <label class="form-check-label" for="flexSwitchCheckDefault">Activer les notifications</label>
</div>
```

### 🖼️ Images
Bootstrap propose des classes fantastiques pour rendre les images "responsives" (elles ne dépassent jamais de l'écran) et leur donner un style Pro.
```html
<!-- img-fluid : l'image ne dépassera jamais la largeur de son conteneur parent -->
<img src="mon-image.jpg" class="img-fluid" alt="Image responsive">

<!-- rounded : arrondit légèrement les coins (toujours mieux) -->
<img src="mon-image.jpg" class="img-fluid rounded" alt="...">

<!-- img-thumbnail : Ajoute une jolie bordure claire façon miniature (parfait en Dark Mode) -->
<img src="mon-image.jpg" class="img-thumbnail" alt="...">
```

### 🔄 Spinners (Chargement)
```html
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Chargement...</span>
</div>
<div class="spinner-grow text-danger" role="status"></div>
```

### ☰ Navbar (Barre de navigation)
Voici une barre de navigation complète, collée en haut, avec le menu hamburger qui marche sur mobile (grâce au JS).
```html
<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Mon App</a>
    
    <!-- Bouton mobile -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <!-- Liens du menu -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto"> <!-- ms-auto pousse le menu à droite -->
        <li class="nav-item">
          <a class="nav-link active" href="#">Accueil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Paramètres</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
<!-- Ajoute un mt-5 à ton container principal si tu utilises une fixed-top navbar -->
```

### 🪟 Modales (Fenêtres Pop-up)
Le code se divise en deux : le bouton qui déclenche, et la structure cachée de la modale.
```html
<!-- Bouton déclencheur -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#maModale">
  Ouvrir Modale
</button>

<!-- La Modale -->
<div class="modal fade" id="maModale" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title">Titre de la fenêtre</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
      </div>
      
      <div class="modal-body">
        <p>Voici le contenu de ta modale. Le fond sera sombre et adapté.</p>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary">Sauvegarder</button>
      </div>
      
    </div>
  </div>
</div>
```

### 📂 Accordéon (Collapse)
Idéal pour une FAQ ou masquer des gros blocs.
```html
<div class="accordion" id="accordionExemple">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUn">
        Question 1
      </button>
    </h2>
    <div id="collapseUn" class="accordion-collapse collapse show" data-bs-parent="#accordionExemple">
      <div class="accordion-body">
        Réponse à la question 1.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDeux">
        Question 2
      </button>
    </h2>
    <div id="collapseDeux" class="accordion-collapse collapse" data-bs-parent="#accordionExemple">
      <div class="accordion-body">
        Réponse fermée par défaut.
      </div>
    </div>
  </div>
</div>
```

### ➡️ Offcanvas (Panneau latéral glissant)
Très à la mode pour les menus ou les filtres de recherche.
```html
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#panneauLateral">
  Ouvrir le menu latéral
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="panneauLateral">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title">Menu</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <p>Liens du menu ici...</p>
    <div class="d-grid gap-2">
      <button class="btn btn-outline-info">Accueil</button>
      <button class="btn btn-outline-info">Profil</button>
    </div>
  </div>
</div>
```

---

## 🛠️ 6. Les Helpers (Astuces Utiles)

- `d-none` : Cache complètement l'élément.
- `d-md-block d-none` : Caché sur téléphone, mais s'affiche à partir de l'écran "md" (tablette).
- `w-100` : Force l'élément à prendre 100% de la largeur (très utile sur les boutons).
- `rounded`, `rounded-3`, `rounded-circle` : Arrondit les coins de l'élément.
- `border`, `border-primary`, `border-0` : Ajoute ou enlève des bordures.
- `shadow-sm`, `shadow`, `shadow-lg` : Ajoute une ombre (moins visible en mode sombre, mais donne de la profondeur).
- `overflow-hidden` : Empêche le contenu de déborder de sa boîte.
- `text-truncate` : Si ton texte est trop long, il le coupe et ajoute "..." à la fin (magique pour les titres longs !).

---
*Fin de la bible Bootstrap. Tu as sous les yeux tout ce qu'il te faut pour créer 100% de ton interface sans toucher à une ligne de CSS, le tout optimisé en mode sombre !*
