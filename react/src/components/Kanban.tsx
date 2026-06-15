import { ReactSortable, type Sortable } from "react-sortablejs";
import type { ITicket, ITicketKanbanType } from "../types/ticket";
import { REVERSE_TICKET_STATUS, TICKET_PRIORITY, TICKET_STATUS_KEY } from "../utils";
import { ticketService } from "../services/ticket.service";
import TicketFiche from "../pages/TicketFiche";
import { useContext, useRef, useState } from "react";
import { Modal } from "./Modal";
import TicketSaisie from "../pages/front-office/TicketSaisie";
import type { ITicketValidation } from "../types/ticket-validation";
import { ticketValidationService } from "../services/ticket-validation.service";
import { PopupContext } from "../contexts/PopupContext";
import { LoadingContext } from "../contexts/Loading";
import { specialCostService } from "../services/nest/special-cost.service";

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


    const { showPopup } = useContext(PopupContext)!;
    const { setLoading } = useContext(LoadingContext)!;

    const [ticketValidation, setTicketValidation] = useState<Partial<ITicketValidation>>({ comment_submission: "Ex: Merci", comment_validation: "Bien recus", super_cost: 2 });

    const [isOpenValidation, setIsOpenValidation] = useState<boolean>(false);


    const [isOpenAlleas, setIsOpenAlleas] = useState<boolean>(false);
    const [pourcentage, setPourcentage] = useState<number>(0);



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
            // setLoading (true);
            const idTicket = evt.item.getAttribute("data-id");
            const newPosition = evt.newIndex!;

            const ticket: Partial<ITicket> = {
                id: Number(idTicket),
                status: Number(statusId)
            }
            const realStatus = (await ticketService.getById(ticket.id!)).status;
            if (type.key === "closed") {
                setPendingMove({ idTicket, key: type.key, newPosition, ticket })
                setIsOpenValidation(true);
                return;
            }
            if (type.key === TICKET_STATUS_KEY.Assigned && realStatus === 6) {
                // if (realStatus === 6) {
                console.log("xxxx", realStatus)
                setPendingMove({ idTicket, key: type.key, newPosition, ticket })
                setIsOpenAlleas(true);
                return;
                // }
            }
            else {
                console.log("jjjjjjjjjjjjj")
                ticketService.addPositionByStorage(Number(idTicket), type.key, newPosition);
                await ticketService.modfiy(ticket)

            }
            console.log("add>>>>>>>>id: ", idTicket, " newPosition: ", newPosition, " key: ", type.key)
            console.log(idTicket, statusId);
        } catch (error) {
            showPopup((error as Error).message ?? " Erreur l'ors d'insertion");
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
            const superCost = tempTicketValidation.super_cost;
            if (superCost === undefined) {
                throw new Error("Supper cost obli");
            }
            // const tempSuperCost: Partial<INSuperCost> = {
            //     id_ticket: Number(idTicket),
            //     super_cost: superCost
            // }
            await specialCostService.saveSpecialCostByIdTicket(Number(idTicket), superCost, "super");
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
            setTicketValidation({ comment_submission: "Ex: Merci", comment_validation: "Bien recus", super_cost: 2 });
            setPendingMove(null);
        } catch (error) {
            showPopup((error as Error).message || "Erreur de Validation!!")
            console.error(error);
        }



    }
    async function handleTicketSave(idTicket: number) {
        setIsOpenSaisie(false);
        ticketService.addPositionByStorage(Number(idTicket), type.key, null);
        await props.fetchTickets();
        console.log(idTicket);

    }

    async function handleAnnulerAlleas() {
        const { idTicket, newPosition, key, ticket } = pendingMove;
        try {
            ticketService.addPositionByStorage(Number(idTicket), type.key, null);
            const deleteCost = await specialCostService.deleteCurrentSpecialCostByIdTicket(Number(idTicket) , "super");

            await ticketService.modfiy(ticket)
            await props.fetchTickets();
            setPendingMove(null);
            setIsOpenAlleas(false);

        } catch (error) {
            console.error(error);
        }
    }
    async function handleValiderAlleas() {
        const { idTicket, newPosition, key, ticket } = pendingMove;
        try {
            ticketService.addPositionByStorage(Number(idTicket), type.key, null);
            const currentCost = await specialCostService.getCurrentTotalCostByIdTicket(Number(idTicket));
            const realOpenCost = (currentCost * pourcentage / 100);
            await specialCostService.saveSpecialCostByIdTicket(Number(idTicket), realOpenCost, "open");

            // const tempOpenCost: Partial<INOpenCost> = {
            //     id_ticket: Number(idTicket),
            //     cost: realOpenCost
            // }
            // const addOpenCost = await openCostService.create(tempOpenCost);
            // const deleteCost = await superCostService.deleteByIdTicket(idTicket);
            // console.log("realOpenCost: ", realOpenCost, " currentCost: ", currentCost);
            await ticketService.modfiy(ticket)
            await props.fetchTickets();
            setPendingMove(null);
            setIsOpenAlleas(false);
        } catch (error) {
            showPopup((error as Error).message);
            // console.error(error);
        }
    }



    return (
        <>
            <Modal
                isOpen={isOpenAlleas}
                title="Open cost"
                onClose={() => setIsOpenAlleas(false)}
                footer={
                    <div>
                        <button className="btn btn-success" onClick={handleValiderAlleas} >
                            Open
                        </button>
                        <button className="btn btn-success" onClick={handleAnnulerAlleas} >
                            Annuler
                        </button>
                    </div>

                }
            >
                <div className="mb-3">
                    <label htmlFor="submission" className="text-light form-label fw-bold" >Pourcentage</label>
                    <input type="number" onChange={(ev) => setPourcentage(Number(ev.target.value))} className="form-control bg-dark text-light" placeholder="Ex: Vérifié ce ticket stp" id="submission"></input>
                </div>
            </Modal>
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
                    <input value={ticketValidation.comment_submission ?? ""} type="text" onChange={(ev) => setTicketValidation({ ...ticketValidation, comment_submission: ev.target.value })} className="form-control bg-dark text-light" placeholder="Ex: Vérifié ce ticket stp" id="submission"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="commentaire" className="text-light form-label fw-bold" >Commentaire</label>
                    <textarea value={ticketValidation.comment_validation ?? ""} onChange={(ev) => setTicketValidation({ ...ticketValidation, comment_validation: ev.target.value })} className="form-control bg-dark text-light" rows={4} placeholder="commentaire" id="commentaire"></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="superCost">Super cost</label>
                    <input type="number" onChange={(ev) => setTicketValidation({ ...ticketValidation, super_cost: Number(ev.target.value) })} id="superCost" placeholder="Super Cost" className="form-control" />
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
                                    <span className="badge bg-secondary" >ref°{t.externalid}</span>
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