import React, { createContext, useState } from "react";

interface ILoading {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<ILoading | undefined>(undefined);

export default function LoadingProvider({ children }: any) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    style={{ 
                        zIndex: 9999, 
                        backgroundColor: "rgba(51, 51, 52, 0.8)", // Ton fond #333334 avec transparence
                        backdropFilter: "blur(4px)", // Flou d'arrière-plan moderne
                        transition: "all 0.3s ease-in-out"
                    }}
                >
                    {/* Spinner personnalisé */}
                    <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    
                    {/* Petit texte sympa sous le spinner */}
                    <div className="mt-3 text-white fw-bold text-uppercase tracking-wider" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>
                        Chargement en cours
                    </div>
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    );
}