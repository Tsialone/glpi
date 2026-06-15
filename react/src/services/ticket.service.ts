import { DateTime } from "luxon";
import type { ITicketImport } from "../types/import/tickets-import";
import type { ITicket, ITicketFiche, ITicketKnabanPosition } from "../types/ticket";
import { MethodeService } from "./methode.service";
import { REVERSE_TICKET_PRIORITY, REVERSE_TICKET_STATUS, REVERSE_TICKET_TYPES, TICKET_STATUS, TICKET_STATUS_KEY, UTIL_CONST } from "../utils";
import { assetsService } from "./assets.service";
import { ticketCostService } from "./ticket-cost.service";
import { itemTicketService } from "./item-ticket.service";

class TicketService extends MethodeService {
    private endpoint = "Ticket";

    async getGlpiCostById(id: number) {
        const hisItems = (await this.getItemsById(id));
        const totalItem = hisItems.length > 0 ? hisItems.length : 1;
        const totalCost = await this.getTotalCostById(id);
        return totalCost / totalItem;
    }
    async getByItemType(itemType: string): Promise<ITicket[]> {
        const itemTickets = await itemTicketService.getAll();
        const resp: ITicket[] = [];
        const assets = await assetsService.getAll();
        const respTicket = await ticketService.getAll();
        for (const itemTicket of itemTickets) {
            const asset = assets.find(a => a.id === itemTicket.items_id) ?? null;

            if (asset?.type === itemType) {
                const tempTicket = respTicket.find(t => t.id === itemTicket.tickets_id);
                if (tempTicket) {
                    resp.push(tempTicket);
                }
            }
        }
        return resp;
    }
  

   
    async getTotalCostById(idticket: number) {
        const ticketCosts = await ticketService.getTicketFicheById(idticket);
        let respTotal = 0;
        ticketCosts.ticket_costs.map((tc, index) => {
            const cTime = Number(String(tc.cost_time || 0).replace(',', '.'));
            const cFixed = Number(String(tc.cost_fixed || 0).replace(',', '.'));
            const cMaterial = Number(String(tc.cost_material || 0).replace(',', '.'));
            const actionTime = Number(String(tc.actiontime || 0).replace(',', '.'));
            const actionCost = (actionTime / 3600) * cTime;
            const total = actionCost + cFixed + cMaterial;
            respTotal += total;
        }
        );
        return respTotal;
    }
    getTicketStatusKeyBydId(idStatus: number) {
        return (TICKET_STATUS as Record<number, string>)[idStatus] || "Inconnu";
    }

    removePositionByStorage(idTicket: number, fromtype: string) {
        const storage = localStorage.getItem(UTIL_CONST.ticket_position)!;
        const map: Record<string, ITicketKnabanPosition[]> = JSON.parse(storage);

        const ticketToRemove = map[fromtype].find(fp => fp.id_ticket === idTicket);
        if (!ticketToRemove) return;

        const removedPosition = ticketToRemove.position;

        const fromPositions = map[fromtype].filter(fp => fp.id_ticket !== idTicket);

        fromPositions.forEach(fp => {
            if (fp.position > removedPosition) {
                fp.position -= 1;
            }
        });

        map[fromtype] = fromPositions;
        localStorage.setItem(UTIL_CONST.ticket_position, JSON.stringify(map));
    }
    addPositionByStorage(idTicket: number, toType: string, newPosition: number | null) {
        const storage = localStorage.getItem(UTIL_CONST.ticket_position)!;
        const map: Record<string, ITicketKnabanPosition[]> = JSON.parse(storage);
        const toPositions = map[toType];
        const tempToPositions = [...toPositions];
        if (newPosition != null) {
            for (const p of tempToPositions) {
                if (p.position >= newPosition) {
                    p.position += 1;
                    console.log("modification: >>>: ", p.position);
                }

            }
            tempToPositions.push({ id_ticket: idTicket, position: newPosition });
        }
        else {
            console.log("pas de newPosition: ", newPosition);
            tempToPositions.push({ id_ticket: idTicket, position: toPositions.length });
        }

        map[toType] = tempToPositions;
        localStorage.setItem(UTIL_CONST.ticket_position, JSON.stringify(map));
    }

