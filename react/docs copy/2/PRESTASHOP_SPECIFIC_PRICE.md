# PrestaShop - Specific Price (ps_specific_price)

## Overview

La table `ps_specific_price` est **l'une des tables les plus importantes de PrestaShop**. Elle gère **toutes les promotions, les soldes, les prix de gros et les réductions spécifiques** que tu vois dans l'onglet "Prix" d'une fiche produit.

Dès que le prix de base d'un produit doit être modifié selon certaines conditions (pour un client précis, un pays, à partir de 5 articles achetés, pendant le Black Friday, etc.), PrestaShop crée une ligne dans cette table.

C'est le système de **remises et tarifications conditionnelles** de PrestaShop.

---

## Structure de la table

### 1. L'identification

| Champ | Type | Description |
|-------|------|-------------|
| `id_specific_price` | `int unsigned` (PRI) | La clé primaire, l'identifiant unique de cette règle de prix (auto-incrémenté) |

### 2. La cible (Sur quoi s'applique la réduction ?)

| Champ | Type | Description |
|-------|------|-------------|
| `id_product` | `int unsigned` (MUL) | L'ID du produit concerné |
| `id_product_attribute` | `int unsigned` (MUL) | L'ID de la déclinaison/combinaison (ex: T-shirt Rouge - Taille M). Si `0`, s'applique à **toutes** les déclinaisons du produit |

### 3. Le contexte (Pour qui est cette réduction ?)

**Important:** Dans PrestaShop, la valeur **`0`** dans ces colonnes agit comme un **joker** qui signifie **"Tous"** ou **"Toutes"**.

| Champ | Type | Description |
|-------|------|-------------|
| `id_shop` | `int unsigned` | Identifiant du magasin (0 = toutes les boutiques, en mode multiboutique) |
| `id_shop_group` | `int unsigned` | Groupe de magasins (0 = tous les groupes) |
| `id_currency` | `int unsigned` | La devise (0 = toutes les devises) |
| `id_country` | `int unsigned` (MUL) | Le pays de livraison (0 = tous les pays) |
| `id_group` | `int unsigned` | Le groupe de clients, ex: "B2B", "Clients VIP", "Grossistes" (0 = tous les groupes) |
| `id_customer` | `int unsigned` (MUL) | L'ID d'un client précis pour une remise personnalisée (0 = tous les clients) |

### 4. Le montant (Quelle est la promotion ?)

**⚠️ Subtilité importante:** Il y a une différence cruciale entre `price` et `reduction`.

| Champ | Type | Description |
|-------|------|-------------|
| `price` | `decimal(20,6)` | **Force un prix fixe unique.** Si tu mets `15.000000`, le produit coûtera 15€, peu importe son prix de base. Si tu mets `-1`, PrestaShop prend le prix de base du produit et lui applique la réduction définie dans `reduction`. |
| `reduction` | `decimal(20,6)` | La valeur de la remise. Ex: `10.00` pour -10€ ou `0.15` pour -15% |
| `reduction_type` | `enum('amount','percentage')` | Type de remise: `'amount'` (montant fixe en €) ou `'percentage'` (pourcentage, ex: `0.15` = 15%) |
| `reduction_tax` | `tinyint(1)` | `1` si la réduction inclut les taxes (TTC), `0` si elle est hors taxes (HT) |

### 5. Les conditions de déclenchement (Quand et comment ?)

| Champ | Type | Description |
|-------|------|-------------|
| `from_quantity` | `mediumint unsigned` (MUL) | **Prix dégressifs:** Si tu mets `3`, la promotion ne s'applique que si le client ajoute **au moins 3 fois** ce produit au panier. Par défaut: `1` |
| `from` | `datetime` (MUL) | Date et heure de **début** de la promotion. `0000-00-00 00:00:00` = sans limite |
| `to` | `datetime` (MUL) | Date et heure de **fin** de la promotion. `0000-00-00 00:00:00` = sans limite (promotion illimitée dans le temps) |

