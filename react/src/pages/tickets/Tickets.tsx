import { useEffect, useState, type JSX } from "react";
import type { ITicket } from "../../types/ticket";
import { ticketService } from "../../services/ticket.service";
import { TICKET_PRIORITY, TICKET_STATUS } from "../../utils";
import { useNavigate } from "react-router-dom";

export function Tickets() {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    {/* 1. Bouton de déclenchement */ }
    const ticketsPerPage = 50;

    const getTickets = async () => {
        const respTickets = await ticketService.getAll();
        setTickets(respTickets);
    }
    useEffect(() => {
        getTickets();
    }, []);

    // Pagination logic
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    function handleTicketFiche(idTicket: number) {
        console.log("toto");
        navigate(`/backoffice/admin/ticket/${idTicket}`);
    }

    return (
        <div className="container-fluid p-4 min-vh-100 bg-dark text-white">
            <h2 className="mb-4">Liste des Tickets</h2>
            <div className="table-responsive shadow-sm rounded">
                <table className="table table-dark table-striped table-hover align-middle mb-0">
                    <thead className="table-secondary text-dark">
                        <tr>
                            <th scope="col" className="py-3 px-4">ID</th>
                            <th scope="col" className="py-3">Référence</th>
                            <th scope="col" className="py-3">Titre</th>
                            <th scope="col" className="py-3">Statut</th>
                            <th scope="col" className="py-3">Dernière mise à jour</th>
                            {/* <th scope="col" className="py-3">Date de création</th> */}
                            <th scope="col" className="py-3">Date d'ouverture</th>
                            <th scope="col" className="py-3">Priorité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTickets.map(t => (
                            <tr key={t.id}>
                                <td className="px-4 fw-bold text">#{t.id}</td>
                                <td>{t.externalid || "-"}</td>
                                <td
                                    className="fw-medium  user-select-none cursor-pointer text-decoration-underline-hover" style={{ cursor: 'pointer' }}
                                    onClick={() => handleTicketFiche(t.id)}
                                >{t.name}</td>
                                <td>
                                    <span className="badge bg-secondary px-2 py-1 rounded-pill">
                                        {(TICKET_STATUS as Record<number, string>)[t.status] || "Inconnu"}
                                    </span>
                                </td>
                                <td>{t.date_mod}</td>
                                {/* <td>{t.date_creation}</td> */}
                                <td>{t.date}</td>
                                <td>
                                    <span className="badge border border-light text-light px-2 py-1">
                                        {(TICKET_PRIORITY as Record<number, string>)[t.priority] || "Inconnu"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {tickets.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">
                                    Aucun ticket trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <nav className="mt-4 d-flex justify-content-center" aria-label="Navigation des pages">
                    <ul className="pagination mb-0 shadow-sm">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link bg-dark border-secondary text-white" onClick={handlePrev} disabled={currentPage === 1}>
                                Précédent
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link bg-dark border-secondary text-white-50">
                                Page {currentPage} sur {totalPages}
                            </span>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link bg-dark border-secondary text-white" onClick={handleNext} disabled={currentPage === totalPages}>
                                Suivant
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}