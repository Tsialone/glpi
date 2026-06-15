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

def logical_number(is_duration=False):
    if is_duration:
        # Durées logiques: 15m, 30m, 1h, 2h, 4h, 8h (en secondes)
        return str(random.choice([900, 1800, 3600, 7200, 14400, 28800]))
    
    # 30% de chances d'être 0 pour les coûts
    if random.random() < 0.3:
        return "0"
        
    # Coûts logiques entre 10 et 500, avec potentiellement 2 décimales propres
    val = round(random.uniform(10.0, 500.0), 2)
    return f"{val:.2f}".replace(".", ",")

with open("test-import/ticket-cost.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(["Num_Ticket", "Duration_second", "Time_Cost", "Fixed_Cost"])
    
    for ref in ticket_refs:
        # Entre 1 et 3 coûts par ticket
        num_costs = random.choices([1, 2, 3], weights=[30, 40, 30])[0]
        
        for _ in range(num_costs):
            duration_str = logical_number(is_duration=True)
            time_cost_str = logical_number()
            fixed_cost_str = logical_number()
            
            writer.writerow([ref, duration_str, time_cost_str, fixed_cost_str])
            total_costs_generated += 1

print(f"Génération cohérente et logique de {total_costs_generated} coûts de tickets.")