### 6. Les liaisons système

| Champ | Type | Description |
|-------|------|-------------|
| `id_specific_price_rule` | `int unsigned` (MUL) | Si cette ligne a été générée automatiquement par une "Règle de prix catalogue" (règle globale), l'ID de cette règle apparaîtra ici. Si `0`, c'est un prix spécifique créé **manuellement** sur la fiche produit |
| `id_cart` | `int unsigned` (MUL) | Historiquement utilisé pour lier un prix spécifique à un panier précis (assez rare, généralement à `0`) |

---

## Exemples d'utilisation

### Exemple 1: Remise de groupe (Prix VIP)
```sql
-- Les membres du groupe VIP (id_group=3) bénéficient d'une remise de 10%
INSERT INTO ps_specific_price VALUES (
    NULL,                    -- id_specific_price (auto-incrémenté)
    0,                       -- id_specific_price_rule (règle manuelle)
    0,                       -- id_cart (non utilisé)
    5,                       -- id_product (produit 5)
    1,                       -- id_shop (boutique 1)
    0,                       -- id_shop_group (0 = toutes les boutiques)
    0,                       -- id_currency (0 = toutes les devises)
    0,                       -- id_country (0 = tous les pays)
    3,                       -- id_group (groupe VIP)
    0,                       -- id_customer (0 = tous les clients du groupe)
    0,                       -- id_product_attribute (0 = tous les attributs)
    -1,                      -- price (-1 = garder le prix de base du produit)
    0.10,                    -- reduction (10% de remise)
    1,                       -- reduction_tax (1 = TTC)
    'percentage',            -- reduction_type (pourcentage)
    '0000-00-00 00:00:00',   -- from (sans limite)
    '0000-00-00 00:00:00'    -- to (sans limite)
);
```

### Exemple 2: Prix fixe personnalisé pour client spécifique
```sql
-- Le client 42 a un prix fixe personnalisé de 50€ (prix de gros)
INSERT INTO ps_specific_price VALUES (
    NULL,
    0,
    0,
    5,                       -- id_product
    1,
    0,
    0,
    0,
    0,                       -- id_group (0 = tous les groupes)
    42,                      -- id_customer (client 42 uniquement)
    0,
    50.00,                   -- price (prix fixe de 50€, remplace le prix de base)
    0.00,                    -- reduction (ignoré si price est défini)
    1,
    'amount',
    '0000-00-00 00:00:00',
    '0000-00-00 00:00:00'
);
```

### Exemple 3: Prix dégressif par quantité (Tarif progressif)
```sql
-- À partir de 10 unités achetées, remise de 5€ par article
INSERT INTO ps_specific_price VALUES (
    NULL,
    0,
    0,
    5,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    -1,                      -- price (-1 = garder le prix de base)
    5.00,                    -- reduction (5€ de remise)
    1,
    'amount',
    '0000-00-00 00:00:00',
    '0000-00-00 00:00:00',
    10                       -- from_quantity (remise à partir de 10 unités)
);
```

### Exemple 4: Promotion temporaire avec date limite (Black Friday)
```sql
-- Remise de 20% du 28 novembre au 1er décembre 2026
INSERT INTO ps_specific_price VALUES (
    NULL,
    0,
    0,
    5,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    -1,
    0.20,                    -- reduction (20% de remise)
    1,
    'percentage',
    '2026-11-28 00:00:00',   -- from (début de la promo)
    '2026-12-01 23:59:59'    -- to (fin de la promo)
);
```

