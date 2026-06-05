# Calcul de Marge, Marque et Rentabilité d'une Vente

## 📊 Introduction

Quand tu vends un produit, tu dois connaître **ta rentabilité réelle**. Deux concepts fondamentaux :

- **La marge** : Le profit réel en euros (ou %)
- **La marque** (ou **markup**) : L'augmentation prix par rapport au coût

⚠️ **Attention:** Beaucoup de gens confondent marge et marque. C'est une erreur classique !

---

## 🔢 Les formules essentielles

### 1. Marge brute (en euros)

$$\text{Marge brute} = \text{Prix de vente HT} - \text{Coût d'achat HT}$$

**Exemple:**
- Coût d'achat : 10€
- Prix de vente : 20€
- **Marge brute = 20 - 10 = 10€**

### 2. Marge nette (en %)

$$\text{Marge \%} = \frac{\text{Prix de vente HT} - \text{Coût d'achat HT}}{\text{Prix de vente HT}} \times 100$$

**Exemple:**
- Coût d'achat : 10€
- Prix de vente : 20€
- **Marge % = (20 - 10) / 20 × 100 = 50%**

### 3. Marque / Markup (en %)

$$\text{Markup \%} = \frac{\text{Prix de vente HT} - \text{Coût d'achat HT}}{\text{Coût d'achat HT}} \times 100$$

**Exemple:**
- Coût d'achat : 10€
- Prix de vente : 20€
- **Markup % = (20 - 10) / 10 × 100 = 100%**

### 4. Coefficient multiplicateur

$$\text{Coefficient} = \frac{\text{Prix de vente HT}}{\text{Coût d'achat HT}}$$

**Exemple:**
- Coût d'achat : 10€
- Prix de vente : 20€
- **Coefficient = 20 / 10 = 2** (on multiplie le coût par 2)

---

## 🎯 La différence entre Marge et Marque

### Exemple concret

**Situation:** Tu achètes un produit 100€ et le revends 150€

| Métrique | Formule | Calcul | Résultat |
|----------|---------|--------|----------|
| **Marge brute** | PV - CA | 150 - 100 | **50€** |
| **Marge %** | (PV - CA) / PV × 100 | (150 - 100) / 150 × 100 | **33,33%** |
| **Markup %** | (PV - CA) / CA × 100 | (150 - 100) / 100 × 100 | **50%** |
| **Coefficient** | PV / CA | 150 / 100 | **1,5x** |

### 🚨 Le piège classique

Si tu dis "J'ai une marque de 50%", ça veut dire:
- Coût: 100€
- Tu rajoutes 50% de marge = 100 + 50 = **150€** ✅

Mais si tu dis "J'ai une marge de 50%", ça veut dire:
- Coût: 100€
- Tu fais 50% de profit sur le prix de vente → **PV = 200€** ✗

**Conclusion:** Une marque de 50% ≠ une marge de 50% !

---

## 💰 Formules de calcul inversées

### Calculer le prix de vente à partir du coût et de la marque %

$$\text{Prix de vente HT} = \text{Coût d'achat HT} \times (1 + \frac{\text{Marque \%}}{100})$$

**Exemple:** Coût 100€, marque 50%
- PV = 100 × (1 + 50/100) = 100 × 1,5 = **150€** ✅

### Calculer le prix de vente à partir du coût et de la marge %

$$\text{Prix de vente HT} = \frac{\text{Coût d'achat HT}}{1 - \frac{\text{Marge \%}}{100}}$$

**Exemple:** Coût 100€, marge 33,33%
- PV = 100 / (1 - 0,3333) = 100 / 0,6667 = **150€** ✅

### Calculer le coût à partir du prix de vente et de la marge %

$$\text{Coût d'achat HT} = \text{Prix de vente HT} \times (1 - \frac{\text{Marge \%}}{100})$$

**Exemple:** PV 150€, marge 33,33%
- Coût = 150 × (1 - 0,3333) = 150 × 0,6667 = **100€** ✅

---

## 📈 Exemples pratiques

### Cas 1: Grossiste qui vend au détaillant

| Élément | Valeur |
|---------|--------|
| **Coût d'achat du grossiste** | 50€ |
| **Prix de vente du grossiste** | 80€ |
| **Marge brute du grossiste** | 80 - 50 = **30€** |
| **Marge % du grossiste** | 30 / 80 × 100 = **37,5%** |
| **Marque du grossiste** | 30 / 50 × 100 = **60%** |

### Cas 2: Détaillant qui vend au client

| Élément | Valeur |
|---------|--------|
| **Coût d'achat du détaillant** | 80€ (prix grossiste) |
| **Prix de vente TTC au client** | 120€ TTC |
| **Prix de vente HT au client** | 120 / 1,20 = **100€ HT** |
| **Marge brute du détaillant** | 100 - 80 = **20€** |
| **Marge % du détaillant** | 20 / 100 × 100 = **20%** |
| **Marque du détaillant** | 20 / 80 × 100 = **25%** |

### Cas 3: Chaîne complète producteur → client

```
┌─────────────────┐
│   PRODUCTEUR    │
│   Coût: 20€     │
│   Vend: 50€     │ ← Marque: 150%, Marge: 60%
└────────┬────────┘
         │
┌────────▼────────┐
│  GROSSISTE      │
│   Coût: 50€     │
│   Vend: 80€     │ ← Marque: 60%, Marge: 37,5%
└────────┬────────┘
         │
┌────────▼────────┐
│  DÉTAILLANT     │
│   Coût: 80€     │
│   Vend: 120€HT  │ ← Marque: 50%, Marge: 33,33%
│         (144€TTC)│
└─────────────────┘
```

**Note:** Chaque intermédiaire prend sa marge, d'où l'inflation progressive du prix !

---

## 🛒 Marge vs Marque : Tableau comparatif

| Aspect | Marge | Marque |
|--------|-------|--------|
| **Base de calcul** | Prix de vente | Coût d'achat |
| **Dénominateur** | PV | CA |
| **Interprétation** | % de profit sur le prix de vente | % d'augmentation du coût |
| **Exemple** | 100€ coût, 50€ profit = 33% marge | 100€ coût, +100€ marque = 100% marque |
| **Usage** | Comptabilité, analyse financière | Commerce, pricing |
| **Plus faible que** | Marge < Marque (toujours) | Marque > Marge (toujours) |

### Relation mathématique

$$\text{Si Marque} = M\% \text{ alors Marge} = \frac{M}{100 + M} \times 100\%$$

**Exemple:** Marque 50%
- Marge = 50 / (100 + 50) × 100 = 50 / 150 × 100 = **33,33%**

---

## ✅ Checklist : Calcul de rentabilité réelle

### Données minimales à connaître

- ✔️ **Coût d'achat HT** du produit (prix facture fournisseur)
- ✔️ **Prix de vente HT** au client (sans taxes)
- ✔️ **TVA appliquée** (pour information, mais ne compte pas dans la marge)
- ✔️ **Frais additionnels** (transport, stockage, emballage, etc.)

### Calculs à faire

```javascript
// 1. Marge brute
const margeBrute = prixVenteHT - coutAchatHT;

// 2. Marge %
const margePourcent = (margeBrute / prixVenteHT) * 100;

// 3. Marque %
const marquePercent = (margeBrute / coutAchatHT) * 100;

// 4. Coefficient multiplicateur
const coefficient = prixVenteHT / coutAchatHT;

// 5. Rentabilité avec frais
const fraisTotal = transportHT + stockageHT + emballageHT;
const margeNette = margeBrute - fraisTotal;
const margeNettePourcent = (margeNette / prixVenteHT) * 100;
```

---

## 💡 Cas avec frais (réalité du terrain)

### Exemple complet

| Élément | Valeur |
|---------|--------|
| **Coût d'achat HT** | 100€ |
| **Frais de transport HT** | 5€ |
| **Frais de stockage HT** | 3€ |
| **Frais d'emballage HT** | 2€ |
| **Coût total réel HT** | 100 + 5 + 3 + 2 = **110€** |
| **Prix de vente HT** | 150€ |
| **Marge brute** | 150 - 100 = 50€ |
| **Marge nette (réelle)** | 150 - 110 = **40€** |
| **Marge nette %** | 40 / 150 × 100 = **26,67%** |

⚠️ **Attention:** Tu croyais avoir 33% de marge, mais tu n'en as que 26,67% une fois les frais déduits !

---

## 🎓 Tableau récapitulatif : Tous les calculs

### Donnés: CA=100€ HT, PV=150€ HT

| Métrique | Formule | Résultat |
|----------|---------|----------|
| Marge brute (€) | PV - CA | 50€ |
| Marge (%) | (PV - CA) / PV × 100 | 33,33% |
| Marque (%) | (PV - CA) / CA × 100 | 50% |
| Coefficient | PV / CA | 1,5 |
| Prix TTC (TVA 20%) | PV × 1,20 | 180€ |
| Rentabilité | Marge / CA | 0,5 |

---

## ⚠️ Pièges et erreurs courants

### ❌ Piège 1: Confondre marge et marque

**Faux:** "J'ai une marge de 50%, donc je dois multiplier le coût par 1,5"
**Vrai:** "Une marge de 50% signifie PV = Coût / 0,5 = Coût × 2"

### ❌ Piège 2: Oublier les frais

Tu calcules une marge de 30% sans compter les frais de livraison, stockage, etc.
→ **Ta marge réelle sera plus faible !**

### ❌ Piège 3: Mélanger HT et TTC

Ne JAMAIS calculer la marge en mélange HT et TTC. Les formules doivent être **cohérentes**.

### ❌ Piège 4: Ignorer les remises client

Si tu offres une remise de 10% au client:
- PV = 150€
- Remise = -15€
- PV réel encaissé = 135€
- **Ta marge réelle = 135 - 100 = 35€, pas 50€ !**

### ❌ Piège 5: La TVA n'est pas un profit

La TVA que tu collèves (20%) n'est **pas ton profit**, c'est de l'argent que tu dois reverser à l'État !

---

## 🚀 Objectifs de marge par secteur

### Benchmarks généraux

| Secteur | Marge typique | Marque typique |
|---------|---------------|----------------|
| **Hypermarché** | 5-15% | 5-18% |
| **Boutique retail** | 30-50% | 43-100% |
| **E-commerce** | 20-40% | 25-67% |
| **Restauration** | 60-70% | 150-233% |
| **Luxe** | 50-80% | 100-400% |
| **Services** | 40-70% | 67-233% |

---

## 📋 Résumé pour PrestaShop

Si tu dois implémenter ça dans PrestaShop, voici les données clés à stocker:

```sql
-- Table de suivi de marges
CREATE TABLE product_margin (
  id_product INT PRIMARY KEY,
  cost_ht DECIMAL(20,6),           -- Coût d'achat HT
  selling_price_ht DECIMAL(20,6),  -- Prix de vente HT
  transport_cost DECIMAL(20,6),    -- Frais de transport
  storage_cost DECIMAL(20,6),      -- Frais de stockage
  packaging_cost DECIMAL(20,6),    -- Frais d'emballage
  gross_margin DECIMAL(20,6),      -- Marge brute (calculée)
  margin_percent DECIMAL(5,2),     -- Marge % (calculée)
  markup_percent DECIMAL(5,2),     -- Marque % (calculée)
  date_updated TIMESTAMP
);
```

### Fonctions PHP pour calculer

```php
function calculateMargin($costHT, $sellingPriceHT, $totalFees = 0) {
    $grossMargin = $sellingPriceHT - $costHT;
    $netMargin = $grossMargin - $totalFees;
    $marginPercent = ($netMargin / $sellingPriceHT) * 100;
    $markupPercent = ($netMargin / $costHT) * 100;
    
    return [
        'gross_margin' => $grossMargin,
        'net_margin' => $netMargin,
        'margin_percent' => $marginPercent,
        'markup_percent' => $markupPercent,
        'coefficient' => $sellingPriceHT / $costHT
    ];
}

// Utilisation
$result = calculateMargin(100, 150, 10);
// ['gross_margin' => 50, 'net_margin' => 40, 'margin_percent' => 26.67, ...]
```

