import { useContext, useEffect, useState } from "react";
import Kanban from "../../components/Kanban";
import type { ITicket, ITicketKnabanPosition } from "../../types/ticket";
import { ticketService } from "../../services/ticket.service";
import { REVERSE_TICKET_STATUS, TICKET_STATUS, TICKET_STATUS_KEY, UTIL_CONST } from "../../utils";
import type { INStatusColor } from "../../types/nest/status-color";
import { statusColorService } from "../../services/nest/status-color.service";
import { LoadingContext } from "../../contexts/Loading";
import type { INStatusLang } from "../../types/nest/status-lang";
import { statusLangService } from "../../services/nest/status-lang.service";
import { assetsService, type Super } from "../../services/assets.service";
import { Table } from "../../components/Table";
import { specialCostService } from "../../services/nest/special-cost.service";
export default function TicketStatus() {
    const [newTickets, setNewTickets] = useState<ITicket[]>([]);
    const [assignedTickets, setAssignedTickets] = useState<ITicket[]>([]);
    const [closedTickets, setClosedTickets] = useState<ITicket[]>([]);

    const [statusColors, setStatusColors] = useState<INStatusColor[]>([]);

    const { setLoading } = useContext(LoadingContext)!;


    const [langs, setLangs] = useState<string[]>([]);
    const [statusLangs, setStatusLangs] = useState<INStatusLang[]>([]);
    const [lang, setLang] = useState<string>("fr");



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
            map[TICKET_STATUS_KEY.New] = newPositions;
            map[TICKET_STATUS_KEY.Assigned] = assignedPositions;
            map[TICKET_STATUS_KEY.Closed] = closedPositions;
            localStorage.setItem(UTIL_CONST.ticket_position, JSON.stringify(map));
            return true;
        }
        else {
            return false;
            // console.log (JSON.parse  (storage));
        }
    }


    async function fetchTickets() {
        setLoading(true);

        try {
         
            const respTickets = await ticketService.getAll();
            const respNewTickets = respTickets.filter(t => t.status === REVERSE_TICKET_STATUS[TICKET_STATUS_KEY.New]);
            const respAssignedTickets = respTickets.filter(t => t.status === REVERSE_TICKET_STATUS[TICKET_STATUS_KEY.Assigned]);
            const respClosedTickets = respTickets.filter(t => t.status === REVERSE_TICKET_STATUS[TICKET_STATUS_KEY.Closed]);


            const init = initStorage(respNewTickets, respAssignedTickets, respClosedTickets);
            if (!init) {
                respNewTickets.sort((a, b) => ticketService.getPositionByStorage(a.id, TICKET_STATUS_KEY.New) - ticketService.getPositionByStorage(b.id, TICKET_STATUS_KEY.New));
                respAssignedTickets.sort((a, b) => ticketService.getPositionByStorage(a.id, TICKET_STATUS_KEY.Assigned) - ticketService.getPositionByStorage(b.id, TICKET_STATUS_KEY.Assigned));
                respClosedTickets.sort((a, b) => ticketService.getPositionByStorage(a.id, TICKET_STATUS_KEY.Closed) - ticketService.getPositionByStorage(b.id, TICKET_STATUS_KEY.Closed));

            }
            setNewTickets(respNewTickets);
            setAssignedTickets(respAssignedTickets);
            setClosedTickets(respClosedTickets);

            //init params colors
            const respStatusColors = await statusColorService.getAll();
            setStatusColors(respStatusColors);

            //ini params langs
            const respStatusLangs = await statusLangService.getAll();
            setStatusLangs(respStatusLangs);
            // const temp = [...new Set(respStatusLangs.map (l => l.lang))];
            // console.log (temp);
            setLangs([...new Set(respStatusLangs.map(l => l.lang))])
            const langStorage = localStorage.getItem(UTIL_CONST.lang);
            if (langStorage) {
                setLang(JSON.parse(langStorage));
            }
           

        } catch (error) {

        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchTickets();

    }, [])
    function getStatusLangIdStatus(idStatus: number, defaultValue: string) {
        return statusLangs.find(l => l.id_status === idStatus && l.lang === lang)?.value ?? defaultValue + "(defaulft)";
    }
    return (
        <>
            {/* <div className="container  bg-dark" > */}
            <div className="row bg-dark mb-2">
                <div className="col-2 ms-auto">
                    <select name="" id="" className="form-control bg-dark text-light" value={lang} onChange={(ev) => {
                        setLang(ev.target.value);
                        localStorage.setItem(UTIL_CONST.lang, JSON.stringify(ev.target.value))
                    }} >
                        <option value="">----Langage---</option>
                        {
                            langs.map(l => (
                                <option key={l} value={l}> {l} </option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {statusColors.length > 0 &&

                (
                    <div className="row bg-dark justify-content-center" >
                        <Kanban
                            color={statusColors.find(s => s.id_status === REVERSE_TICKET_STATUS[TICKET_STATUS_KEY.New])?.color ?? "red"}
                            tickets={newTickets}
                            setTickets={setNewTickets}
                            fetchTickets={fetchTickets}
                            type={{ key: TICKET_STATUS_KEY.New, label: getStatusLangIdStatus(1, TICKET_STATUS_KEY.New) }}

                        >
                        </Kanban>

                        <Kanban
                            color={statusColors.find(s => s.id_status === 2)?.color ?? "green"}
                            tickets={assignedTickets}
                            setTickets={setAssignedTickets}
                            fetchTickets={fetchTickets}

                            type={{ key: TICKET_STATUS_KEY.Assigned, label: getStatusLangIdStatus(2, TICKET_STATUS_KEY.Assigned) }}
                        >
                        </Kanban>

                        <Kanban
                            color={statusColors.find(s => s.id_status === REVERSE_TICKET_STATUS["closed"])?.color ?? "yellow"}
                            tickets={closedTickets}
                            setTickets={setClosedTickets}
                            fetchTickets={fetchTickets}
                            type={{ key: TICKET_STATUS_KEY.Closed, label: getStatusLangIdStatus(6, TICKET_STATUS_KEY.Closed) }}
                        >
                        </Kanban>


                       

                    </div>
                )
            }


            {/* </div> */}
        </>
    )
}