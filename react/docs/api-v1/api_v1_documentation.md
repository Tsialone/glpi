# Documentation Complète et Détaillée de l'API REST v1 de GLPI

Bienvenue dans la documentation exhaustive de l'API REST v1 de GLPI. Cette API (souvent appelée "Legacy API" depuis l'arrivée de la v2) vous permet d'interagir programmatiquement avec votre instance GLPI pour automatiser des tâches, synchroniser des données ou créer des intégrations tierces.

---

## 🔒 1. Concepts Généraux et Authentification

L'API GLPI est basée sur les standards REST. Les échanges se font au format JSON.

### Prérequis
Avant toute chose, vous devez configurer l'API dans GLPI :
1. Allez dans **Configuration > Générale > API**.
2. Activez l'API REST.
3. Ajoutez un **Client API** pour générer un `App-Token` (recommandé pour la sécurité).

### Les Tokens
Pour faire des requêtes, vous utiliserez généralement ces en-têtes HTTP :
- `App-Token` : Jeton de l'application cliente (pour identifier l'application qui fait la requête).
- `Session-Token` : Jeton de session (obtenu après authentification).
- `Authorization` : Utilisé pour passer les identifiants (`Basic base64(user:pass)`) ou un token utilisateur (`user_token xxx`).

---

## 🔑 2. Gestion des Sessions (Endpoints de Connexion)

Ces endpoints permettent d'initialiser, de configurer et de fermer votre session API.

### `GET /initSession`
**Description :** Initialise une nouvelle session sur l'API GLPI et retourne un `Session-Token`.
**En-têtes requis :** `App-Token` (si configuré), `Authorization` (Basic Auth ou `user_token`).
**Exemple de réponse :**
```json
{
  "session_token": "83c3e80b...5a6792"
}
```

### `GET /killSession`
**Description :** Détruit la session active. Vous devez vous reconnecter après cela.
**En-têtes requis :** `App-Token`, `Session-Token`.

### `GET /getFullSession`
**Description :** Retourne l'intégralité du contenu (payload) de la session PHP actuelle. Très utile pour débugger les droits, les préférences utilisateur ou les entités chargées.
**En-têtes requis :** `Session-Token`.

---

## 👤 3. Gestion de l'Utilisateur Connecté (Profils et Entités)

GLPI gère finement les droits via des "Profils" et des "Entités". Ces endpoints vous permettent de naviguer au sein de vos permissions.

### `GET /getMyProfiles`
**Description :** Retourne la liste de tous les profils auxquels l'utilisateur authentifié a accès.
**En-têtes requis :** `Session-Token`.

### `GET /getActiveProfile`
**Description :** Retourne le profil actuellement actif pour la session en cours.

### `POST /changeActiveProfile`
**Description :** Change le profil actif de la session.
**Corps de la requête (JSON) :** `{"profiles_id": 4}`

### `GET /getMyEntities`
**Description :** Retourne la liste de toutes les entités auxquelles l'utilisateur a accès avec le profil actuel.

### `GET /getActiveEntities`
**Description :** Retourne l'entité (ou les entités si récursif) actuellement active(s).

### `POST /changeActiveEntities`
**Description :** Modifie l'entité active pour la session.
**Corps de la requête (JSON) :** `{"entities_id": 0, "is_recursive": true}`

---

## ⚙️ 4. Configuration et Outils

### `GET /getGlpiConfig`
**Description :** Récupère la configuration générale de l'instance GLPI (paramètres système, versions, etc.).

