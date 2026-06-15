import { useState, type ReactNode } from "react";

interface Column {
    label: ReactNode;
    className?: string; // Optionnel : pour ajouter des classes comme "text-end" ou "text-center"
}

interface TableProps<T> {
    columns: Column[];
    data: T[];
    /** Fonction pour extraire une clé unique pour chaque ligne (comme l'ID) */
    keyExtractor: (item: T, index: number) => string | number;
    /** Rendu des cellules (les <td>) pour chaque ligne */
    renderRow: (item: T, index: number) => ReactNode;
    /** Message à afficher si la liste `data` est vide */
    emptyMessage?: ReactNode;
    /** Activer la pagination (par défaut: false) */
    pagination?: boolean;
    /** Nombre d'éléments par page si la pagination est activée (par défaut: 10) */
    itemsPerPage?: number;
    /** Rend le tableau plus petit/compact en réduisant les marges intérieures (par défaut: false) */
    compact?: boolean;
}

/**
 * Composant Table générique avec le thème sombre Bootstrap et Pagination Intégrée.
 */
export function Table<T>({ 
    columns, 
    data, 
    keyExtractor, 
    renderRow, 
    emptyMessage = "Aucune donnée trouvée.",
    pagination = false,
    itemsPerPage = 10,
    compact = false
}: TableProps<T>) {
    
    // État local de la pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Calculs de pagination
    const totalItems = data?.length || 0;
    const totalPages = pagination ? Math.ceil(totalItems / itemsPerPage) : 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Déterminer les données à afficher (coupées si pagination activée)
    const currentData = (pagination && data) 
        ? data.slice(indexOfFirstItem, indexOfLastItem) 
        : data;

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div>
            <div className="table-responsive shadow-sm rounded border border-secondary">
                <table className={`table table-dark table-striped table-hover align-middle mb-0 ${compact ? 'table-sm' : ''}`}>
                    <thead className="table-secondary text-dark">
                        <tr>
                            {columns.map((col , index) => (
                                <th key={index} scope="col" className={`py-3 px-3 ${col.className || ""}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData && currentData.length > 0 ? (
                            currentData.map((item, index) => (
                                <tr key={keyExtractor(item, index)}>
                                    {renderRow(item, index)}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center text-light py-5">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Contrôles de Pagination (affichés uniquement si activés et s'il y a plus d'1 page) */}
            {pagination && totalPages > 1 && (
                <nav className="mt-4 d-flex justify-content-center" aria-label="Navigation du tableau">
                    <ul className="pagination mb-0 shadow-sm">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link bg-dark border-secondary text-white" 
                                onClick={handlePrev} 
                                disabled={currentPage === 1}
                            >
                                Précédent
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link bg-dark border-secondary text-white-50">
                                Page {currentPage} sur {totalPages}
                            </span>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                                className="page-link bg-dark border-secondary text-white" 
                                onClick={handleNext} 
                                disabled={currentPage === totalPages}
                            >
                                Suivant
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
