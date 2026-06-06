// clean
// export const baseUrl = "http://localhost/presta/prestashop_clean/api";
// export const token = "7EHKUIL958QGREXA94VFF3EEQ2XANW3T";
// import
export const baseUrl = "http://glpi.local/apirest.php";

export const nestBaseUrl = "http://localhost:3000/api";


export const ITEM_NO_MODEL = [
    "Cable",
    "Item_DeviceSimcard",
    "Software",
    "CartridgeItem",
    "ConsumableItem"
];

export const ITEM_TYPE = [
    "Computer",           // Ordinateurs
    "Monitor",            // Moniteurs
    "NetworkEquipment",   // Matériels réseau
    "Peripheral",         // Périphériques
    "Printer",            // Imprimantes
    "Phone",              // Téléphones
    "Rack",               // Baies
    "Enclosure",          // Boîtiers
    "PDU",                // PDU
    "PassiveDCEquipment",
    "Software",           // Logiciels
    "CartridgeItem",      // Cartouches
    "ConsumableItem",     // Consommables
    "Item_DeviceSimcard",
    "Cable",              // Câbles
];



export const UTIL_CONST = {
    token: "session_token",
    user: "user"
}



export const APP_TOKEN = "hNE8bhiYYknj5A0UpOg93S2O16RPSbv0jxRukRUD";
const TICKET_STATUS = {
    1: "Nouveau",
    2: "En cours (assigné)",
    3: "En cours (planifié)",
    4: "En attente",
    5: "Résolu",
    6: "Clos"
};

const TICKET_TYPES = {
    1: "Incident",
    2: "Demande"
};





interface IUrl {
    url: string,
    path: string
}
export const url: IUrl[] = [
    { url: "import", path: "/backoffice/imports" },


    { url: "home", path: "/frontoffice/home" },


]
export const IMPORT_NAMES = {


} as const;

export const BACK_OFFICE = {
    user: "employee"
}
export const FRONT_OFFICE = {
    user: "customer",
    cart: "cart"
}


