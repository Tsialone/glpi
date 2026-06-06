# Guide des Types d'Actifs (Menu Assets vs Fichier d'Import)

Ce guide croise **uniquement** les types d'actifs présents dans le menu "Assets" de GLPI avec **strictement** les colonnes de votre fichier d'import actuel (`Name`, `Status`, `Location`, `Manufacturer`, `Model`, `Inventory_Number`, `User`).

J'ai également ajouté l'**endpoint API REST** correspondant à chaque type pour faciliter vos requêtes de création ou mise à jour.

---

## 1. Les Équipements Informatiques Standards (IT Assets)

**Concerne :** 
* `Computer` (Endpoint API : `/Computer`)
* `Monitor` (Endpoint API : `/Monitor`)
* `NetworkEquipment` (Endpoint API : `/NetworkEquipment`)
* `Peripheral` (Endpoint API : `/Peripheral`)
* `Printer` (Endpoint API : `/Printer`)
* `Phone` (Endpoint API : `/Phone`)
* `Unmanaged` (Endpoint API : `/Unmanaged`)

Ces équipements classiques prennent en charge la quasi-totalité des colonnes de votre fichier d'import.

* ✅ **Name** : Supporté
* ✅ **Status** : Supporté
* ✅ **Location** : Supporté
* ✅ **Manufacturer** : Supporté
* ✅ **Model** : Supporté
* ✅ **Inventory_Number** : Supporté
* ✅ **User** : Supporté

---

## 2. Les Infrastructures de Data Center (DC)

**Concerne :** 
* `Rack` (Endpoint API : `/Rack`)
* `Enclosure` (Endpoint API : `/Enclosure`)
* `PDU` (Endpoint API : `/PDU`)
* `PassiveDCEquipment` (Endpoint API : `/PassiveDCEquipment`)

Ces équipements sont des éléments d'infrastructure physique. Ils ont des modèles et un inventaire, mais n'appartiennent jamais à une personne.

* ✅ **Name** : Supporté
* ✅ **Status** : Supporté
* ✅ **Location** : Supporté (très important)
* ✅ **Manufacturer** : Supporté
* ✅ **Model** : Supporté
* ✅ **Inventory_Number** : Supporté
* ❌ **User** : Non supporté (une baie n'appartient pas à un utilisateur)

---

## 3. Les Logiciels (Immatériel)

**Concerne :** 
* `Software` (Endpoint API : `/Software`)

Les logiciels n'ayant pas de présence physique, de nombreuses colonnes matérielles de votre CSV ne s'y appliquent pas.

* ✅ **Name** : Supporté
* ❌ **Status** : Non supporté (les statuts existent plutôt sur les *Licences*)
* ❌ **Location** : Non supporté (un logiciel n'a pas de bureau physique)
* ✅ **Manufacturer** : Supporté (correspond à l'Éditeur / Publisher)
* ❌ **Model** : Non supporté (un logiciel utilise des *Versions*, pas des modèles matériels)
* ❌ **Inventory_Number** : Non supporté
* ✅ **User** : Supporté (Techniquement via l'assignation de licence)

---

## 4. Les Cartouches et Consommables (Stock)

**Concerne :** 
* `CartridgeItem` (Endpoint API : `/CartridgeItem`)
* `ConsumableItem` (Endpoint API : `/ConsumableItem`)

GLPI gère les "modèles" de cartouches/consommables et leur quantité, pas les objets individuels.

* ✅ **Name** : Supporté (nom du type de consommable)
* ❌ **Status** : Non supporté (l'objet n'est pas "En production", il est en stock ou épuisé)
* ✅ **Location** : Supporté (Lieu de stockage)
* ✅ **Manufacturer** : Supporté
* ❌ **Model** : Non supporté (l'objet est le modèle en lui-même)
* ❌ **Inventory_Number** : Non supporté (géré en lot/quantité, pas individuellement)
* ❌ **User** : Non supporté (lorsqu'il est donné à un utilisateur, il est retiré du stock)

---

## 5. Téléphonie : Les Cartes SIM

**Concerne :** 
* `Simcard` (Endpoint API : `/Item_DeviceSimcard`)

* ❌ **Name** : Non supporté
* ✅ **Status** : Supporté
* ✅ **Location** : Supporté
* ❌ **Manufacturer** : Non supporté
* ❌ **Model** : Non supporté
* ❌ **Inventory_Number** : Non supporté
* ✅ **User** : Supporté

---

## 6. La Connectique : Les Câbles

**Concerne :** 
* `Cable` (Endpoint API : `/Cable`)

* ✅ **Name** : Supporté
* ✅ **Status** : Supporté (ex: Connecté, Déconnecté)
* ❌ **Location** : Non supporté (la localisation se déduit automatiquement des équipements liés aux extrémités)
* ❌ **Manufacturer** : Non supporté
* ❌ **Model** : Non supporté (on utilise à la place le "Type de câble", sa "Couleur", sa "Longueur")
* ✅ **Inventory_Number** : Supporté
* ❌ **User** : Non supporté (appartient à l'infrastructure réseau)
