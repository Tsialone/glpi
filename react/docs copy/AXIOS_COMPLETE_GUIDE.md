# Axios - Guide Complet pour les Requêtes HTTP en JavaScript

## Table des Matières
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Utilisation de Base](#utilisation-de-base)
4. [Méthodes HTTP](#méthodes-http)
5. [Configuration](#configuration)
6. [Intercepteurs](#intercepteurs)
7. [Gestion des Erreurs](#gestion-des-erreurs)
8. [Requêtes Avancées](#requêtes-avancées)
9. [Upload de Fichiers](#upload-de-fichiers)
10. [Timeouts & Retry](#timeouts--retry)
11. [Requêtes Simultanées](#requêtes-simultanées)
12. [Intégration Frameworks](#intégration-frameworks)
13. [Exemples Pratiques](#exemples-pratiques)
14. [Bonnes Pratiques](#bonnes-pratiques)

---

## Introduction

**Axios** est une bibliothèque JavaScript basée sur des promesses pour effectuer des requêtes HTTP côté client et serveur.

### Avantages d'Axios
✅ Basé sur les **Promises** (syntaxe moderne async/await)
✅ Intercepteurs intégrés pour requêtes et réponses
✅ Timeouts et annulation de requêtes
✅ Requêtes simultanées avec `Promise.all()`
✅ Transformation automatique des données JSON
✅ Gestion des erreurs robuste
✅ Support des uploads de fichiers
✅ Fonctionne sur navigateur et Node.js
✅ Petit bundle (~13KB gzippé)

### Axios vs Fetch vs XHR

| Aspect | Axios | Fetch | XHR |
|--------|-------|-------|-----|
| Taille | ~13KB | Natif | Natif |
| Promises | ✅ | ✅ | ❌ |
| Timeouts | ✅ | ❌ | ✅ |
| Intercepteurs | ✅ | ❌ | ❌ |
| Annulation | ✅ | Partiel | ❌ |
| JSON auto | ✅ | Manuel | ❌ |
| Upload | ✅ | ✅ | ✅ |

---

## Installation

### NPM/YARN

```bash
# npm
npm install axios

# yarn
yarn add axios

# pnpm
pnpm add axios
```

### CDN (Browser)

```html
<!-- Depuis jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<!-- Depuis unpkg -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

### Vérifier l'Installation

```javascript
import axios from 'axios'

console.log(axios.VERSION) // "1.6.5"
```

---

## Utilisation de Base

### Requête Simple GET

```javascript
import axios from 'axios'

// Approche basique
axios.get('https://api.example.com/users')
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error.message)
  })
```

### Avec Async/Await (Recommandé)

```javascript
import axios from 'axios'

async function getUsers() {
  try {
    const response = await axios.get('https://api.example.com/users')
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error.message)
  }
}

getUsers()
```

### Structure d'une Réponse Axios

```javascript
{
  // Les données retournées par le serveur
  data: {},

  // Code de statut HTTP (200, 404, etc.)
  status: 200,

  // Message de statut HTTP
  statusText: 'OK',

  // Headers de la réponse
  headers: {},

  // Config utilisée pour la requête
  config: {},

  // L'objet XMLHttpRequest (navigateur) ou http.IncomingMessage (Node.js)
  request: {}
}
```

---

## Méthodes HTTP

### GET - Récupérer des Données

```javascript
// Simple
const response = await axios.get('/api/users')

// Avec paramètres URL
const response = await axios.get('/api/users?page=1&limit=10')

// Avec objet params
const response = await axios.get('/api/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name'
  }
})

// Avec headers personnalisés
const response = await axios.get('/api/users', {
  headers: {
    'Authorization': 'Bearer token123',
    'Custom-Header': 'value'
  }
})
```

### POST - Créer des Données

```javascript
// JSON simple
const response = await axios.post('/api/users', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 30
})

// Avec config
const response = await axios.post('/api/users', 
  {
    name: 'Bob',
    email: 'bob@example.com'
  },
  {
    headers: {
      'Authorization': 'Bearer token123'
    }
  }
)

// Form data
const formData = new FormData()
formData.append('name', 'Charlie')
formData.append('email', 'charlie@example.com')

const response = await axios.post('/api/users', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

### PUT - Remplacer Complètement

```javascript
// Remplacer tout l'objet
const response = await axios.put('/api/users/1', {
  name: 'Alice Updated',
  email: 'alice.updated@example.com',
  age: 31
})
```

### PATCH - Mise à Jour Partielle

```javascript
// Modifier juste certains champs
const response = await axios.patch('/api/users/1', {
  name: 'Alice Patched'
})
```

### DELETE - Supprimer

```javascript
// Simple
const response = await axios.delete('/api/users/1')

// Avec params
const response = await axios.delete('/api/users/1', {
  params: {
    force: true
  }
})

// Avec data et headers
const response = await axios.delete('/api/users/1', {
  data: { reason: 'duplicate' },
  headers: {
    'Authorization': 'Bearer token123'
  }
})
```

### HEAD - Vérifier sans Télécharger

```javascript
// Récupère juste les headers sans body
const response = await axios.head('/api/users/1')
console.log(response.headers)
```

### OPTIONS - Vérifier les Méthodes Disponibles

```javascript
const response = await axios.options('/api/users')
console.log(response.headers['allow'])
```

---

## Configuration

### Instance Axios Personnalisée

```javascript
// Créer une instance réutilisable
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }
})

// Utiliser l'instance
api.get('/users')
api.post('/users', { name: 'Alice' })
```

### Configuration Globale

```javascript
// Configuration par défaut pour toutes les requêtes
axios.defaults.baseURL = 'https://api.example.com'
axios.defaults.timeout = 10000
axios.defaults.headers.common['Authorization'] = 'Bearer token123'
axios.defaults.headers.post['Content-Type'] = 'application/json'
```

### Objet Config Complet

```javascript
const config = {
  // URL de base
  baseURL: 'https://api.example.com',

  // Timeout en ms
  timeout: 10000,

  // Headers personnalisés
  headers: {
    'Authorization': 'Bearer token123'
  },

  // Paramètres URL
  params: {
    page: 1
  },

  // Serializer custom pour params
  paramsSerializer: (params) => {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
  },

  // Données à envoyer
  data: {
    name: 'Alice'
  },

  // Authentification HTTP
  auth: {
    username: 'user',
    password: 'pass'
  },

  // Type de contenu de la réponse
  responseType: 'json', // 'json', 'blob', 'arraybuffer', 'stream', 'text'

  // Format de réponse
  responseEncoding: 'utf8',

  // Validation du code de statut
  validateStatus: function(status) {
    return status >= 200 && status < 500
  },

  // Redirection maximale
  maxRedirects: 5,

  // Taille maximale du payload
  maxContentLength: 2000,
  maxBodyLength: 2000,

  // Socket Keep-Alive (Node.js)
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // Proxy
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 3128,
    auth: {
      username: 'user',
      password: 'pass'
    }
  },

  // Dégroupement des données
  decompress: true,

  // WithCredentials (cookies, auth)
  withCredentials: true,

  // XSRF
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // Signal d'annulation
  signal: AbortSignal.timeout(5000)
}

const response = await axios.get('/api/users', config)
```

---

## Intercepteurs

### Intercepteur de Requête

```javascript
const api = axios.create()

// Ajouter un token avant chaque requête
api.interceptors.request.use(
  config => {
    // Avant d'envoyer la requête
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    console.log('Requête:', config.url)
    return config
  },
  error => {
    // Erreur avant envoi
    console.error('Erreur requête:', error)
    return Promise.reject(error)
  }
)
```

### Intercepteur de Réponse

```javascript
api.interceptors.response.use(
  response => {
    // Avant de retourner la réponse
    console.log('Réponse reçue:', response.status)
    return response
  },
  error => {
    // Erreur lors de la réponse
    if (error.response?.status === 401) {
      // Rediriger vers login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Intercepteurs Multiples

```javascript
api.interceptors.request.use(
  config => {
    console.log('Intercepteur 1: Requête')
    return config
  }
)

api.interceptors.request.use(
  config => {
    console.log('Intercepteur 2: Requête')
    return config
  }
)

// S'exécutent dans l'ordre: Intercepteur 1 → Intercepteur 2 → Envoi
```

### Annuler un Intercepteur

```javascript
const interceptor = api.interceptors.request.use(config => {
  // ...
  return config
})

// Plus tard, annuler
api.interceptors.request.eject(interceptor)
```

### Cas Pratique: Gestion de Token Expiré

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com'
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Si le token a expiré
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Demander un nouveau token
        const { data } = await axios.post('/refresh-token', {
          refreshToken: localStorage.getItem('refreshToken')
        })

        // Sauvegarder le nouveau token
        localStorage.setItem('token', data.token)

        // Réessayer la requête originale
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Rediriger vers login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
```

---

## Gestion des Erreurs

### Capturant les Erreurs

```javascript
try {
  const response = await axios.get('/api/users')
  console.log(response.data)
} catch (error) {
  // Trois types d'erreurs possibles
  
  // 1. Erreur de réponse (statut 4xx, 5xx)
  if (error.response) {
    console.log('Status:', error.response.status)
    console.log('Data:', error.response.data)
    console.log('Headers:', error.response.headers)
  }
  // 2. Erreur de requête (envoi échoué)
  else if (error.request) {
    console.log('Pas de réponse reçue')
    console.log('Request:', error.request)
  }
  // 3. Erreur de setup
  else {
    console.log('Erreur setup:', error.message)
  }
}
```

### Structure Complète d'une Erreur

```javascript
{
  message: 'Request failed with status code 404',
  
  // Code HTTP
  response: {
    status: 404,
    statusText: 'Not Found',
    data: { error: 'Resource not found' },
    headers: {}
  },
  
  // Objet XMLHttpRequest si pas de réponse
  request: XMLHttpRequest,
  
  // Message d'erreur
  message: 'Not Found',
  
  // Config original
  config: {},
  
  // Code
  code: 'ERR_BAD_REQUEST',
  
  // Exception nommée
  name: 'AxiosError'
}
```

### Gestion Personnalisée d'Erreurs

```javascript
async function getUser(userId) {
  try {
    const response = await axios.get(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Utilisateur ${userId} non trouvé`)
    } else if (error.response?.status === 500) {
      throw new Error('Erreur serveur. Réessayez plus tard')
    } else if (error.request) {
      throw new Error('Pas de réponse du serveur')
    } else {
      throw new Error(`Erreur: ${error.message}`)
    }
  }
}
```

### Fallback avec .catch()

```javascript
axios.get('/api/users')
  .then(response => console.log(response.data))
  .catch(error => {
    console.error('Erreur:', error.message)
    return { data: [] } // Valeur par défaut
  })
  .then(result => console.log(result))
```

---

## Requêtes Avancées

### Requête Brute (Peu Courante)

```javascript
const response = await axios({
  method: 'get',
  url: '/api/users',
  responseType: 'stream'
})

response.data.pipe(fs.createWriteStream('users.json'))
```

### Types de Réponse

```javascript
// JSON (défaut)
const response = await axios.get('/api/data', {
  responseType: 'json'
})

// Texte brut
const response = await axios.get('/api/data.txt', {
  responseType: 'text'
})
console.log(typeof response.data) // string

// Blob (fichiers)
const response = await axios.get('/api/image.png', {
  responseType: 'blob'
})
const url = URL.createObjectURL(response.data)
document.querySelector('img').src = url

// ArrayBuffer
const response = await axios.get('/api/data', {
  responseType: 'arraybuffer'
})

// Stream (Node.js)
const response = await axios.get('/api/data', {
  responseType: 'stream'
})
response.data.pipe(process.stdout)
```

### Transformation des Données

```javascript
// Transformer la réponse
const api = axios.create({
  transformResponse: [(data) => {
    return JSON.parse(data).results // Extraire 'results'
  }]
})

// Ou par requête
const response = await axios.get('/api/users', {
  transformResponse: [
    data => {
      const parsed = JSON.parse(data)
      return parsed.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
      }))
    }
  ]
})
```

### Validation Personnalisée du Statut

```javascript
// Traiter 404 comme "success"
const response = await axios.get('/api/users/999', {
  validateStatus: (status) => {
    return status >= 200 && status < 500
  }
})