### Exemple 5: Prix dégressif avec plusieurs paliers
```sql
-- À partir de 3 articles: -2€ par article
INSERT INTO ps_specific_price (id_product, id_shop, reduction, reduction_type, from_quantity)
VALUES (5, 1, 2.00, 'amount', 3);

-- À partir de 10 articles: -5€ par article
INSERT INTO ps_specific_price (id_product, id_shop, reduction, reduction_type, from_quantity)
VALUES (5, 1, 5.00, 'amount', 10);

-- À partir de 20 articles: -8€ par article
INSERT INTO ps_specific_price (id_product, id_shop, reduction, reduction_type, from_quantity)
VALUES (5, 1, 8.00, 'amount', 20);
```

---

## 💡 Points clés à comprendre

### Le joker `0` et `NULL`

| Contexte | Signification |
|----------|---------------|
| `id_currency = 0` | S'applique à **toutes les devises** |
| `id_country = 0` | S'applique à **tous les pays** |
| `id_group = 0` | S'applique à **tous les groupes de clients** |
| `id_customer = 0` | S'applique à **tous les clients** |
| `id_product_attribute = 0` | S'applique à **toutes les déclinaisons** du produit |

### `price = -1` vs `price` = chiffre

| Cas | Comportement |
|-----|-------------|
| `price = -1` | **Garde le prix de base du produit** et applique la réduction définie dans `reduction` |
| `price = 15.00` | **Force un prix fixe de 15€**, peu importe le prix de base. C'est un prix forfaitaire. |
| `price = NULL` | Pas de prix fixe, la réduction de `reduction` s'applique au prix de base |

### Dates valides

| Format | Signification |
|--------|---------------|
| `'0000-00-00 00:00:00'` | **Sans limite**, la promo est permanente |
| `'2026-11-28 00:00:00'` | Début de la promotion à cette date |
| `'2026-12-01 23:59:59'` | Fin de la promotion à cette date |

---

## 🎯 Priorité et résolution des prix

Quand plusieurs règles s'appliquent, PrestaShop utilise la règle la **plus spécifique** (du plus au moins spécifique):

1️⃣ **Client spécifique** (`id_customer > 0`) — **LA PLUS SPÉCIFIQUE**
2️⃣ **Groupe de clients** (`id_group > 0`)
3️⃣ **Pays** (`id_country > 0`)
4️⃣ **Devise** (`id_currency > 0`)
5️⃣ **Quantité** (`from_quantity > 1`)
6️⃣ **Panier** (`id_cart > 0`)
7️⃣ **Prix de base du produit** — **LA MOINS SPÉCIFIQUE**

### Exemple de résolution

Si un client VIP (groupe 3) achète 5 unités du produit 5, PrestaShop cherchera dans cet ordre:
1. Y a-t-il une règle pour ce **client 42 + produit 5**?
2. Y a-t-il une règle pour le **groupe VIP + produit 5**?
3. Y a-t-il une règle pour **5 unités + produit 5**?
4. Sinon, prend le **prix de base du produit**.

---

## ✅ Cas d'usage courants

✔️ **Remises par groupe de clients** (Détaillants, Grossistes, B2B)
✔️ **Tarifs progressifs** (Plus tu achètes, moins cher c'est)
✔️ **Promotions temporaires** (Soldes, Black Friday, codes promo)
✔️ **Tarifs par pays/devise** (Adaptation prix internationale)
✔️ **Prix VIP/client spécifique** (Clients fidèles, contrats personnalisés)
✔️ **Prix de gros vs prix détail** (Distributeurs)
✔️ **Combinaisons d'attributs** (Prix spécifique pour une couleur/taille)
✔️ **Remises panier** (À partir de tel montant total)

---

## ⚠️ Pièges courants

❌ **Oublier de mettre `0` comme wildcard** → La règle ne s'applique que dans des cas très précis
❌ **Mélanger `price` fixe et `reduction`** → Le `price` prime, `reduction` devient additionnel
❌ **Dates invalides** (`NULL` au lieu de `0000-00-00`) → Comportement imprévisible
❌ **Trop de règles spécifiques** → Impact sur les performances du site
❌ **Ne pas vérifier les priorités** → Une règle non spécifique cache une plus spécifique