### `GET /listSearchOptions/:itemtype`
**Description :** Liste toutes les options de recherche disponibles pour un "itemtype" (type d'objet, ex: `Computer`, `Ticket`).
C'est indispensable pour savoir quels IDs utiliser lors des recherches (`/search`).
**Exemple :** `GET /listSearchOptions/Ticket`

### `GET /getMultipleItems`
**Description :** Permet de récupérer plusieurs objets de différents types en une seule requête.
**Paramètres URL :** `?items[0][itemtype]=Computer&items[0][items_id]=10&items[1][itemtype]=Ticket&items[1][items_id]=42`

---

## 📦 5. CRUD : Manipulation des Objets (Itemtypes)

L'API v1 de GLPI est orientée "Itemtype". Un itemtype correspond au nom de la classe PHP interne (ex: `Ticket`, `Computer`, `User`, `Location`, `NetworkEquipment`).

**Note sur les requêtes :**
Tous ces endpoints nécessitent le `Session-Token`.

### `GET /:itemtype`
**Description :** Liste les éléments de ce type. Par défaut, l'API pagine les résultats.
**Paramètres URL courants :**
- `expand_drodpowns=true` : Remplace les IDs (ex: `locations_id`) par la valeur textuelle correspondante.
- `get_hateoas=true` : Ajoute les liens HATEOAS pour naviguer dans l'API.
- `range=0-50` : Pagination (récupérer les éléments de 0 à 50).
**Exemple :** `GET /Ticket?expand_dropdowns=true`

### `GET /:itemtype/:id`
**Description :** Récupère les détails complets d'un élément spécifique grâce à son ID.
**Exemple :** `GET /Computer/15`

### `POST /:itemtype`
**Description :** Crée un nouvel élément.
**Corps de la requête (JSON) :**
Pour créer, la structure JSON doit généralement encapsuler les données dans un objet `input`.
```json
{
  "input": {
    "name": "Nouveau PC",
    "entities_id": 0,
    "locations_id": 5
  }
}
```
**Exemple :** `POST /Computer`

### `PUT /:itemtype/:id` (ou `PATCH /:itemtype/:id`)
**Description :** Met à jour partiellement ou totalement un élément existant.
**Corps de la requête (JSON) :**
```json
{
  "input": {
    "id": 15,
    "name": "Nouveau Nom du PC"
  }
}
```
**Exemple :** `PUT /Computer/15`

### `DELETE /:itemtype/:id`
**Description :** Supprime un élément. Par défaut, dans GLPI, cela place l'élément dans la **corbeille** (Soft Delete).
**Exemple :** `DELETE /User/4`

### `DELETE /:itemtype/:id?force_purge=true`
**Description :** Supprime **définitivement** l'élément, ignorant la corbeille. Attention, action irréversible.

---

## 🔍 6. Endpoint de Recherche Avancée

L'API GLPI propose un moteur de recherche extrêmement puissant, similaire à celui utilisé dans l'interface web de GLPI.

### `GET /search/:itemtype`
**Description :** Effectue une recherche multicritères complexe. Cet endpoint est la clé de voûte de l'extraction de données.
**Comment l'utiliser ?**
Il faut utiliser les paramètres URL `criteria`, `sort`, `order` et `range`. Les identifiants des champs à rechercher (ex: le champ 1 correspond au nom, le champ 2 à l'ID) sont récupérables via `GET /listSearchOptions/:itemtype`.

**Exemple de construction de requête :**
Rechercher les ordinateurs (Computer) dont le nom (champ 1) contient "Serveur" (opérateur `contains` : type de recherche 8) :
`GET /search/Computer?criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=Serveur`

*Les types de recherche (searchtype) :*
- `contains` (contient)
- `equals` (égal)
- `nots` (différent de)
- `morethan` (plus grand que)
- `lessthan` (plus petit que)

---

## 📎 7. Sous-éléments (Liaisons et Relations)

Certains endpoints permettent de lier des objets entre eux ou de récupérer les sous-éléments.

### `GET /:itemtype/:id/:sub_itemtype`
**Description :** Récupère les éléments liés à un parent.
**Exemple :** Récupérer tous les tickets liés à un ordinateur spécifique.
`GET /Computer/15/Ticket`

### `POST /:itemtype/:id/:sub_itemtype`
**Description :** Crée ou attache un sous-élément. Les possibilités dépendent de l'architecture interne de GLPI.

---

## 🛠️ 8. Gérer les Documents et Pièces jointes

La gestion des fichiers nécessite une approche spécifique car elle mélange données JSON et fichiers binaires (Multipart).

### `POST /Document`
**Description :** Pour uploader un fichier.
Vous devez faire une requête de type `multipart/form-data`.
- Le champ `uploadManifest` doit contenir le JSON (`{"input": {"name": "Ma pièce jointe"}}`).
- Les fichiers sont passés dans les données de formulaire (`filename[]`).

---

## 💡 Astuces et Bonnes Pratiques

1. **Tokens Applicatifs (`App-Token`) :** Utilisez toujours un App-Token. Cela permet de retracer l'origine de l'appel API dans les logs de GLPI et offre une couche de sécurité supplémentaire.
2. **Pagination (`range`) :** N'oubliez pas l'en-tête `Range` ou le paramètre d'URL `range` (ex: `0-100`) lors des requêtes `GET`. Sans cela, vos requêtes sur de grosses bases de données seront tronquées.
3. **Erreurs HTTP :** Les erreurs 400 (Bad Request) ou 401 (Unauthorized) sont souvent accompagnées d'un tableau JSON explicitant l'erreur (ex: champ manquant, token invalide).
4. **CORS :** Si vous appelez l'API depuis un navigateur (par exemple depuis une application React/Vue), assurez-vous d'avoir configuré l'URL de votre front-end dans les paramètres "CORS" de la configuration API de GLPI.

---

## 📚 9. Liste Exhaustive des Itemtypes (Objets GLPI)

Dans l'API GLPI, chaque objet métier est un `itemtype` qui correspond au nom exact de sa classe PHP interne. Vous pouvez utiliser n'importe lequel de ces itemtypes dans les URLs de l'API (ex: `GET /Computer`, `POST /Ticket`, `GET /search/User`).

Voici la liste la plus exhaustive des itemtypes standards présents dans GLPI, classés par catégorie :

### 🖥️ Parc (Assets)
- `Computer` (Ordinateurs)
- `Monitor` (Écrans)
- `NetworkEquipment` (Matériels réseau)
- `Software` (Logiciels)
- `SoftwareVersion` (Versions de logiciels)
- `SoftwareLicense` (Licences de logiciels)
- `Printer` (Imprimantes)
- `CartridgeItem` (Modèles de cartouches)
- `Cartridge` (Cartouches)
- `ConsumableItem` (Modèles de consommables)
- `Consumable` (Consommables)
- `Phone` (Téléphones)
- `Peripheral` (Périphériques)
- `Enclosure` (Boîtiers)
- `PDU` (Bandeaux d'alimentation)
- `Rack` (Baies)
- `Cluster` (Grappes)
- `Line` (Lignes)
- `Certificate` (Certificats)
- `Domain` (Domaines)
- `DomainRecord` (Enregistrements de domaines)

### 🧩 Composants d'un matériel (Devices)
- `DeviceMemory` (Mémoires RAM)
- `DeviceProcessor` (Processeurs CPU)
- `DeviceNetworkCard` (Cartes réseau)
- `DeviceDrive` (Disques/Lecteurs de stockage)
- `DeviceControl` (Contrôleurs)
- `DeviceGraphicCard` (Cartes graphiques)
- `DeviceSoundCard` (Cartes son)
- `DeviceMotherboard` (Cartes mères)
- `DevicePci` (Périphériques PCI)
- `DeviceCase` (Boîtiers)
- `DevicePowerSupply` (Alimentations)
- `DeviceSensor` (Capteurs)
- `DeviceBattery` (Batteries)
- `DeviceSimCard` (Cartes SIM)
- `DeviceCamera` (Caméras)
- `DeviceGeneric` (Périphériques génériques)
*Note : Il existe aussi les classes de liaison comme `Item_DeviceMemory`, `Item_DeviceProcessor`, etc.*

### 🆘 Assistance (Helpdesk)
- `Ticket` (Tickets d'incidents / demandes)
- `TicketTask` (Tâches associées aux tickets)
- `TicketFollowup` (Suivis/commentaires de tickets)
- `TicketValidation` (Approbations/Validations de tickets)
- `TicketCost` (Coûts des tickets)
- `Problem` (Problèmes)
- `ProblemTask` (Tâches de problèmes)
- `Change` (Changements)
- `ChangeTask` (Tâches de changements)
- `ChangeValidation` (Validations de changements)
- `Project` (Projets)
- `ProjectTask` (Tâches de projets)
- `ITILCategory` (Catégories de tickets/problèmes/changements)
- `SolutionTemplate` (Gabarits de solutions)
- `TicketTemplate` (Gabarits de tickets)
- `RequestType` (Sources de demande)
- `PendingReason` (Raisons de mise en attente)

### 💼 Gestion (Management)
- `Contact` (Contacts)
- `Supplier` (Fournisseurs)
- `Contract` (Contrats)
- `ContractType` (Types de contrats)
- `Document` (Documents/Fichiers)
- `DocumentCategory` (Catégories de documents)
- `Budget` (Budgets)
- `LineOperator` (Opérateurs de lignes téléphoniques)

### 🛠️ Outils (Tools)
- `Reminder` (Pense-bêtes / Notes publiques ou privées)
- `RSSFeed` (Flux RSS)
- `KnowledgeBaseItem` (Articles de la base de connaissances)
- `KnowbaseItemCategory` (Catégories de la base de connaissances)
- `SavedSearch` (Recherches sauvegardées / Marque-pages)

### ⚙️ Administration & Utilisateurs
- `User` (Utilisateurs)
- `Group` (Groupes d'utilisateurs)
- `Profile` (Profils / Droits)
- `Entity` (Entités de l'entreprise)
- `Rule` (Règles métiers)
- `RuleAction` (Actions des règles)
- `RuleCriteria` (Critères des règles)
- `Dictionary` (Dictionnaires logiciels/fabricants)

### 🗂️ Configuration, Réseau & Intitulés (Setup)
- `Location` (Lieux / Emplacements)
- `State` (Statuts des matériels : "En service", "En stock", etc.)
- `Manufacturer` (Fabricants)
- `Network` (Réseaux)
- `NetworkPort` (Ports réseau des équipements)
- `NetworkName` (Noms de réseau)
- `IPAddress` (Adresses IP)
- `FQDN` (Noms de domaine complets)
- `VLAN` (VLANs)
- `WifiNetwork` (Réseaux Wifi)
- `Netpoint` (Prises réseau murales)
- `OperatingSystem` (Systèmes d'exploitation)
- `OperatingSystemVersion` (Versions d'OS)
- `OperatingSystemArchitecture` (Architectures d'OS)
- `AutoUpdateSystem` (Systèmes de mise à jour)
- `Plugin` (Plugins installés)
- `Dropdown` (Désigne l'ensemble des menus déroulants simples. Chaque menu est aussi un itemtype, ex: `ComputerType`, `ComputerModel`, `TicketType`, `NetworkEquipmentModel`, etc.)

**⚡ Note Importante sur les Plugins :**
Si vous avez installé des plugins sur votre instance GLPI (comme *Formcreator*, *FusionInventory*, *GLPI Inventory*, *Fields*, etc.), ceux-ci ajoutent automatiquement leurs propres `itemtypes` à l'API.
- Exemple Formcreator : `PluginFormcreatorForm`
- Exemple Fields : `PluginFieldsComputerTaille`

---
*Ce document résume de manière exhaustive toutes les routes disponibles sur l'API GLPI V1, y compris la liste complète des objets manipulables. Prenez le temps de tester les requêtes (par exemple avec Postman, Bruno ou Insomnia) avant de les implémenter dans votre code.*
