import { type ReactNode, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string | ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, footer, size }: ModalProps) {
    // Empêcher le scroll de la page en arrière-plan quand la modale est ouverte
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Si la modale n'est pas ouverte, on ne rend rien
    if (!isOpen) return null;

    return (
        <>
            {/* Arrière-plan assombri (Backdrop) */}
            <div 
                className="modal-backdrop fade show" 
                style={{ zIndex: 1040 }} 
                onClick={onClose}
            />
            
            {/* Conteneur principal de la modale */}
            <div 
                className="modal fade show d-block" 
                tabIndex={-1} 
                style={{ zIndex: 1050 }}
                role="dialog"
                aria-modal="true"
                onClick={onClose} // Ferme la modale si on clique à l'extérieur du contenu
            >
                <div 
                    className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ''}`} 
                    onClick={e => e.stopPropagation()} // Empêche la fermeture quand on clique à l'intérieur
                >
                    <div className="modal-content bg-dark text-white border-secondary shadow-lg">
                        
                        {/* En-tête (Header) */}
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title fw-bold">{title}</h5>
                            <button 
                                type="button" 
                                className="btn-close btn-close-white" 
                                aria-label="Fermer"
                                onClick={onClose}
                            />
                        </div>
                        
                        {/* Corps de la modale (Body) */}
                        <div className="modal-body p-4">
                            {children}
                        </div>
                        
                        {/* Pied de page optionnel (Footer) */}
                        {footer && (
                            <div className="modal-footer border-secondary">
                                {footer}
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </>
    );
}
