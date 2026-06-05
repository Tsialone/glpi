import React, { createContext, useState, useContext, type ReactNode } from "react";

// 1. Définition de l'interface
export interface IPopup {
    message: string;
    type: "error" | "info" | "danger" | "success";
}

// Interface pour le contenu du Contexte
interface PopupContextType {
    showPopup: (message: string, type?: "error" | "info" | "danger" | "success") => void;
    hidePopup: () => void;
}

// 2. Création du Contexte
export const PopupContext = createContext<PopupContextType | undefined>(undefined);

// 3. Le Provider
export default function PopupProvider({ children }: { children: ReactNode }) {
    const [popup, setPopup] = useState<IPopup | null>(null);

    // Fonction magique : type est optionnel et vaut "error" par défaut
    const showPopup = (message: string, type: "error" | "info" | "danger" | "success" = "error") => {
        setPopup({ message, type });
    };

    const hidePopup = () => setPopup(null);

    // Gestion de la couleur de fond du badge selon le type
    const getAlertClass = () => {
        if (!popup) return "";
        switch (popup.type) {
            case "danger": return "alert-danger";
            case "info": return "alert-info";
            case "success": return "alert-success"; // <- Corrigé ici (ajout de alert-)
            case "error": default: return "alert-danger"; 
        }
    };

    // Gestion dynamique du titre
    const getAlertTitle = () => {
        if (!popup) return "";
        switch (popup.type) {
            case "success": return "Succès !";
            case "info": return "Information";
            case "danger":
            case "error":
            default:
                return "Erreur";
        }
    };

    return (
        <PopupContext.Provider value={{ showPopup, hidePopup }}>
            {popup && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    style={{ 
                        zIndex: 9999, 
                        backgroundColor: "rgba(51, 51, 52, 0.8)", 
                        backdropFilter: "blur(4px)", 
                        transition: "all 0.3s ease-in-out"
                    }}
                >
                    {/* Conteneur de la Popup / Alerte */}
                    <div className={`alert ${getAlertClass()} text-center p-4 shadow-lg`} style={{ minWidth: '300px', borderRadius: '10px' }}>
                        <h4 className="alert-heading text-uppercase font-weight-bold">
                            {getAlertTitle()} {/* <- Modifié pour gérer le succès proprement */}
                        </h4>
                        <p className="mb-3">{popup.message}</p>
                        
                        {/* Bouton pour fermer la popup */}
                        <button type="button" className="btn btn-dark btn-sm" onClick={hidePopup}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}
            {children}
        </PopupContext.Provider>
    );
}

// 4. Hook personnalisé pour l'utiliser sans boilerplate dans tes composants
export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup doit être utilisé à l'intérieur de PopupProvider");
    }
    return context;
}