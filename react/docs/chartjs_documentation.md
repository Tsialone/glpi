# Documentation Complète : Chart.js et React-Chartjs-2

Bienvenue dans la documentation détaillée sur l'utilisation de **Chart.js** via son wrapper React officiel : **react-chartjs-2**. 
Cette bibliothèque permet de créer des graphiques magnifiques, responsifs et hautement personnalisables en utilisant le canvas HTML5.

---

## 📦 1. Installation

Pour utiliser `react-chartjs-2`, vous devez installer à la fois le wrapper React et la librairie native `chart.js`.

```bash
npm install chart.js react-chartjs-2
# ou
yarn add chart.js react-chartjs-2
```

---

## 🚀 2. Enregistrement Global (Tree-shaking)

Depuis Chart.js v3, la librairie a été réécrite de manière modulaire (pour optimiser le poids du bundle). Vous devez **importer et enregistrer** spécifiquement les éléments dont vous avez besoin.

### Exemple d'enregistrement global :

```javascript
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, RadialLinearScale, TimeScale,
  PointElement, LineElement, BarElement, ArcElement, 
  RadarController, BubbleController, ScatterController,
  Title, Tooltip, Legend, Filler
} from 'chart.js';

// Enregistrement de tous les éléments possibles (à adapter selon vos besoins réels)
ChartJS.register(
  CategoryScale, LinearScale, RadialLinearScale, TimeScale,
  PointElement, LineElement, BarElement, ArcElement,
  RadarController, BubbleController, ScatterController,
  Title, Tooltip, Legend, Filler
);
```

---

## 📊 3. Exemples Pratiques pour TOUS les Types de Graphiques

Voici les exemples de code pour l'intégralité des graphiques supportés par la bibliothèque.

### 📈 1. Graphique en Ligne (Line Chart)
Idéal pour montrer l'évolution d'une donnée dans le temps.

```jsx
import { Line } from 'react-chartjs-2';

const LineChart = () => {
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes 2024',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1 // Courbure de la ligne (0 = droite)
      }
    ]
  };
  return <Line data={data} />;
};
```

### 📊 2. Graphique en Barres (Bar Chart)
Parfait pour comparer différentes catégories.

```jsx
import { Bar } from 'react-chartjs-2';

const BarChart = () => {
  const data = {
    labels: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
    datasets: [
      {
        label: 'Population (millions)',
        data: [2.1, 0.5, 0.8, 0.25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };
  return <Bar data={data} />;
};
```

### 🥧 3. Graphique en Camembert (Pie Chart)
Affiche des proportions d'un tout (100%).

```jsx
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
  const data = {
    labels: ['Rouge', 'Bleu', 'Jaune'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };
  return <Pie data={data} />;
};
```

### 🍩 4. Graphique en Anneau (Doughnut Chart)
Similaire au Pie Chart, mais avec un trou au centre (plus moderne).

```jsx
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = () => {
  const data = {
    labels: ['Acquis', 'En cours', 'À faire'],
    datasets: [
      {
        data: [15, 20, 5],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        cutout: '70%', // Taille du trou au centre
      }
    ]
  };
  return <Doughnut data={data} />;
};
```

### 🕸️ 5. Graphique Radar (Radar Chart)
Très utilisé pour comparer plusieurs variables quantitatives sur un axe circulaire (ex: statistiques d'un joueur).

```jsx
import { Radar } from 'react-chartjs-2';

const RadarChart = () => {
  const data = {
    labels: ['Vitesse', 'Force', 'Endurance', 'Agilité', 'Technique'],
    datasets: [
      {
        label: 'Joueur A',
        data: [80, 90, 70, 85, 60],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Joueur B',
        data: [60, 75, 95, 70, 85],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      }
    ]
  };
  return <Radar data={data} />;
};
```

### 🌐 6. Aire Polaire (PolarArea Chart)
Similaire au camembert, mais l'angle de chaque part est identique ; c'est le **rayon** qui change selon la valeur.

```jsx
import { PolarArea } from 'react-chartjs-2';

const PolarAreaChart = () => {
  const data = {
    labels: ['Rouge', 'Vert', 'Jaune', 'Gris', 'Bleu'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(201, 203, 207, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ]
      }
    ]
  };
  return <PolarArea data={data} />;
};
```

### 🫧 7. Nuage de Bulles (Bubble Chart)
Affiche des données sur 3 dimensions : X, Y, et R (le rayon de la bulle).

```jsx
import { Bubble } from 'react-chartjs-2';

const BubbleChart = () => {
  const data = {
    datasets: [
      {
        label: 'Produits',
        data: [
          { x: 20, y: 30, r: 15 },
          { x: 40, y: 10, r: 10 },
          { x: 15, y: 50, r: 25 },
          { x: 35, y: 25, r: 5 }
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  };
  
  const options = {
    scales: {
      x: { beginAtZero: true, max: 50 },
      y: { beginAtZero: true, max: 60 }
    }
  };

  return <Bubble data={data} options={options} />;
};
```

### 🌌 8. Nuage de Points (Scatter Chart)
Utilisé pour afficher des points de données individuels sans les relier par une ligne. Parfait pour les corrélations.

```jsx
import { Scatter } from 'react-chartjs-2';

const ScatterChart = () => {
  const data = {
    datasets: [
      {
        label: 'Dispersion des Salaires',
        data: [
          { x: 25, y: 3000 }, // { âge, salaire }
          { x: 30, y: 3500 },
          { x: 35, y: 4000 },
          { x: 40, y: 4200 },
          { x: 50, y: 5000 },
        ],
        backgroundColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Âge' } },
      y: { title: { display: true, text: 'Salaire (€)' } }
    }
  };

  return <Scatter data={data} options={options} />;
};
```

---

## ⚙️ 4. Les Options Courantes (`options`)

La prop `options` vous permet de gérer les comportements responsifs, les animations, et l'affichage (grilles, titres).

```javascript
const options = {
  responsive: true,
  maintainAspectRatio: false, // Utile pour donner une hauteur fixe via CSS
  plugins: {
    legend: { position: 'top' }, // top, bottom, left, right
    title: { display: true, text: 'Mon Titre Personnalisé' },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0,0,0,0.8)'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(200, 200, 200, 0.2)' }
    },
    x: {
      grid: { display: false } // Cache les lignes verticales
    }
  }
};
```

---

## 💡 5. Astuces Récapitulatives

1. **Mémorisation (`useMemo`) :** Pour des raisons de performance sous React, enveloppez toujours vos objets `data` et `options` avec `useMemo` si vous les déclarez dans le corps de votre composant.
2. **Exportation (`useRef`) :** Vous pouvez accéder au canvas généré via une `ref` pour télécharger le graphique avec `chartRef.current.toBase64Image()`.
3. **Mélange de Graphiques (Mixed Charts) :** Vous pouvez mixer des barres et des lignes sur un même graphique en utilisant le composant `<Chart />` de `react-chartjs-2` et en spécifiant la propriété `type: 'line'` sur l'un de vos datasets !
