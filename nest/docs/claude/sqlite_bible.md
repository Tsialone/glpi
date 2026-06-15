# 📚 Bible SQLite — Référence Complète

> **Linux** · SQLite 3 · Dernière mise à jour : 2025

---

## Table des matières

1. [Installation & CLI](#1-installation--cli)
2. [Types de données](#2-types-de-données)
3. [Créer & gérer les bases](#3-créer--gérer-les-bases)
4. [DDL — Définir les tables](#4-ddl--définir-les-tables)
5. [DML — Manipuler les données](#5-dml--manipuler-les-données)
6. [SELECT — Interroger les données](#6-select--interroger-les-données)
7. [Jointures](#7-jointures)
8. [Sous-requêtes](#8-sous-requêtes)
9. [Fonctions intégrées](#9-fonctions-intégrées)
10. [Contraintes & Clés](#10-contraintes--clés)
11. [Index](#11-index)
12. [Vues (VIEWS)](#12-vues-views)
13. [Triggers](#13-triggers)
14. [Transactions](#14-transactions)
15. [Commandes spéciales `.` (dot commands)](#15-commandes-spéciales--dot-commands)
16. [Cas pratiques & patterns](#16-cas-pratiques--patterns)
17. [Erreurs fréquentes](#17-erreurs-fréquentes)

---

## 1. Installation & CLI

```bash
# Installer SQLite sur Linux (Debian/Ubuntu)
sudo apt update
sudo apt install sqlite3

# Vérifier la version
sqlite3 --version

# Ouvrir / créer une base
sqlite3 ma_base.db

# Ouvrir en mode lecture seule
sqlite3 -readonly ma_base.db

# Exécuter une commande directement depuis le shell
sqlite3 ma_base.db "SELECT * FROM users;"

# Exécuter un fichier SQL
sqlite3 ma_base.db < script.sql
# ou dans le CLI :
.read script.sql
```

---

## 2. Types de données

SQLite utilise un système de **typage dynamique** appelé **Type Affinity** (affinité de type).

| Affinity | Types déclarés correspondants |
|----------|-------------------------------|
| `INTEGER` | INT, INTEGER, TINYINT, SMALLINT, BIGINT, INT2, INT8 |
| `REAL` | REAL, DOUBLE, FLOAT |
| `TEXT` | TEXT, CHAR, VARCHAR, CLOB |
| `BLOB` | BLOB, (rien) |
| `NUMERIC` | NUMERIC, DECIMAL, BOOLEAN, DATE, DATETIME |

> ⚠️ SQLite n'a **pas** de type BOOLEAN natif. On utilise `0` (faux) et `1` (vrai).  
> ⚠️ SQLite n'a **pas** de type DATE natif. Les dates sont stockées en TEXT (`'YYYY-MM-DD'`), REAL (Julian Day), ou INTEGER (Unix timestamp).

### Règle de coercition
SQLite essaie de convertir automatiquement la valeur selon l'affinité de la colonne.

```sql
-- Exemple : INTEGER affinity accepte '42' et le stocke comme entier
CREATE TABLE test (n INTEGER);
INSERT INTO test VALUES ('42');  -- stocké comme entier 42
```

---

## 3. Créer & gérer les bases

```bash
# Créer une nouvelle base (créée si elle n'existe pas)
sqlite3 nouvelle_base.db

# Quitter le CLI
.quit
# ou
.exit
# ou Ctrl+D
```

SQLite stocke toute la base dans **un seul fichier** `.db` (ou `.sqlite`, `.sqlite3`).

---

## 4. DDL — Définir les tables

### CREATE TABLE

```sql
CREATE TABLE employes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nom       TEXT    NOT NULL,
    prenom    TEXT    NOT NULL,
    salaire   REAL    DEFAULT 0.0,
    dept_id   INTEGER,
    email     TEXT    UNIQUE,
    actif     INTEGER DEFAULT 1,  -- booléen
    createdAt TEXT    DEFAULT (datetime('now'))
);
```

### CREATE TABLE IF NOT EXISTS

```sql
CREATE TABLE IF NOT EXISTS employes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
);
```

### ALTER TABLE

SQLite supporte **très peu** d'ALTER TABLE :

```sql
-- Ajouter une colonne (UNIQUEMENT)
ALTER TABLE employes ADD COLUMN telephone TEXT;

-- Renommer une table
ALTER TABLE employes RENAME TO salaries;

-- Renommer une colonne (SQLite >= 3.25.0)
ALTER TABLE employes RENAME COLUMN nom TO last_name;
```

> ⚠️ **Impossible** de supprimer une colonne avec ALTER TABLE (avant SQLite 3.35.0).  
> Pour supprimer une colonne avant 3.35.0 : recréer la table.

```sql
-- Supprimer une colonne (SQLite >= 3.35.0)
ALTER TABLE employes DROP COLUMN telephone;
```

### DROP TABLE

```sql
DROP TABLE employes;
DROP TABLE IF EXISTS employes;
```

### TRUNCATE (n'existe pas dans SQLite)

```sql
-- Équivalent de TRUNCATE :
DELETE FROM employes;
-- Remettre l'autoincrement à zéro :
DELETE FROM sqlite_sequence WHERE name = 'employes';
```

---

## 5. DML — Manipuler les données

### INSERT

```sql
-- Insertion simple
INSERT INTO employes (nom, prenom, salaire) VALUES ('Dupont', 'Jean', 3500.0);

-- Plusieurs lignes
INSERT INTO employes (nom, prenom) VALUES
    ('Martin', 'Alice'),
    ('Bernard', 'Bob'),
    ('Durand', 'Claire');

-- INSERT OR REPLACE (remplace si conflit de clé unique)
INSERT OR REPLACE INTO employes (id, nom, prenom) VALUES (1, 'Dupont', 'Jean');

-- INSERT OR IGNORE (ignore si conflit)
INSERT OR IGNORE INTO employes (email, nom) VALUES ('jean@mail.com', 'Dupont');

-- Insérer depuis un SELECT
INSERT INTO archive_employes SELECT * FROM employes WHERE actif = 0;
```

### UPDATE

```sql
-- Mettre à jour une ligne
UPDATE employes SET salaire = 4000 WHERE id = 1;

-- Mettre à jour plusieurs colonnes
UPDATE employes
SET salaire = salaire * 1.1,
    actif = 1
WHERE dept_id = 3;

-- UPDATE sans WHERE → toutes les lignes !
UPDATE employes SET actif = 0;
```

### DELETE

```sql
-- Supprimer une ligne
DELETE FROM employes WHERE id = 5;

-- Supprimer avec condition
DELETE FROM employes WHERE salaire < 1000 AND actif = 0;

-- Supprimer tout (sans WHERE)
DELETE FROM employes;
```

---

## 6. SELECT — Interroger les données

### Structure générale

```sql
SELECT   [DISTINCT] colonnes
FROM     table
[JOIN    autre_table ON condition]
[WHERE   condition]
[GROUP BY colonnes]
[HAVING  condition_sur_groupes]
[ORDER BY colonnes [ASC|DESC]]
[LIMIT   n [OFFSET m]];
```

### Exemples de base

```sql
-- Toutes les colonnes
SELECT * FROM employes;

-- Colonnes spécifiques
SELECT nom, prenom, salaire FROM employes;

-- Alias de colonnes
SELECT nom AS "Nom de famille", salaire * 12 AS salaire_annuel FROM employes;

-- Distinct (valeurs uniques)
SELECT DISTINCT dept_id FROM employes;
```

### WHERE — Filtres

```sql
-- Comparaisons
SELECT * FROM employes WHERE salaire > 3000;
SELECT * FROM employes WHERE salaire BETWEEN 2000 AND 4000;
SELECT * FROM employes WHERE dept_id IN (1, 2, 5);
SELECT * FROM employes WHERE dept_id NOT IN (3, 4);

-- NULL
SELECT * FROM employes WHERE email IS NULL;
SELECT * FROM employes WHERE email IS NOT NULL;

-- Texte
SELECT * FROM employes WHERE nom = 'Dupont';
SELECT * FROM employes WHERE nom LIKE 'Du%';      -- commence par Du
SELECT * FROM employes WHERE nom LIKE '%on';      -- finit par on
SELECT * FROM employes WHERE nom LIKE '%pon%';    -- contient pon
SELECT * FROM employes WHERE nom LIKE 'D_pont';   -- _ = un seul caractère

-- Combinaisons logiques
SELECT * FROM employes WHERE salaire > 3000 AND dept_id = 1;
SELECT * FROM employes WHERE dept_id = 1 OR dept_id = 2;
SELECT * FROM employes WHERE NOT actif = 1;
```

### ORDER BY

```sql
-- Tri croissant (défaut)
SELECT * FROM employes ORDER BY salaire;
SELECT * FROM employes ORDER BY salaire ASC;

-- Tri décroissant
SELECT * FROM employes ORDER BY salaire DESC;

-- Tri multi-colonnes
SELECT * FROM employes ORDER BY dept_id ASC, salaire DESC;

-- NULL en dernier (par défaut SQLite met NULL en premier avec ASC)
SELECT * FROM employes ORDER BY salaire ASC NULLS LAST;
```

### LIMIT / OFFSET

```sql
-- 10 premiers résultats
SELECT * FROM employes LIMIT 10;

-- Page 2 (résultats 11 à 20)
SELECT * FROM employes LIMIT 10 OFFSET 10;

-- Équivalent compact
SELECT * FROM employes LIMIT 10, 10;  -- LIMIT offset, count
```

### GROUP BY / HAVING

```sql
-- Compter par département
SELECT dept_id, COUNT(*) AS nb_employes
FROM employes
GROUP BY dept_id;

-- Salaire moyen par département
SELECT dept_id,
       COUNT(*)      AS nb,
       AVG(salaire)  AS moy,
       MIN(salaire)  AS min,
       MAX(salaire)  AS max,
       SUM(salaire)  AS total
FROM employes
GROUP BY dept_id;

-- HAVING filtre sur les groupes (après GROUP BY)
SELECT dept_id, AVG(salaire) AS moy
FROM employes
GROUP BY dept_id
HAVING moy > 3000;

-- WHERE vs HAVING
SELECT dept_id, AVG(salaire) AS moy
FROM employes
WHERE actif = 1          -- filtre AVANT groupement
GROUP BY dept_id
HAVING moy > 2500;       -- filtre APRÈS groupement
```

---

## 7. Jointures

### INNER JOIN

```sql
-- Ne retourne que les lignes qui ont une correspondance dans les deux tables
SELECT e.nom, e.prenom, d.nom AS departement
FROM employes e
INNER JOIN departements d ON e.dept_id = d.id;
```

### LEFT JOIN (LEFT OUTER JOIN)

```sql
-- Toutes les lignes de gauche + correspondance à droite (NULL si pas de match)
SELECT e.nom, d.nom AS departement
FROM employes e
LEFT JOIN departements d ON e.dept_id = d.id;
```

### CROSS JOIN

```sql
-- Produit cartésien (toutes les combinaisons)
SELECT e.nom, d.nom
FROM employes e
CROSS JOIN departements d;
```

> ⚠️ SQLite **ne supporte pas** RIGHT JOIN ni FULL OUTER JOIN nativement.  
> Astuce pour simuler un FULL OUTER JOIN :

```sql
SELECT e.nom, d.nom FROM employes e LEFT JOIN departements d ON e.dept_id = d.id
UNION
SELECT e.nom, d.nom FROM departements d LEFT JOIN employes e ON e.dept_id = d.id;
```

### Jointure sur plusieurs conditions

```sql
SELECT * FROM commandes c
JOIN lignes_commande l ON c.id = l.commande_id AND l.actif = 1;
```

### Auto-jointure (self join)

```sql
-- Trouver le manager d'un employé (table employes avec colonne manager_id)
SELECT e.nom AS employe, m.nom AS manager
FROM employes e
LEFT JOIN employes m ON e.manager_id = m.id;
```

---

## 8. Sous-requêtes

### Dans WHERE

```sql
-- Employés qui gagnent plus que la moyenne
SELECT nom, salaire
FROM employes
WHERE salaire > (SELECT AVG(salaire) FROM employes);

-- Employés dans les départements avec plus de 5 personnes
SELECT nom FROM employes
WHERE dept_id IN (
    SELECT dept_id FROM employes GROUP BY dept_id HAVING COUNT(*) > 5
);
```

### Dans FROM (table dérivée)

```sql
SELECT dept_id, moy
FROM (
    SELECT dept_id, AVG(salaire) AS moy
    FROM employes
    GROUP BY dept_id
) AS stats
WHERE moy > 3000;
```

### Avec EXISTS / NOT EXISTS

```sql
-- Départements qui ont au moins un employé
SELECT * FROM departements d
WHERE EXISTS (
    SELECT 1 FROM employes e WHERE e.dept_id = d.id
);

-- Départements sans aucun employé
SELECT * FROM departements d
WHERE NOT EXISTS (
    SELECT 1 FROM employes e WHERE e.dept_id = d.id
);
```

### CTE — Common Table Expressions (WITH)

```sql
-- CTE simple
WITH salaires_dept AS (
    SELECT dept_id, AVG(salaire) AS moy
    FROM employes
    GROUP BY dept_id
)
SELECT d.nom, s.moy
FROM departements d
JOIN salaires_dept s ON d.id = s.dept_id
WHERE s.moy > 3000;

-- CTE multiple
WITH
    actifs AS (SELECT * FROM employes WHERE actif = 1),
    par_dept AS (SELECT dept_id, COUNT(*) AS nb FROM actifs GROUP BY dept_id)
SELECT d.nom, p.nb
FROM departements d
JOIN par_dept p ON d.id = p.dept_id;

-- CTE récursive (ex: arborescence)
WITH RECURSIVE categorie_tree AS (
    -- Ancre (base)
    SELECT id, nom, parent_id, 0 AS niveau
    FROM categories WHERE parent_id IS NULL
    UNION ALL
    -- Partie récursive
    SELECT c.id, c.nom, c.parent_id, t.niveau + 1
    FROM categories c
    JOIN categorie_tree t ON c.parent_id = t.id
)
SELECT * FROM categorie_tree ORDER BY niveau, nom;
```

---

## 9. Fonctions intégrées

### Fonctions d'agrégation

| Fonction | Description |
|----------|-------------|
| `COUNT(*)` | Nombre de lignes |
| `COUNT(col)` | Nombre de valeurs non-NULL |
| `COUNT(DISTINCT col)` | Nombre de valeurs distinctes |
| `SUM(col)` | Somme |
| `AVG(col)` | Moyenne |
| `MIN(col)` | Minimum |
| `MAX(col)` | Maximum |
| `GROUP_CONCAT(col)` | Concatène les valeurs en une chaîne |
| `GROUP_CONCAT(col, sep)` | Concatène avec séparateur |

```sql
SELECT
    COUNT(*)               AS total,
    COUNT(email)           AS avec_email,
    COUNT(DISTINCT dept_id) AS nb_departements,
    SUM(salaire)           AS masse_salariale,
    AVG(salaire)           AS salaire_moyen,
    MIN(salaire)           AS plus_bas,
    MAX(salaire)           AS plus_haut,
    GROUP_CONCAT(nom, ', ') AS liste_noms
FROM employes;
```

### Fonctions de texte

```sql
LENGTH('bonjour')           -- 7
UPPER('bonjour')            -- 'BONJOUR'
LOWER('BONJOUR')            -- 'bonjour'
SUBSTR('bonjour', 1, 3)     -- 'bon'  (index commence à 1)
SUBSTR('bonjour', 4)        -- 'jour'
TRIM('  bonjour  ')         -- 'bonjour'
LTRIM('  bonjour')          -- 'bonjour'
RTRIM('bonjour  ')          -- 'bonjour'
REPLACE('bonjour', 'o', '0') -- 'b0nj0ur'
INSTR('bonjour', 'jour')    -- 4 (position, 0 si absent)
PRINTF('%05d', 42)          -- '00042'
PRINTF('%.2f', 3.14159)     -- '3.14'
```

### Fonctions numériques

```sql
ABS(-5)           -- 5
ROUND(3.567, 2)   -- 3.57
ROUND(3.567)      -- 4
MAX(1, 2, 3)      -- 3  (aussi fonction scalaire)
MIN(1, 2, 3)      -- 1
```

### Fonctions de date/heure

```sql
-- Date/heure actuelle
datetime('now')              -- '2025-06-11 14:30:00' (UTC)
date('now')                  -- '2025-06-11'
time('now')                  -- '14:30:00'
strftime('%Y', 'now')        -- '2025'
strftime('%Y-%m-%d', 'now')  -- '2025-06-11'

-- Formatage
strftime('%d/%m/%Y', '2025-06-11')  -- '11/06/2025'
strftime('%H:%M', datetime('now'))  -- '14:30'

-- Modificateurs
date('now', '+7 days')       -- dans 7 jours
date('now', '-1 month')      -- il y a 1 mois
date('now', 'start of month') -- premier jour du mois
date('now', 'start of year') -- premier jour de l'année

-- Différence entre dates (en jours)
julianday('2025-12-31') - julianday('2025-01-01')  -- 364.0

-- Unix timestamp
strftime('%s', 'now')         -- timestamp UNIX (secondes)
datetime(1700000000, 'unixepoch')  -- depuis un timestamp
```

### Fonctions de contrôle de flux

```sql
-- COALESCE : retourne le premier non-NULL
COALESCE(NULL, NULL, 42, 99)   -- 42
COALESCE(email, 'inconnu')     -- email ou 'inconnu' si NULL

-- NULLIF : retourne NULL si les deux valeurs sont égales
NULLIF(salaire, 0)              -- NULL si salaire = 0, sinon salaire

-- IIF (SQLite >= 3.32.0)
IIF(salaire > 3000, 'senior', 'junior')

-- CASE expression
CASE dept_id
    WHEN 1 THEN 'Informatique'
    WHEN 2 THEN 'RH'
    WHEN 3 THEN 'Finance'
    ELSE 'Autre'
END

-- CASE recherché (conditions)
CASE
    WHEN salaire < 2000 THEN 'bas'
    WHEN salaire < 4000 THEN 'moyen'
    ELSE 'élevé'
END AS tranche_salaire
```

### Fonctions de type

```sql
typeof(42)          -- 'integer'
typeof(3.14)        -- 'real'
typeof('hello')     -- 'text'
typeof(NULL)        -- 'null'
typeof(X'FF')       -- 'blob'

CAST('42' AS INTEGER)   -- 42
CAST(3.99 AS INTEGER)   -- 3
CAST(42 AS TEXT)        -- '42'
```

---

## 10. Contraintes & Clés

### PRIMARY KEY

```sql
-- Entier auto-incrémenté
CREATE TABLE t (id INTEGER PRIMARY KEY AUTOINCREMENT);

-- WITHOUT ROWID (optimisation pour petites tables)
CREATE TABLE t (code TEXT PRIMARY KEY, valeur TEXT) WITHOUT ROWID;

-- Clé primaire composite
CREATE TABLE commande_produit (
    commande_id INTEGER,
    produit_id  INTEGER,
    PRIMARY KEY (commande_id, produit_id)
);
```

> 💡 `INTEGER PRIMARY KEY` est un alias pour le ROWID de SQLite → auto-incrémenté même sans `AUTOINCREMENT`.  
> `AUTOINCREMENT` garantit que les IDs ne sont jamais réutilisés (légèrement plus lent).

### FOREIGN KEY

```sql
-- IMPORTANT : Les clés étrangères sont désactivées par défaut dans SQLite !
PRAGMA foreign_keys = ON;  -- À activer à chaque connexion

CREATE TABLE employes (
    id      INTEGER PRIMARY KEY,
    dept_id INTEGER REFERENCES departements(id),
    -- ou forme longue :
    dept_id INTEGER,
    FOREIGN KEY (dept_id) REFERENCES departements(id)
        ON DELETE CASCADE
        ON UPDATE SET NULL
);
```

**Actions ON DELETE / ON UPDATE :**

| Action | Description |
|--------|-------------|
| `CASCADE` | Supprime/met à jour les lignes enfants automatiquement |
| `SET NULL` | Met NULL dans la colonne enfant |
| `SET DEFAULT` | Met la valeur par défaut |
| `RESTRICT` | Interdit la suppression si des enfants existent |
| `NO ACTION` | Comportement par défaut (vérification à la fin) |

### UNIQUE

```sql
CREATE TABLE users (
    email TEXT UNIQUE,                    -- contrainte inline
    UNIQUE (nom, prenom)                  -- contrainte composite
);
```

### NOT NULL

```sql
CREATE TABLE t (
    nom TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 0
);
```

### CHECK

```sql
CREATE TABLE employes (
    salaire REAL CHECK(salaire >= 0),
    age     INTEGER CHECK(age BETWEEN 18 AND 70),
    genre   TEXT CHECK(genre IN ('M', 'F', 'Autre'))
);
```

### DEFAULT

```sql
CREATE TABLE t (
    createdAt TEXT DEFAULT (datetime('now')),
    actif     INTEGER DEFAULT 1,
    statut    TEXT DEFAULT 'en_attente'
);
```

---

## 11. Index

```sql
-- Créer un index
CREATE INDEX idx_employes_nom ON employes(nom);

-- Index unique
CREATE UNIQUE INDEX idx_employes_email ON employes(email);

-- Index composite
CREATE INDEX idx_employes_dept_sal ON employes(dept_id, salaire);

-- Index partiel (seulement certaines lignes)
CREATE INDEX idx_employes_actifs ON employes(nom) WHERE actif = 1;

-- Supprimer un index
DROP INDEX idx_employes_nom;
DROP INDEX IF EXISTS idx_employes_nom;

-- Voir les index d'une table
PRAGMA index_list('employes');

-- Voir les colonnes d'un index
PRAGMA index_info('idx_employes_nom');
```

> 💡 Les indexes accélèrent les SELECT mais ralentissent les INSERT/UPDATE/DELETE.  
> Créer un index sur les colonnes souvent utilisées dans WHERE, JOIN, ORDER BY.

---

## 12. Vues (VIEWS)

```sql
-- Créer une vue
CREATE VIEW vue_employes_actifs AS
SELECT e.id, e.nom, e.prenom, e.salaire, d.nom AS departement
FROM employes e
LEFT JOIN departements d ON e.dept_id = d.id
WHERE e.actif = 1;

-- Utiliser une vue (comme une table)
SELECT * FROM vue_employes_actifs WHERE salaire > 3000;

-- Supprimer une vue
DROP VIEW vue_employes_actifs;
DROP VIEW IF EXISTS vue_employes_actifs;

-- Voir les vues existantes
SELECT name FROM sqlite_master WHERE type = 'view';
```

> ⚠️ Les vues SQLite sont **en lecture seule** par défaut (sauf si on définit des triggers INSTEAD OF).

---

## 13. Triggers

```sql
-- Trigger AFTER INSERT
CREATE TRIGGER after_insert_employe
AFTER INSERT ON employes
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (action, table_name, record_id, date_action)
    VALUES ('INSERT', 'employes', NEW.id, datetime('now'));
END;

-- Trigger BEFORE UPDATE
CREATE TRIGGER before_update_salaire
BEFORE UPDATE OF salaire ON employes
FOR EACH ROW
WHEN NEW.salaire < 0
BEGIN
    SELECT RAISE(ABORT, 'Le salaire ne peut pas être négatif');
END;

-- Trigger AFTER DELETE
CREATE TRIGGER after_delete_employe
AFTER DELETE ON employes
FOR EACH ROW
BEGIN
    UPDATE departements
    SET nb_employes = nb_employes - 1
    WHERE id = OLD.dept_id;
END;

-- Trigger sur une vue (INSTEAD OF)
CREATE TRIGGER insert_vue_employe
INSTEAD OF INSERT ON vue_employes_actifs
FOR EACH ROW
BEGIN
    INSERT INTO employes (nom, prenom, salaire) VALUES (NEW.nom, NEW.prenom, NEW.salaire);
END;

-- Supprimer un trigger
DROP TRIGGER after_insert_employe;

-- Voir les triggers
SELECT name FROM sqlite_master WHERE type = 'trigger';
```

**Références dans les triggers :**
- `NEW.colonne` → nouvelle valeur (INSERT, UPDATE)
- `OLD.colonne` → ancienne valeur (UPDATE, DELETE)
- `RAISE(ABORT, 'message')` → annule l'opération
- `RAISE(FAIL, 'message')` → annule la commande
- `RAISE(IGNORE)` → ignore l'opération silencieusement

---

## 14. Transactions

```sql
-- Transaction manuelle
BEGIN;
  UPDATE comptes SET solde = solde - 100 WHERE id = 1;
  UPDATE comptes SET solde = solde + 100 WHERE id = 2;
COMMIT;

-- Annuler une transaction
BEGIN;
  DELETE FROM employes WHERE dept_id = 5;
ROLLBACK;  -- annule tout

-- SAVEPOINT (points de sauvegarde intermédiaires)
BEGIN;
  INSERT INTO t VALUES (1);
  SAVEPOINT sp1;
  INSERT INTO t VALUES (2);
  ROLLBACK TO sp1;  -- annule jusqu'au savepoint
  RELEASE sp1;      -- libère le savepoint
COMMIT;

-- Types de transactions
BEGIN DEFERRED;    -- défaut, verrou acquis à la première écriture
BEGIN IMMEDIATE;   -- verrou en écriture immédiat
BEGIN EXCLUSIVE;   -- verrou exclusif immédiat (bloque tous les autres)
```

---

## 15. Commandes spéciales `.` (dot commands)

Ces commandes sont **propres au CLI SQLite** (pas du SQL standard).

```
.help                         -- Aide sur toutes les commandes
.quit  ou  .exit              -- Quitter

-- Navigation
.databases                    -- Lister les bases attachées
.tables                       -- Lister les tables
.tables employes              -- Tables dont le nom contient 'employes'
.schema                       -- Afficher le schéma de toutes les tables
.schema employes              -- Schéma d'une table précise

-- Affichage
.headers on                   -- Afficher les noms de colonnes
.mode column                  -- Affichage en colonnes alignées
.mode table                   -- Affichage en tableau (box drawing)
.mode csv                     -- Format CSV
.mode json                    -- Format JSON
.width 20 10 15               -- Largeur des colonnes (mode column)
.nullvalue 'NULL'             -- Affichage des valeurs NULL

-- Import / Export
.output fichier.txt           -- Rediriger la sortie vers un fichier
.output stdout                -- Revenir à la sortie standard
.import data.csv ma_table     -- Importer un CSV
.dump                         -- Exporter toute la base en SQL
.dump employes                -- Exporter une table

-- Exécution
.read script.sql              -- Exécuter un fichier SQL
.timer on                     -- Afficher le temps d'exécution

-- Informations
.indexes ma_table             -- Index d'une table
pragma table_info(employes);  -- Colonnes d'une table (via SQL)
```

---

## 16. Cas pratiques & patterns

### Obtenir des infos sur le schéma

```sql
-- Toutes les tables
SELECT name FROM sqlite_master WHERE type = 'table';

-- Schéma d'une table
PRAGMA table_info(employes);
-- Retourne : cid, name, type, notnull, dflt_value, pk

-- Clés étrangères d'une table
PRAGMA foreign_key_list(employes);

-- Vérifier si une table existe
SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='employes';
```

### Upsert (INSERT ou UPDATE)

```sql
-- Si la clé existe → UPDATE, sinon → INSERT
INSERT INTO employes (id, nom, salaire)
VALUES (1, 'Dupont', 4000)
ON CONFLICT(id) DO UPDATE SET
    nom = excluded.nom,
    salaire = excluded.salaire;

-- Ignorer si conflit
INSERT OR IGNORE INTO employes (email, nom) VALUES ('a@b.com', 'Test');
```

### Pagination

```sql
-- Page n (commence à 0), taille page = 10
SELECT * FROM employes
ORDER BY id
LIMIT 10 OFFSET (n * 10);
```

### Recherche full-text simple

```sql
SELECT * FROM employes
WHERE nom LIKE '%dupont%' OR prenom LIKE '%dupont%';
```

### Copier une table

```sql
-- Copier structure et données
CREATE TABLE employes_backup AS SELECT * FROM employes;

-- Copier seulement la structure
CREATE TABLE employes_vide AS SELECT * FROM employes WHERE 0;
```

### Supprimer les doublons

```sql
-- Garder la ligne avec le plus petit ROWID
DELETE FROM employes
WHERE rowid NOT IN (
    SELECT MIN(rowid)
    FROM employes
    GROUP BY nom, prenom
);
```

### Numérotation des lignes (ROW_NUMBER)

```sql
-- SQLite >= 3.25 supporte les fonctions de fenêtrage
SELECT
    ROW_NUMBER() OVER (ORDER BY salaire DESC) AS rang,
    nom,
    salaire
FROM employes;

-- Rang par département
SELECT
    nom,
    dept_id,
    salaire,
    RANK() OVER (PARTITION BY dept_id ORDER BY salaire DESC) AS rang_dept
FROM employes;
```

### Fonctions de fenêtrage (Window Functions)

```sql
SELECT
    nom,
    salaire,
    AVG(salaire) OVER ()                           AS moy_globale,
    AVG(salaire) OVER (PARTITION BY dept_id)       AS moy_dept,
    SUM(salaire) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING) AS cumul,
    LAG(salaire)  OVER (ORDER BY id)               AS salaire_precedent,
    LEAD(salaire) OVER (ORDER BY id)               AS salaire_suivant,
    NTILE(4) OVER (ORDER BY salaire)               AS quartile
FROM employes;
```

### ATTACH — Plusieurs bases

```sql
-- Attacher une autre base
ATTACH DATABASE 'autre_base.db' AS autre;

-- Requêter les deux bases
SELECT * FROM employes e
JOIN autre.departements d ON e.dept_id = d.id;

-- Détacher
DETACH DATABASE autre;
```

### Optimisation — EXPLAIN

```sql
-- Plan d'exécution
EXPLAIN QUERY PLAN SELECT * FROM employes WHERE dept_id = 3;

-- Voir les opcodes (très bas niveau)
EXPLAIN SELECT * FROM employes WHERE dept_id = 3;
```

### PRAGMAs utiles

```sql
PRAGMA foreign_keys = ON;          -- Activer les clés étrangères
PRAGMA journal_mode = WAL;         -- Mode WAL (meilleur pour la concurrence)
PRAGMA synchronous = NORMAL;       -- Équilibre performance/sécurité
PRAGMA cache_size = -64000;        -- Cache de 64 Mo
PRAGMA auto_vacuum = FULL;         -- Libérer l'espace après DELETE
VACUUM;                            -- Compacter la base manuellement
PRAGMA integrity_check;            -- Vérifier l'intégrité
PRAGMA quick_check;                -- Vérification rapide
PRAGMA user_version = 1;           -- Stocker la version du schéma
```

---

## 17. Erreurs fréquentes

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| `FOREIGN KEY constraint failed` | FK non respectée | Vérifier les données ou activer `PRAGMA foreign_keys = ON` |
| `UNIQUE constraint failed` | Valeur dupliquée sur une colonne unique | Utiliser `INSERT OR IGNORE` ou `ON CONFLICT` |
| `NOT NULL constraint failed` | NULL sur une colonne NOT NULL | Fournir une valeur ou définir un DEFAULT |
| `no such table` | Table inexistante ou mauvaise base | Vérifier `.tables`, vérifier la connexion à la bonne base |
| `no such column` | Nom de colonne erroné | Vérifier `PRAGMA table_info(table)` |
| `syntax error` | Erreur de syntaxe SQL | Vérifier les virgules, guillemets, parenthèses |
| `database is locked` | Écriture simultanée | Utiliser `PRAGMA journal_mode = WAL` |
| `SQLITE_CONSTRAINT` | Contrainte violée | Identifier laquelle (FK, UNIQUE, CHECK, NOT NULL) |

---

## Aide-mémoire rapide

```sql
-- Structure d'un SELECT complet
SELECT DISTINCT col1, AGG(col2) AS alias
FROM table1 t1
JOIN table2 t2 ON t1.id = t2.fk_id
WHERE condition
GROUP BY col1
HAVING AGG(col2) > valeur
ORDER BY col1 DESC
LIMIT n OFFSET m;

-- Ordre d'exécution logique (≠ ordre d'écriture) :
-- FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
```

---

*Bonne chance pour ton exam ! 🎯*
