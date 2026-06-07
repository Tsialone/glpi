import React, { useRef, useState, type JSX } from "react";
import type { ITicket } from "../../types/ticket";
import { ITEM_TYPE, REVERSE_TICKET_PRIORITY, REVERSE_TICKET_STATUS, REVERSE_TICKET_TYPES, TICKET_PRIORITY } from "../../utils";
import type { IItemTicket } from "../../types/item-ticket";
import { el } from "date-fns/locale";
import type { IAsset } from "../../types/assets";
import { assetsService } from "../../services/assets.service";
import { ticketService } from "../../services/ticket.service";
import { itemTicketService } from "../../services/item-ticket.service";

export default function TicketSaisie() {
    const [ticket, setTicket] = useState<Partial<ITicket>>({});
    const [itemTicket, setItemTicket] = useState<Partial<IItemTicket | undefined>>();
    const [assets, setAssets] = useState<IAsset[]>([]);
    const [itemTickets, setItemTickets] = useState<Partial<IItemTicket>[]>([]);
    const mapItemName = useRef<Record<number, string>>({});
    async function handleCreate() {
        console.log(ticket);
        console.log(itemTickets);
        const resp = await ticketService.create(ticket);
        if (resp?.id) {
            const idTicket = resp.id;
            for (const itemTicket of itemTickets) {
                itemTicket.tickets_id = idTicket;
                itemTicketService.create(itemTicket);
            }
        }

    }
    async function handleItemTicketChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;
        const respAssets = await assetsService.getAll(value);
        setAssets(respAssets);
        setItemTicket({ itemtype: value });
    }
    function handleAddItemTicket() {
        if (itemTicket) {
            setItemTickets([...itemTickets, itemTicket])
        }
        setItemTicket(undefined);
    }
    function drawItemSelect() {
        const elements: JSX.Element[] = [];
        const itemTypeIds = itemTickets.map(i => Number(i.items_id)) ?? [];
        if (!itemTicket?.itemtype) return elements;
        assets.forEach(a => {
            mapItemName.current[a.id] = a.name ?? String(a.id)
        });

        elements.push(
            <div key="item-select-container" className="d-flex gap-3 align-items-center mt-3">
                <div className="flex-grow-1">
                    <select
                        className="form-select bg-dark text-white border-secondary"
                        onChange={(e) => setItemTicket({ ...itemTicket, items_id: Number(e.target.value) })}
                    >
                        <option value="">-- Sélectionner l'élément --</option>
                        {assets.filter(a => !itemTypeIds.includes(a.id)).map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>
                {itemTicket.items_id && (
                    <button className="btn btn-outline-success px-4" onClick={handleAddItemTicket}>
                        Ajouter
                    </button>
                )}
            </div>
        );
        return elements;
    }
    return (
        <div className="container-fluid p-4 min-vh-100 bg-dark text-white">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-6">
                    <div className="card bg-dark text-white border-secondary shadow-lg" data-bs-theme="dark">
                        <div className="card-header border-secondary py-3">
                            <h4 className="mb-0 text-info">Saisie d'un nouveau ticket</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="form-label text-light small fw-bold">TITRE DU TICKET</label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-white border-secondary"
                                    placeholder="Ex: Problème d'accès internet..."
                                    onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-light small fw-bold">DESCRIPTION</label>
                                <textarea
                                    className="form-control bg-dark text-white border-secondary"
                                    rows={5}
                                    placeholder="Détaillez le problème rencontré ou la demande..."
                                    onChange={(e) => setTicket({ ...ticket, content: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <label className="form-label text-light small fw-bold">PRIORITÉ</label>
                                    <select
                                        className="form-select bg-dark text-white border-secondary"
                                        onChange={(e) => setTicket({ ...ticket, priority: Number(e.target.value) })}
                                    >
                                        <option value="">-- Choisir une priorité --</option>
                                        {Object.entries(REVERSE_TICKET_PRIORITY).map(([key, value]) => (
                                            <option key={key} value={value}>{key}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label text-light small fw-bold">TYPE DE TICKET</label>
                                    <select
                                        className="form-select bg-dark text-white border-secondary"
                                        onChange={(e) => setTicket({ ...ticket, type: Number(e.target.value) })}
                                    >
                                        <option value="">-- Choisir un type --</option>
                                        {Object.entries(REVERSE_TICKET_TYPES).map(([key, value]) => (
                                            <option key={key} value={value}>{key}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-light small fw-bold">Status</label>
                                    <select
                                        className="form-select bg-dark text-white border-secondary"
                                        onChange={(e) => setTicket({ ...ticket, status: Number(e.target.value) })}
                                    >
                                        <option value="">-- Choisir un statut --</option>
                                        {Object.entries(REVERSE_TICKET_STATUS).map(([key, value]) => (
                                            <option key={key} value={value}>{key}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-white small fw-bold">DATE D'OUVERTURE</label>
                                <input
                                    type="date"
                                    className="form-control bg-dark text-white border-secondary"
                                    onChange={(e) => setTicket({ ...ticket, date_creation: e.target.value })}
                                />
                            </div>
                            <div className="mt-5 mb-4">
                                <h6 className="text-info fw-bold border-bottom border-secondary pb-2 mb-4">ÉQUIPEMENTS ASSOCIÉS</h6>

                                {/* Liste des équipements */}
                                {itemTickets.length > 0 ? (
                                    <ul className="list-group list-group-flush rounded shadow-sm border border-secondary mb-4">
                                        {itemTickets.map((i, index) => (
                                            <li key={i.id || index} className="list-group-item bg-dark text-white border-secondary d-flex align-items-center py-3">
                                                <span className="badge border border-info text-info me-3 px-3 py-2">{i.itemtype}</span>
                                                <span className="fw-medium fs-6">{mapItemName.current[i.items_id!] || i.items_id}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted small fst-italic mb-4">Aucun équipement n'est encore associé à ce ticket.</p>
                                )}

                                {/* Formulaire d'ajout */}
                                <div className="p-4 bg-secondary bg-opacity-10 rounded border border-secondary">
                                    <label className="form-label text-light small fw-bold mb-3">NOUVEL ÉQUIPEMENT À ASSOCIER</label>
                                    <div className="mb-0">
                                        <select
                                            className="form-select bg-dark text-white border-secondary"
                                            onChange={(e) => handleItemTicketChange(e)}
                                        >
                                            <option value="">-- Choisir une catégorie d'équipement --</option>
                                            {ITEM_TYPE.map((i, index) => (
                                                <option key={index} value={i}>{i}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {drawItemSelect()}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-5 pt-3 border-top border-secondary">
                                <button className="btn btn-primary px-5 shadow-sm fw-bold" onClick={handleCreate}>
                                    Valider et soumettre
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}