    setPositionByStorage(idTicket: number, type: string, newPosition: number) {
        const storage = localStorage.getItem(UTIL_CONST.ticket_position)!;
        const map: Record<string, ITicketKnabanPosition[]> = JSON.parse(storage);
        const positions = map[type];
        const tempPosition = [...positions];
        for (const p of tempPosition) {
            if (p.position === newPosition) {
                for (const p2 of tempPosition) {
                    if (p2.id_ticket === idTicket) {
                        p.position = p2.position;
                        p2.position = newPosition;
                        break;
                    }
                }
                break;
            }
        }
        map[type] = tempPosition;
        localStorage.setItem(UTIL_CONST.ticket_position, JSON.stringify(map));
        // return positions.find(p => p.id_ticket === idTicket)?.position ?? 0;
    }

    getPositionByStorage(idTicket: number, type: string) {
        const storage = localStorage.getItem(UTIL_CONST.ticket_position)!;
        const map: Record<string, ITicketKnabanPosition[]> = JSON.parse(storage);
        const positions = map[type];
        return positions.find(p => p.id_ticket === idTicket)?.position ?? 0;
    }

    async getDashBoardTotalTicketByStatus(): Promise<Record<string, number>> {
        const resp: Record<string, number> = {};
        const tickets = await this.getAll();
        for (const ticketStatus in REVERSE_TICKET_STATUS) {
            if (!Object.hasOwn(REVERSE_TICKET_STATUS, ticketStatus)) continue;

            const element = REVERSE_TICKET_STATUS[ticketStatus];
            if (![1, 2, 6].includes(element)) continue;
            const ticketFilterd = tickets.filter(t => t.status === element);
            resp[ticketStatus] = ticketFilterd.length;
        }
        return resp;
    }
    async getByIdStatus(idStatus: number) {
        return (await this.getAll()).filter(t => t.status === idStatus);
    }
    async getItemsById(idTicket: number) {
        return await assetsService.getByIdTicket(idTicket);
    }
    async getTicketFicheById(idTicket: number): Promise<ITicketFiche> {
        const ticket = await this.getById(idTicket) as ITicketFiche;
        const items = await this.getItemsById(idTicket);
        const ticketCosts = await ticketCostService.getByIdTicket(idTicket);
        ticket.items = items;
        ticket.ticket_costs = ticketCosts;

        // console.log ("encule: " , ticket);


        return ticket;
    }
    async getDashBoardTotalTicket(): Promise<Record<string, number>> {
        const resp: Record<string, number> = {};
        const tickets = await this.getAll();
        for (const ticketType in REVERSE_TICKET_TYPES) {
            console.log(REVERSE_TICKET_TYPES);
            if (!Object.hasOwn(REVERSE_TICKET_TYPES, ticketType)) continue;
            const element = REVERSE_TICKET_TYPES[ticketType];

            console.log(element, " : ", ticketType);
            const ticketByType = tickets.filter(t => t.type === element);
            resp[ticketType] = ticketByType.length;
        }
        return resp;
    }
    async createsByTicketImport(ticketImports: ITicketImport[]): Promise<void> {
        for (const ticketImport of ticketImports) {
            const dateStr = `${ticketImport.date} ${ticketImport.heure}:00`;
            const date = DateTime.fromFormat(dateStr, "dd/MM/yyyy HH:mm:ss");
            if (!date.isValid) throw new Error(`Date non valide: ${dateStr}`);
            const ticket: Partial<ITicket> = {
                date: date.toFormat("yyyy-MM-dd HH:mm:ss"),
                type: REVERSE_TICKET_TYPES[ticketImport.type],
                name: ticketImport.titre,
                content: ticketImport.description,
                status: REVERSE_TICKET_STATUS[TICKET_STATUS_KEY.New],
                priority: REVERSE_TICKET_PRIORITY[ticketImport.priority.toLowerCase()],
                externalid: ticketImport.ref_ticket
            }
            console.log("creation ticket: ", ticket);
            // console.log ("hisPriorityId: " , REVERSE_TICKET_PRIORITY[ticketImport.priority] ,  "hisPriorityImport: " ,  ticketImport.priority.toLowerCase());
            await this.create(ticket);
        }
    }
    async modfiy(data: Partial<ITicket>) {
        return await this.patch(this.endpoint, data)
    }
    async getAll() {
        return await this.get<ITicket[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ITicket>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ITicket>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ITicket>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge() {
        const ids = (await this.getAll()).map(o => o.id);
        return await this.reset(this.endpoint, ids);
    }
}

export const ticketService = new TicketService();
