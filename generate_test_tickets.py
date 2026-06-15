import os
import csv
import random
from datetime import datetime, timedelta
import json

# Lecture des assets existants pour assurer la cohérence
asset_names = []
try:
    with open("test-import/asset.csv", mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["Name"]:
                asset_names.append(row["Name"])
except FileNotFoundError:
    print("Erreur: test-import/asset.csv introuvable. Exécutez d'abord la génération des assets.")
    exit(1)

if not asset_names:
    print("Erreur: Aucun asset trouvé dans test-import/asset.csv.")
    exit(1)

# Listes de données factices pour les tickets
types = ["Incident", "Request"]
statuses = ["New", "In progress (assigned)", "Closed"]
priorities = ["Low", "Medium", "High", "Very High"]

# Mix de français et malgache pour les titres et descriptions, pour coller à l'exemple
titres_incidents = [
    "Tsy mandeha", "Michauffe", "Écran bleu", "Lenteur système", 
    "Problème d'impression", "Tsy mirehitra", "Connexion coupée", 
    "Matériel cassé", "Bruit suspect", "Mijonona ny PC"
]
desc_incidents = [
    "hafahafa be", "mamay be", "Le PC redémarre tout seul", "Très lent depuis ce matin",
    "Bourrage papier récurrent", "Tsy misy sary", "Impossible de se connecter au Wi-Fi",
    "Le câble est endommagé", "Un bruit de ventilateur très fort", "Bloqué sur le logo"
]

titres_demandes = [
    "Installation logiciel", "Demande de nouveau matériel", "Mise à jour système",
    "Accès réseau", "Remplacement cartouche", "Besoin de câble",
    "Ajout mémoire RAM", "Changement de bureau"
]
desc_demandes = [
    "Besoin de la dernière version", "Mon matériel est obsolète", "Mise à jour de sécurité requise",
    "Besoin d'accéder au serveur partagé", "Plus d'encre noire", "Besoin d'un câble réseau plus long",
    "Le PC est trop lent pour mon travail", "Déménagement dans le bureau d'à côté"
]

def random_date(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    return random_date

start_date = datetime.strptime("01/01/2026", "%d/%m/%Y")
end_date = datetime.strptime("30/06/2026", "%d/%m/%Y")

num_tickets = 15

with open("test-import/ticket.csv", mode="w", newline="", encoding="utf-8") as file:
    # Paramétrage pour forcer les guillemets (QUOTE_MINIMAL suffit si on met un JSON string)
    writer = csv.writer(file, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(["Ref_Ticket", "Date", "Heure", "Type", "Titre", "Description", "Status", "Priority", "Items"])
    
    # 1. Répartition des statuts (5 Closed, 3 New, 7 In progress)
    generated_statuses = ["Closed"]*5 + ["New"]*3 + ["In progress (assigned)"]*7
    random.shuffle(generated_statuses)
    
    # 2. Répartition du nombre d'équipements liés (4 tickets vides, et le reste au hasard entre 1 et 3)
    generated_item_counts = [0]*4 + [1]*5 + [2]*4 + [3]*2
    random.shuffle(generated_item_counts)

    for i in range(1, num_tickets + 1):
        ticket_type = random.choice(types)
        
        if ticket_type == "Incident":
            idx = random.randint(0, len(titres_incidents) - 1)
            titre = titres_incidents[idx]
            desc = desc_incidents[idx]
        else:
            idx = random.randint(0, len(titres_demandes) - 1)
            titre = titres_demandes[idx]
            desc = desc_demandes[idx]
            
        r_date = random_date(start_date, end_date)
        date_str = r_date.strftime("%d/%m/%Y")
        
        heure_str = f"{random.randint(8, 17):02d}:{random.randint(0, 59):02d}"
        
        status = generated_statuses[i-1]
        priority = random.choice(priorities)
        
        # Choix cohérent du nombre d'assets liés
        num_items = generated_item_counts[i-1]
        linked_assets = random.sample(asset_names, num_items)
        
        # Le format attendu par le CSV est une chaîne JSON : ["PC-ADM-001", "MN-FORM-002"]
        # En l'écrivant via csv.writer, il l'entourera de guillemets doubles et échappera les guillemets internes
        items_json_str = json.dumps(linked_assets)
        
        writer.writerow([i, date_str, heure_str, ticket_type, titre, desc, status, priority, items_json_str])

print(f"Génération de {num_tickets} tickets avec respect de la cohérence des assets terminées.")