console.log(response.status) // 404 ne lève pas d'erreur
```

---

## Upload de Fichiers

### Upload Simple

```html
<input type="file" id="fileInput">
<button id="uploadBtn">Upload</button>
```

```javascript
document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput')
  const file = fileInput.files[0]

  if (!file) {
    console.error('Aucun fichier sélectionné')
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('name', 'my-file')

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('Fichier uploadé:', response.data)
  } catch (error) {
    console.error('Erreur upload:', error.message)
  }
})
```

### Upload Multiples

```javascript
const fileInput = document.getElementById('fileInput')
fileInput.setAttribute('multiple', 'multiple')

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const files = fileInput.files
  const formData = new FormData()

  for (let file of files) {
    formData.append('files', file)
  }

  const response = await axios.post('/api/upload-multiple', formData)
  console.log('Fichiers uploadés:', response.data)
})
```

### Barre de Progression

```javascript
async function uploadWithProgress(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post('/api/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      console.log(`Progress: ${progress}%`)
      document.querySelector('.progress-bar').style.width = `${progress}%`
    }
  })

  return response.data
}
```

### Téléchargement avec Progression

```javascript
async function downloadWithProgress(url) {
  const response = await axios.get(url, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      console.log(`Download: ${progress}%`)
    }
  })

  return response.data
}
```

---

## Timeouts & Retry

### Timeout Simple

```javascript
const response = await axios.get('/api/users', {
  timeout: 5000 // 5 secondes
})
```

### Retry Automatique

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentative ${attempt}/${maxRetries}`)
      return await axios.get(url)
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      // Attendre avant de réessayer (exponential backoff)
      const delay = Math.pow(2, attempt - 1) * 1000
      console.log(`Attente ${delay}ms avant prochain essai`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

const response = await fetchWithRetry('/api/users')
```

### Avec Intercepteur Global

```javascript
const api = axios.create()

api.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error
    
    if (!config || !error.response || error.response.status < 500) {
      return Promise.reject(error)
    }

    config.retryCount = config.retryCount || 0

    if (config.retryCount >= 3) {
      return Promise.reject(error)
    }

    config.retryCount++
    
    // Attendre avant de réessayer
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return api(config)
  }
)
```

---

## Requêtes Simultanées

### Promise.all()

```javascript
// Toutes les requêtes doivent réussir
async function getMultipleResources() {
  try {
    const [users, posts, comments] = await Promise.all([
      axios.get('/api/users'),
      axios.get('/api/posts'),
      axios.get('/api/comments')
    ])

    return {
      users: users.data,
      posts: posts.data,
      comments: comments.data
    }
  } catch (error) {
    console.error('Une des requêtes a échoué:', error)
  }
}
```

### Promise.allSettled()

```javascript
// Toutes les requêtes s'exécutent, peu importe le résultat
async function getMultipleResources() {
  const results = await Promise.allSettled([
    axios.get('/api/users'),
    axios.get('/api/posts'),
    axios.get('/api/comments')
  ])

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Requête ${index} réussie:`, result.value.data)
    } else {
      console.log(`Requête ${index} échouée:`, result.reason)
    }
  })
}
```

### Promise.race()

```javascript
// Première requête à terminer
try {
  const response = await Promise.race([
    axios.get('https://api1.example.com/data'),
    axios.get('https://api2.example.com/data'),
    axios.get('https://api3.example.com/data')
  ])
  console.log('Première réponse reçue:', response.data)
} catch (error) {
  console.error('Toutes les requêtes ont échoué:', error)
}
```

### Requêtes Séquentielles

```javascript
// Exécuter une après l'autre
async function getSequential() {
  try {
    const user = await axios.get('/api/users/1')
    const posts = await axios.get(`/api/users/${user.data.id}/posts`)
    const comments = await axios.get(`/api/posts/${posts.data[0].id}/comments`)

    return { user, posts, comments }
  } catch (error) {
    console.error('Erreur:', error)
  }
}
```

### Annuler une Requête

```javascript
// Créer un signal d'annulation
const controller = new AbortController()

// Passer le signal à Axios
const response = await axios.get('/api/users', {
  signal: controller.signal
})

// Annuler la requête si elle prend trop longtemps
const timeout = setTimeout(() => {
  controller.abort()
}, 5000)

try {
  await response
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Requête annulée')
  }
} finally {
  clearTimeout(timeout)
}
```

---

## Intégration Frameworks

### React

```javascript
import { useEffect, useState } from 'react'
import axios from 'axios'

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/users')
        setUsers(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### React Hook Personnalisé

```javascript
function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url)
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

