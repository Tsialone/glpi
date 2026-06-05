# Étape 1 : Le Socle de Sécurité

Dans GLPI, la gestion des droits ne se résume pas à un simple rôle "Admin" ou "User" global. C'est un espace en trois dimensions. GLPI veut savoir : **Qui tu es, Dans quelle pièce tu te trouves, et Quelle casquette tu portes.**

## 1. L'Authentification API : "Qui toque à la porte ?"
Pour parler à l'API REST de GLPI, une application (comme un front-end React) va devoir passer un double sas de sécurité :
- **L'App-Token** : C'est la clé de l'application. Il dit à GLPI : *"Je suis l'app React interne, j'ai le droit de communiquer avec toi"*.
- **Le Session-Token** : C'est le passeport de l'utilisateur. Pour l'obtenir, on fournit un *User-Token* personnel (ou des identifiants). Il identifie l'humain ou le compte de service qui effectue l'action.

## 2. L'arbre des Entités : "Dans quelle pièce te trouves-tu ?"
Imaginez que la base de données de GLPI est un immense gratte-ciel.
- Le hall principal, c'est l'**Entité Racine** (Root entity).
- Chaque entreprise, département ou zone géographique est un étage (ex: `Racine > Filiale Europe > DSI`).

Les entités construisent des murs étanches (invisibles) entre les données. Un ordinateur ou un ticket appartient *toujours* à une entité. 
C'est ici qu'entre en jeu un concept vital : **la récursivité**. 
Si l'on donne accès à un utilisateur sur la `Filiale Europe` en mode **strict**, il ne voit que ce qui est dans ce dossier exact. S'il est en mode **récursif**, les planchers deviennent transparents pour lui : il voit la `Filiale Europe` ET tout ce qui se trouve en dessous (la `DSI`, les `RH`, etc.).

## 3. La matrice des Profils : "Quelle est ta casquette ?"
Un profil dans GLPI (ex: Super-Admin, Technicien, Self-Service) est un ensemble très fin de permissions (lire un ticket, purger un ordinateur...).
L'ADN de GLPI repose sur le **multi-positionnement**. Un utilisateur n'est pas "Technicien" dans l'absolu. Il est "Technicien" **sur une entité précise**.

Un utilisateur peut très bien être :
- *Directeur* sur `Racine` (en strict, pour voir les données globales).
- *Technicien* sur `Racine > Filiale Europe > DSI` (en récursif).
- *Observateur* (lecture seule) sur `Racine > Filiale Asie`.

Lorsqu'il navigue (et lorsqu'il utilise l'API), l'utilisateur doit définir son **Profil actif** et son **Entité active**. L'API ne renverra pas les mêmes données et n'autorisera pas les mêmes actions selon la casquette qu'il a "chaussée" à cet instant T dans sa session.

---

**Question de validation (Architecture React) :**
Au vu de ce fonctionnement matriciel (Utilisateur X Entité X Profil), pourquoi un simple booléen `isAdmin` ou `isTechnician` dans l'état de l'application React sera insuffisant ? Comment envisager conceptuellement de gérer ce contexte (Entité active / Profil actif) lorsque l'utilisateur voudra interagir avec les futurs composants ?
