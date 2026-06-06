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


export const TICKET_PRIORITY = {
    1: "very low",
    2: "low",
    3: "medium",
    4: "high",
    5: "very high",
    6: "major"
};

export const REVERSE_TICKET_PRIORITY = Object.fromEntries(
    Object.entries(TICKET_PRIORITY).map(([key, value]) => [value, Number(key)])
);

export const APP_TOKEN = "hNE8bhiYYknj5A0UpOg93S2O16RPSbv0jxRukRUD";
export const TICKET_STATUS = {
    1: "new",
    2: "processing (assigned)",
    3: "processing (planned)",
    4: "pending",
    5: "solved",
    6: "closed",
    10: "approval"
};

export const REVERSE_TICKET_STATUS = Object.fromEntries(
    Object.entries(TICKET_STATUS).map(([key, value]) => [value, Number(key)])
);

export const TICKET_TYPES = {
    1: "Incident",
    2: "Request"
};

export const REVERSE_TICKET_TYPES = Object.fromEntries(
    Object.entries(TICKET_TYPES).map(([key, value]) => [value, Number(key)])
);





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


