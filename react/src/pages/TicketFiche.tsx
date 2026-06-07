import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ticketService } from "../services/ticket.service";
import { TICKET_PRIORITY, TICKET_STATUS } from "../utils";
import type ITicketFiche from "../types/ticket";
import { Modal } from "../components/Modal";

export default function TicketFiche() {
    const { idTicket } = useParams();
    const [ticket, setTicket] = useState<ITicketFiche | null>(null);

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isItemCostOpen, setIsItemCostOpen] = useState(false);

    async function getTicket() {
        if (idTicket) {
            const respTicket = await ticketService.getTicketFicheById((Number(idTicket)));
            setTicket(respTicket);
        }
    }

    useEffect(() => {
        getTicket();
    }, [idTicket]);



    return (
        <div className="container-fluid p-4 min-vh-100 bg-dark text-white">
            <div>
                <Modal
                    isOpen={isItemModalOpen}
                    onClose={() => setIsItemModalOpen(false)}
                    title="Les élement du associé au ticket"
                    size="lg"
                    footer={
                        <button className="btn btn-success" onClick={() => setIsItemModalOpen(false)}>
                            Valider
                        </button>
                    }
                >
                    <div>
                        {ticket?.items && ticket.items.length > 0 ? (
                            <ul className="list-group list-group-flush rounded shadow-sm border border-secondary">
                                {ticket.items.map((i, index) => (
                                    <li className="list-group-item bg-dark text-white border-secondary d-flex align-items-center" key={index}>
                                        <span className="badge bg-info me-3 rounded-circle p-2"> </span>
                                        <span className="fw-medium">{i.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted text-center py-4 mb-0">Aucun équipement lié à ce ticket.</p>
                        )}
                    </div>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={isItemCostOpen}
                    onClose={() => setIsItemCostOpen(false)}
                    title="Les coûts associés au ticket"
                    size="xl"
                    footer={
                        <button className="btn btn-outline-light" onClick={() => setIsItemCostOpen(false)}>
                            Fermer
                        </button>
                    }
                >
                    <div className="table-responsive shadow-sm rounded border border-secondary">
                        <table className="table table-dark table-striped table-hover align-middle mb-0">
                            <thead className="table-secondary text-dark">
                                <tr>
                                    <th className="py-3 px-3">Nom</th>
                                    <th className="py-3">Date début</th>
                                    <th className="py-3">Durée (s)</th>
                                    <th className="py-3">Coût/Temps</th>
                                    <th className="py-3">Coût Fixe</th>
                                    <th className="py-3">Coût Matériel</th>
                                    <th className="py-3 px-3 text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticket?.ticket_costs && ticket.ticket_costs.length > 0 ? (
                                    ticket.ticket_costs.map((tc, index) => {
                                        const cTime = Number(String(tc.cost_time || 0).replace(',', '.'));
                                        const cFixed = Number(String(tc.cost_fixed || 0).replace(',', '.'));
                                        const cMaterial = Number(String(tc.cost_material || 0).replace(',', '.'));
                                        const actionTime = Number(String(tc.actiontime || 0).replace(',', '.'));
                                        const actionCost = (actionTime / 3600) * cTime;
                                        const total = actionCost + cFixed + cMaterial;
                                        console.log (actionTime);
                                        return (
                                            <tr key={index}>
                                                <td className="px-3 fw-medium">{tc.name || "-"}</td>
                                                <td>{tc.begin_date || "-"}</td>
                                                <td>{tc.actiontime || "0"}</td>
                                                <td>{cTime.toFixed(2)}</td>
                                                <td>{cFixed.toFixed(2)}</td>
                                                <td>{cMaterial.toFixed(2)}</td>
                                                <td className="px-3 fw-bold text-warning text-end">{total.toFixed(2)} €</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">Aucun coût enregistré pour ce ticket.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Fiche du Ticket {ticket ? `#${ticket.id}` : ''}</h2>
                <Link to="/backoffice/admin/ticket" className="btn btn-outline-light btn-sm shadow-sm">
                    &larr; Retour à la liste
                </Link>
            </div>

            {ticket ? (
                <div className="card bg-dark text-white border-secondary shadow">
                    <div className="card-header border-secondary d-flex justify-content-between align-items-center py-3">
                        <h4 className="mb-0 fw-bold">{ticket.name}</h4>
                        <div>
                            <span className="badge bg-secondary px-3 py-2 rounded-pill me-2">
                                {(TICKET_STATUS as Record<number, string>)[ticket.status] || "Statut inconnu"}
                            </span>
                            <span className="badge border border-light text-light px-3 py-2">
                                {(TICKET_PRIORITY as Record<number, string>)[ticket.priority] || "Priorité inconnue"}
                            </span>
                        </div>
                    </div>
                    <div className="card-body p-4">
                        <h6 className="card-subtitle mb-4 text-muted">
                            Référence : {ticket.externalid || "Non spécifiée"}
                        </h6>

                        <h5 className="mb-3 text-info">Description du problème</h5>
                        <div className="p-4 bg-secondary bg-opacity-25 rounded border border-secondary mb-4">
                            <p className="card-text mb-0 fs-5" style={{ whiteSpace: "pre-wrap" }}>
                                {ticket.content || "Aucune description fournie pour ce ticket."}
                            </p>
                        </div>

                        <div className="d-flex justify-content-between align-items-end mt-4 pt-3 border-top border-secondary">
                            <div className="d-flex flex-column text">
                                <small className="mb-1"><strong>Ouvert le :</strong> {ticket.date_creation || "-"}</small>
                                <small><strong>Dernière modif :</strong> {ticket.date_mod || "-"}</small>
                            </div>

                            <div className="d-flex gap-4 me-3">
                                <button className="btn btn-outline-info position-relative" onClick={() => setIsItemModalOpen(true)}>
                                    Items
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
                                        {/* @ts-ignore - en attendant le typage strict des items */}
                                        {ticket.items?.length || 0}
                                    </span>
                                </button>
                                <button className="btn btn-outline-warning position-relative" onClick={() => setIsItemCostOpen(true)} >
                                    Costs
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
                                        {/* @ts-ignore - en attendant le typage strict des coûts */}
                                        {ticket.ticket_costs.length || 0}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-5 mt-5">
                    <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Récupération des données du ticket...</p>
                </div>
            )}
        </div>
    );
}