// Utilisation
function App() {
  const { data: users, loading, error } = useApi('/api/users')

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur</div>

  return <div>{/* Afficher users */}</div>
}
```

### Vue 3

```javascript
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const users = ref([])
    const loading = ref(true)
    const error = ref(null)

    onMounted(async () => {
      try {
        const response = await axios.get('/api/users')
        users.value = response.data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    })

    return { users, loading, error }
  }
}
```

### Angular

```typescript
import { Injectable } from '@angular/core'
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  async getUsers() {
    try {
      const response = await axios.get('/api/users')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Composant
export class UsersComponent implements OnInit {
  users: any[] = []

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.users = await this.userService.getUsers()
  }
}
```

### Instance Globale (Vue 3)

```javascript
// main.js
import axios from 'axios'
import { createApp } from 'vue'

const app = createApp(App)

// Faire axios disponible globalement
app.config.globalProperties.$axios = axios

// Composant
export default {
  methods: {
    async getUsers() {
      const response = await this.$axios.get('/api/users')
      console.log(response.data)
    }
  }
}
```

---

## Exemples Pratiques

### ✅ Exemple 1: API Client Complet

```javascript
class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Intercepteur pour token
    this.client.interceptors.request.use(config => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Intercepteur pour erreurs
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async get(url, config) {
    return this.client.get(url, config)
  }

  async post(url, data, config) {
    return this.client.post(url, data, config)
  }

  async put(url, data, config) {
    return this.client.put(url, data, config)
  }

  async delete(url, config) {
    return this.client.delete(url, config)
  }

  async request(config) {
    return this.client.request(config)
  }
}

// Utilisation
const api = new ApiClient('https://api.example.com')

const users = await api.get('/users')
const newUser = await api.post('/users', { name: 'Alice' })
await api.put('/users/1', { name: 'Alice Updated' })
await api.delete('/users/1')
```

### ✅ Exemple 2: Authentification JWT

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com'
})

// Intercepteur: Ajouter token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur: Gérer token expiré
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post('/api/refresh-token', {
          refreshToken: localStorage.getItem('refreshToken')
        })

        localStorage.setItem('token', data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Utilisation
export default api
```

### ✅ Exemple 3: Requêtes avec Cache

```javascript
class CachedApiClient {
  constructor(baseURL) {
    this.client = axios.create({ baseURL })
    this.cache = new Map()
    this.cacheTime = 5 * 60 * 1000 // 5 minutes
  }

  async get(url, options = {}) {
    const cacheKey = `${url}:${JSON.stringify(options)}`

    // Vérifier le cache
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey)
      if (Date.now() - timestamp < this.cacheTime) {
        console.log('Données du cache:', cacheKey)
        return { data, fromCache: true }
      }
    }

    // Requête API
    const response = await this.client.get(url, options)

    // Mettre en cache
    this.cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    })

    return response
  }

  clearCache() {
    this.cache.clear()
  }

  clearCacheEntry(url) {
    for (const [key] of this.cache) {
      if (key.startsWith(url)) {
        this.cache.delete(key)
      }
    }
  }
}

// Utilisation
const api = new CachedApiClient('https://api.example.com')

const response1 = await api.get('/users')
const response2 = await api.get('/users') // Du cache

api.clearCacheEntry('/users')
const response3 = await api.get('/users') // Nouvelle requête
```

### ✅ Exemple 4: Gestion d'Erreurs Avancée

```javascript
class HttpErrorHandler {
  static handle(error) {
    const { response, request, message } = error

    if (response) {
      // Erreur HTTP
      return this.handleResponseError(response)
    } else if (request) {
      // Pas de réponse
      return {
        code: 'NO_RESPONSE',
        message: 'Pas de réponse du serveur',
        status: null
      }
    } else {
      // Erreur de setup
      return {
        code: 'SETUP_ERROR',
        message,
        status: null
      }
    }
  }

  static handleResponseError(response) {
    const { status, data } = response

    const errorMap = {
      400: 'Requête invalide',
      401: 'Non autorisé',
      403: 'Accès refusé',
      404: 'Ressource non trouvée',
      409: 'Conflit',
      429: 'Trop de requêtes',
      500: 'Erreur serveur',
      503: 'Service indisponible'
    }

    return {
      code: `HTTP_${status}`,
      message: errorMap[status] || `Erreur ${status}`,
      status,
      details: data
    }
  }
}

// Utilisation
try {
  await axios.get('/api/users')
} catch (error) {
  const handled = HttpErrorHandler.handle(error)
  console.error(handled.message)
}
```

---

## Bonnes Pratiques

### ✅ À Faire
- ✅ Toujours utiliser **try/catch** ou **.catch()**
- ✅ Définir un **baseURL** pour ne pas répéter l'URL
- ✅ Utiliser des **intercepteurs** pour la logique commune
- ✅ Implémenter des **timeouts** pour éviter les blocages
- ✅ Ajouter un **token JWT** dans les headers
- ✅ Valider les **codes de statut** appropriés
- ✅ Mettre en place une **barre de progression** pour uploads
- ✅ Utiliser **Promise.all()** pour requêtes parallèles
- ✅ Implémenter un **cache** pour données fréquemment accédées
- ✅ Retester avec **retry** pour erreurs temporaires

### ❌ À Éviter
- ❌ Ignorer les **erreurs**
- ❌ Faire des **requêtes bloquantes** en boucle
- ❌ Exposer les **tokens** en clair
- ❌ Ne pas **annuler** les requêtes inutiles
- ❌ Répéter l'**URL de base** partout
- ❌ Ne pas gérer les **timeouts**
- ❌ Créer plusieurs **instances Axios** pour la même API
- ❌ Oublier de **gérer les réponses** asynchrones
- ❌ Faire des **N requêtes** sequentielles au lieu de parallèle
- ❌ Ignorer la **sécurité CORS**

---

## Comparaison: Axios vs Fetch

### Axios

```javascript
// Requête simple
const response = await axios.get('/api/users')

// Headers personnalisés
const response = await axios.get('/api/users', {
  headers: { 'Authorization': 'Bearer token' }
})

// Erreur
if (error.response?.status === 404) { }

// Timeout
axios.get('/api/users', { timeout: 5000 })

// Retry automatique (avec intercepteur)
```

### Fetch

```javascript
// Requête simple
const response = await fetch('/api/users')
const data = await response.json()

// Headers personnalisés
const response = await fetch('/api/users', {
  headers: { 'Authorization': 'Bearer token' }
})

// Erreur
if (!response.ok) { }

// Timeout
const controller = new AbortController()
setTimeout(() => controller.abort(), 5000)
fetch('/api/users', { signal: controller.signal })

// Pas de retry automatique
```

---

## Ressources

📖 [Documentation Officielle Axios](https://axios-http.com)
🐙 [GitHub Axios](https://github.com/axios/axios)
📦 [NPM Axios](https://www.npmjs.com/package/axios)
🔗 [Stack Overflow - Axios Tag](https://stackoverflow.com/questions/tagged/axios)

---

## Résumé Rapide

| Concept | Usage |
|---------|-------|
| **GET** | Récupérer des données |
| **POST** | Créer des données |
| **PUT** | Remplacer complètement |
| **PATCH** | Mise à jour partielle |
| **DELETE** | Supprimer |
| **Intercepteurs** | Ajouter logique commune |
| **Erreurs** | Gestion robuste |
| **Timeouts** | Éviter les blocages |
| **Instances** | Réutiliser configuration |
| **Promise.all()** | Requêtes parallèles |
