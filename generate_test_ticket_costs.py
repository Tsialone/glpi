import os
import csv
import random

# Lecture des tickets existants pour assurer la cohérence
ticket_refs = []
try:
    with open("test-import/ticket.csv", mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("Ref_Ticket"):
                ticket_refs.append(row["Ref_Ticket"])
except FileNotFoundError:
    print("Erreur: test-import/ticket.csv introuvable. Exécutez d'abord la génération des tickets.")
    exit(1)

if not ticket_refs:
    print("Erreur: Aucun ticket trouvé dans test-import/ticket.csv.")
    exit(1)

total_costs_generated = 0

def hard_number(is_duration=False):
    # Génère un nombre complexe, parfois entier, parfois très décimal, avec des virgules pour séparateur décimal
    val = random.uniform(0.0, 15000.0)
    
    # 20% de chances d'être 0
    if random.random() < 0.2:
        return "0"
    
    # Choix aléatoire du nombre de décimales pour tester la robustesse du parseur
    decimals = random.choice([0, 1, 2, 3, 4])
    
    if decimals == 0:
        res = f"{int(val)}"
    else:
        # Formate avec le nombre de décimales choisi, et remplace le point par une virgule
        fmt = f"{{:.{decimals}f}}"
        res = fmt.format(val).replace(".", ",")
        
    return res

with open("test-import/ticket-cost.csv", mode="w", newline="", encoding="utf-8") as file:
    # QUOTE_MINIMAL encapsulera automatiquement les champs avec virgules si nécessaire selon le dialecte
    # Mais on va forcer l'ajout de guillemets pour les nombres décimaux (pour être vicieux et robuste)
    writer = csv.writer(file, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(["Num_Ticket", "Duration_second", "Time_Cost", "Fixed_Cost"])
    
    for ref in ticket_refs:
        # Entre 1 et 3 coûts par ticket
        num_costs = random.choices([1, 2, 3], weights=[30, 40, 30])[0]
        
        for _ in range(num_costs):
            duration_str = hard_number(is_duration=True)
            time_cost_str = hard_number()
            fixed_cost_str = hard_number()
            
            writer.writerow([ref, duration_str, time_cost_str, fixed_cost_str])
            total_costs_generated += 1

print(f"Génération 'Hardcore' de {total_costs_generated} coûts de tickets avec des virgules et des décimales tordues.")
