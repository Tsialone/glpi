import { ReactSortable, type Sortable } from "react-sortablejs";
import type { ITicket, ITicketKanbanType } from "../types/ticket";
import { REVERSE_TICKET_STATUS, TICKET_PRIORITY } from "../utils";
import { ticketService } from "../services/ticket.service";
import TicketFiche from "../pages/TicketFiche";
import { useRef, useState } from "react";
import { Modal } from "./Modal";
import TicketSaisie from "../pages/front-office/TicketSaisie";
import type { ITicketValidation } from "../types/ticket-validation";
import { ticketValidationService } from "../services/ticket-validation.service";

interface KanbanProps {
    type: ITicketKanbanType,
    color: string,
    groupe?: string,
    tickets: ITicket[],
    fetchTickets: () => Promise<void>
    setTickets: (tickets: ITicket[]) => void;
}
export default function Kanban(props: KanbanProps) {
    const { color, type, tickets, setTickets, groupe = "ticket" } = props;
    const [isOpenFiche, setIsOpenFiche] = useState<boolean>(false);
    const [isOpenSaisie, setIsOpenSaisie] = useState<boolean>(false);
    const [pendingMove, setPendingMove] = useState<any>(null);

    const [ticketValidation, setTicketValidation] = useState<Partial<ITicketValidation>>({});

    const [isOpenValidation, setIsOpenValidation] = useState<boolean>(false);

    const id_ticket = useRef<number>(0);
    const statusId = REVERSE_TICKET_STATUS[type.key];

    function handleUpdate(evt: Sortable.SortableEvent) {
        const idTicket = evt.item.getAttribute("data-id");
        const newPosition = evt.newIndex!;
        ticketService.setPositionByStorage(Number(idTicket), type.key, newPosition);
        console.log("change>>>> id: ", idTicket, " newPosition: ", newPosition, " key: ", type.key)

    }
    function handleRemove(evt: Sortable.SortableEvent) {
        const idTicket = evt.item.getAttribute("data-id");
        const newPosition = evt.newIndex!;
        // if (type.key === "closed") return;
        ticketService.removePositionByStorage(Number(idTicket), type.key);
        console.log("remove>>>>>>>>id: ", idTicket, " newPosition: ", newPosition, " key: ", type.key)

    }
    async function handleMoveTicket(evt: Sortable.SortableEvent) {
        try {
            const idTicket = evt.item.getAttribute("data-id");
            const newPosition = evt.newIndex!;
            const ticket: Partial<ITicket> = {
                id: Number(idTicket),
                status: Number(statusId)
            }
            if (type.key === "closed") {
                setPendingMove({ idTicket, key: type.key, newPosition, ticket })
                setIsOpenValidation(true);
                return;
            }
            ticketService.addPositionByStorage(Number(idTicket), type.key, newPosition);
            await ticketService.modfiy(ticket)
            console.log("add>>>>>>>>id: ", idTicket, " newPosition: ", newPosition, " key: ", type.key)

            console.log(idTicket, statusId);
        } catch (error) {
            console.error(error);
        }
    }
    function handleTicketClick(id: number) {
        console.log("hey");
        setIsOpenFiche(true);
        id_ticket.current = id;
    }
    async function handleValidationClose() {
        setIsOpenValidation(false);
        await props.fetchTickets();
        console.log("feerer")
    }
    async function handleValidationValidate() {
        setIsOpenValidation(false);
        const tempTicketValidation = { ...ticketValidation };

        try {
            const { idTicket, newPosition, key, ticket } = pendingMove;
            tempTicketValidation.tickets_id = idTicket;
            tempTicketValidation.items_id_target = 2;
            tempTicketValidation.users_id_validate = 2;
            tempTicketValidation.users_id = 2;
            // tempTicketValidation.status = 3;


            // console.log(pendingMove);
            ticketService.addPositionByStorage(Number(idTicket), key, newPosition);
            const resp = await ticketValidationService.create(tempTicketValidation);
            if (resp?.id) {
                const modifyValidation: Partial<ITicketValidation> = {
                    id: resp.id,
                    status: 3,
                }
                await ticketValidationService.modify(modifyValidation);
            }
            await ticketService.modfiy(ticket)
            await props.fetchTickets();
            setTicketValidation({});
            setPendingMove(null);
        } catch (error) {
            console.error(error);
        }



    }
    async function handleTicketSave(idTicket: number) {
        setIsOpenSaisie(false);
        ticketService.addPositionByStorage(Number(idTicket), type.key);
        await props.fetchTickets();
        console.log(idTicket);

    }

    return (
        <>
            <Modal
                isOpen={isOpenValidation}
                title="Validation et commentaire"
                onClose={handleValidationClose}
                footer={
                    <button className="btn btn-success" onClick={handleValidationValidate} >
                        Valider
                    </button>
                }
            >
                <div className="mb-3">
                    <label htmlFor="submission" className="text-light form-label fw-bold" >Submission</label>
                    <input type="text" onChange={(ev) => setTicketValidation({ ...ticketValidation, comment_submission: ev.target.value })} className="form-control bg-dark text-light" placeholder="Ex: Vérifié ce ticket stp" id="submission"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="commentaire" className="text-light form-label fw-bold" >Commentaire</label>
                    <textarea onChange={(ev) => setTicketValidation({ ...ticketValidation, comment_validation: ev.target.value })} className="form-control bg-dark text-light" rows={4} placeholder="commentaire" id="commentaire"></textarea>
                </div>
            </Modal>
            <Modal
                isOpen={isOpenSaisie}
                title="Ticket Saisie"
                size="lg"
                onClose={() => setIsOpenSaisie(false)}
            >
                <div>
                    <TicketSaisie id_status={REVERSE_TICKET_STATUS["new"]} handleClose={handleTicketSave} >
                    </TicketSaisie>
                </div>
            </Modal>
            <Modal
                isOpen={isOpenFiche}
                title="Ticket Fiche"
                onClose={() => setIsOpenFiche(false)}
            >
                <div>
                    <TicketFiche id={id_ticket.current}>
                    </TicketFiche>
                </div>
            </Modal>
            <div className="col-3 d-flex flex-column rounded-3 ms-4 mt-3 mb-4" style={{ backgroundColor: color }}>
                <div className="w-100 d-flex justify-content-between align-items-center mb-1 mt-1">
                    <h4 className="text-dark mb-0">{type.label}</h4>
                    <div className="badge fw-bold text-dark rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "azure", width: 25, height: 25, fontSize: 10, }}>
                        {tickets.length}
                    </div>
                </div>
                <ReactSortable
                    list={tickets}
                    setList={(setTickets)}
                    group={groupe}
                    className="overflow-auto mb-2"
                    style={{ maxHeight: 300 }}
                    onAdd={(evt) => handleMoveTicket(evt)}
                    onUpdate={(evt) => handleUpdate(evt)}
                    onRemove={(evt) => handleRemove(evt)}
                >
                    {/* background-color: azure; width: 25px; height: 25px; font-size: 10px; */}
                    {
                        tickets.map(t => (
                            <div
                                key={t.id}
                                className="p-3 bg-light rounded-3 m-2 d-flex flex-column mt-auto"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleTicketClick(t.id)}
                            >
                                {/* Nom principal mis en valeur */}
                                <div className="text-dark fw-bold fs-6 mb-1">{t.name}</div>

                                {/* Détails secondaires en petits caractères */}
                                <div className="d-flex flex-wrap gap-2 text-secondary xsmall">
                                   
                                    <span className="badge bg-secondary" >#{t.id}</span>
                                    <span className="badge bg-secondary" >n°{ticketService.getPositionByStorage(t.id, type.key)}</span>
                                    <span className="badge bg-secondary" >{(TICKET_PRIORITY as Record<number, string>)[t.priority] || "Inconnu"}</span>
                                </div>
                            </div>
                        ))
                    }
                </ReactSortable >
                {tickets.length === 0 && <p className="text text-center fw-bold">Pas de tickets</p>}
                {type.key === "new" && (
                    <button className="p-2  bg-light rounded-3 mb-2" onClick={() => setIsOpenSaisie(true)} ><span className="text-dark"><i className="bi bi-plus"></i> Ajouter un
                        ticket</span> </button>
                )}

            </div>
        </>

    );
}