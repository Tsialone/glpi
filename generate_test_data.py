import os
import csv
import random

item_types = [
    "Computer", "Monitor", "NetworkEquipment", "Peripheral", 
    "Printer", "Phone", "Rack", "Enclosure", "DCRoom", 
    "Database", "Software"
]

statuses = ["En production", "Maintenance", "En panne", "En stock"]
locations = ["Administration", "Comptabilité", "Laboratoire IA", "Bibliothèque", "Magasin Informatique", "Salle 301", "Salle Serveur", "Baie 1"]
users = ["Rakoto Jean", "Rasoanaivo Marie", "Rakotondranaivo Paul", "Rabe Hanitra", "ITU Labs", "Bibliothèque", "Rakoto Michel"]
manufacturers = ["Dell", "HP", "Lenovo", "Cisco", "Logitech", "Epson", "APC", "Microsoft", "Adobe", "Oracle"]

# Dictionnaires de modèles pour ce qui les supporte
models_dict = {
    "Computer": ["OptiPlex 7010", "ProDesk 400", "ThinkCentre M70"],
    "Monitor": ["UltraSharp 24", "ProDisplay", "Odyssey G5"],
    "NetworkEquipment": ["Catalyst 2960", "EX2300", "Instant On"],
    "Peripheral": ["MX Master 3", "Ergonomic Keyboard"],
    "Printer": ["LaserJet Pro", "EcoTank"],
    "Phone": ["IP Phone 8841", "SIP-T46U"],
    "Rack": ["NetShelter SX", "S-Series 42U"],
    "Enclosure": ["BladeSystem c7000", "PowerEdge M1000e"]
}

os.makedirs("test-import", exist_ok=True)

with open("test-import/asset.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Name", "Status", "Location", "Manufacturer", "Item_Type", "Model", "Inventory_Number", "User"])
    
    for i in range(1, 301): # 300 assets pour tester la pagination et les gros volumes
        item_type = random.choice(item_types)
        
        # Initialiser avec des valeurs vides
        name = f"{item_type[:3].upper()}-TEST-{i:04d}"
        status = ""
        location = ""
        manufacturer = ""
        model = ""
        inv_number = ""
        user = ""
        
        # 1. IT Assets (Supportent tout)
        if item_type in ["Computer", "Monitor", "NetworkEquipment", "Peripheral", "Printer", "Phone"]:
            status = random.choice(statuses)
            location = random.choice(locations)
            manufacturer = random.choice(manufacturers)
            model = random.choice(models_dict[item_type])
            inv_number = f"INV-IT-{i:05d}"
            user = random.choice(users)
            
        # 2. Infrastructures DC (Tout sauf User)
        elif item_type in ["Rack", "Enclosure", "DCRoom"]:
            status = random.choice(statuses)
            location = random.choice(locations)
            manufacturer = random.choice(manufacturers)
            if item_type in models_dict:
                model = random.choice(models_dict[item_type])
            inv_number = f"INV-DC-{i:05d}"
            
        # 3. Logiciels et BDD (Software, Database) - (Name, Manufacturer, User)
        elif item_type in ["Software", "Database"]:
            manufacturer = random.choice(["Microsoft", "Adobe", "Oracle", "JetBrains", "PostgreSQL", "MySQL"])
            user = random.choice(users)

        # Écriture de la ligne avec les champs respectés (les non-supportés restent vides)
        writer.writerow([name, status, location, manufacturer, item_type, model, inv_number, user])
        
        # Génération de l'image correspondante
        img_name = f"test-import/{name}.jpg"
        cmd = f'convert -size 400x300 xc:lightgray -font Arial -pointsize 30 -gravity center -draw "text 0,0 \'{name}\\n{item_type}\'" "{img_name}"'
        os.system(cmd)

print("Génération de 100 assets avec respect strict des champs supportés par chaque type.")
