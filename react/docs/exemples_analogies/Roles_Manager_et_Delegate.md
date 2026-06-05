# Cas Pratique : Les rôles dans un Groupe (Manager & Delegate)

Imagine une équipe dans ton entreprise : L'Équipe Comptabilité (C'est notre Groupe).
Dans cette équipe, il y a trois personnes :

- **Paul** (Le directeur du département)
- **Sarah** (L'assistante administrative du département)
- **Éric** (Un comptable standard)

Dans GLPI, pour cette équipe, on va cocher des cases spécifiques pour Paul et Sarah. Voici ce que ça change concrètement :

## 1. Paul est coché "Manager" (= Le Chef)
Puisque Paul est le chef, GLPI lui donne le rôle de validateur.

**Le scénario :** Éric (le comptable) a besoin d'un nouveau logiciel payant pour travailler. Il va sur son portail GLPI et fait la demande.

**Ce que fait GLPI :** Comme c'est une demande qui coûte de l'argent ou qui demande une autorisation, GLPI bloque le ticket. Il cherche qui est le Manager du groupe de Éric. Il voit que c'est Paul.

**L'action :** Paul reçoit un e-mail automatique de GLPI avec deux boutons : [Accepter] ou [Refuser]. Tant que Paul (le Manager) n'a pas cliqué sur Accepter, les techniciens informatiques ne bougent pas le petit doigt.

**En bref :** Le Manager, c'est le bouton "Validation". Il sert à approuver les demandes de son équipe.

## 2. Sarah est cochée "Delegate" (= L'Adjointe / L'Assistante)
Puisque Sarah est l'assistante, GLPI lui donne le rôle de secrétaire médicale pour les tickets de son équipe.

**Le scénario :** Un matin, l'ordinateur d'Éric fume et s'éteint complètement. Éric n'a plus d'écran, plus d'internet, plus rien. Il est totalement bloqué et ne peut même pas se connecter à GLPI pour appeler à l'aide.

**Le problème sans la case Delegate :** Normalement, dans l'interface simplifiée, un utilisateur peut créer un ticket uniquement pour lui-même. Le champ "Demandeur" est verrouillé sur son propre nom.

**La solution avec la case Delegate :** Éric va voir Sarah et lui dit : "Mon PC est mort, tu peux m'ouvrir un ticket ?". Sarah se connecte à son GLPI. Comme elle est cochée Delegate du groupe, GLPI lui déverrouille une option. Elle peut modifier le champ "Demandeur" pour y écrire Éric.

**En bref :** Le Delegate, c'est le rôle "Au nom de". Il permet d'ouvrir un ticket pour un collègue de son équipe qui est dans la galère et qui ne peut pas le faire lui-même.

**Nb :** C'est pas recursive de bas en haut si on est dans un sous groupe