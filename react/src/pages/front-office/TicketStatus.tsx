import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Kanban from "../../components/Kanban";
import type { ITicket, ITicketKnabanPosition } from "../../types/ticket";
import { ticketService } from "../../services/ticket.service";
import { REVERSE_TICKET_STATUS, TICKET_STATUS, UTIL_CONST } from "../../utils";
export default function TicketStatus() {
    const [newTickets, setNewTickets] = useState<ITicket[]>([]);
    const [assignedTickets, setAssignedTickets] = useState<ITicket[]>([]);
    const [closedTickets, setClosedTickets] = useState<ITicket[]>([]);


    function initStorage(
        respNewTickets: ITicket[],
        respAssignedTickets: ITicket[],
        respClosedTickets: ITicket[],
    ) {
        const storage = localStorage.getItem(UTIL_CONST.ticket_position);
        if (!storage) {
            const map: Record<string, ITicketKnabanPosition[]> = {

            }
            const newPositions: ITicketKnabanPosition[] = [];
            const assignedPositions: ITicketKnabanPosition[] = [];
            const closedPositions: ITicketKnabanPosition[] = [];

            respNewTickets.forEach((t, index) => {
                newPositions.push({ id_ticket: t.id, position: index });
            });
            respAssignedTickets.forEach((t, index) => {
                assignedPositions.push({ id_ticket: t.id, position: index });
            });
            respClosedTickets.forEach((t, index) => {
                closedPositions.push({ id_ticket: t.id, position: index });
            });
            map["new"] = newPositions;
            map["assigned"] = assignedPositions;
            map["closed"] = closedPositions;
            localStorage.setItem(UTIL_CONST.ticket_position, JSON.stringify(map));
            return true;
        }
        else {
            return false;
            // console.log (JSON.parse  (storage));
        }
    }


    async function fetchTickets() {
        const respTickets = await ticketService.getAll();
        const respNewTickets = respTickets.filter(t => t.status === REVERSE_TICKET_STATUS["new"]);
        const respAssignedTickets = respTickets.filter(t => t.status === REVERSE_TICKET_STATUS["assigned"]);
        const respClosedTickets = respTickets.filter(t => t.status === REVERSE_TICKET_STATUS["closed"]);


        const init = initStorage(respNewTickets, respAssignedTickets, respClosedTickets);
        if (!init) {
            respNewTickets.sort((a, b) => ticketService.getPositionByStorage(a.id, "new") - ticketService.getPositionByStorage(b.id, "new"));
            respAssignedTickets.sort((a, b) => ticketService.getPositionByStorage(a.id, "assigned") - ticketService.getPositionByStorage(b.id, "assigned"));
            respClosedTickets.sort((a, b) => ticketService.getPositionByStorage(a.id, "closed") - ticketService.getPositionByStorage(b.id, "closed"));

        }
        setNewTickets(respNewTickets);
        setAssignedTickets(respAssignedTickets);
        setClosedTickets(respClosedTickets);
    }

    useEffect(() => {
        fetchTickets();
    }, [])
    return (
        <>
            {/* <div className="container  bg-dark" > */}
                <div className="row bg-dark justify-content-center" >
                    <Kanban
                        color="red"
                        tickets={newTickets}
                        setTickets={setNewTickets}
                        fetchTickets={fetchTickets}
                        type={{ key: "new", label: "New" }}

                    >
                    </Kanban>

                    <Kanban
                        color="green"
                        tickets={assignedTickets}
                        setTickets={setAssignedTickets}
                        fetchTickets={fetchTickets}

                        type={{ key: "assigned", label: "In progress" }}
                    >
                    </Kanban>

                    <Kanban
                        color="yellow"
                        tickets={closedTickets}
                        setTickets={setClosedTickets}
                        fetchTickets={fetchTickets}
                        type={{ key: "closed", label: "Terminé" }}
                    >
                    </Kanban>


                </div>

            {/* </div> */}
        </>
    )
}