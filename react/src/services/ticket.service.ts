import { DateTime } from "luxon";
import type { ITicketImport } from "../types/import/tickets-import";
import type { ITicket } from "../types/ticket";
import { MethodeService } from "./methode.service";
import { REVERSE_TICKET_PRIORITY, REVERSE_TICKET_STATUS, REVERSE_TICKET_TYPES, TICKET_TYPES } from "../utils";
import type ITicketFiche from "../types/ticket";
import { assetsService } from "./assets.service";
import { ticketCostService } from "./ticket-cost.service";

class TicketService extends MethodeService {
    private endpoint = "Ticket";
    async getItemsById (idTicket:number){
        return await assetsService.getByIdTicket (idTicket);
    }
    async getTicketFicheById (idTicket:number) : Promise<ITicketFiche>{
        const ticket = await this.getById (idTicket) as ITicketFiche;
        const items = await this.getItemsById (idTicket);
        const ticketCosts = await ticketCostService.getByIdTicket (idTicket);
        ticket.items = items;
        ticket.ticket_costs = ticketCosts;


        return ticket;
    }
    async getDashBoardTotalTicket () : Promise<Record<string , number>>{
        const resp : Record<string , number> = {};
        const tickets = await this.getAll ();
        for (const ticketType in REVERSE_TICKET_TYPES) {
            console.log (REVERSE_TICKET_TYPES);
            if (!Object.hasOwn(REVERSE_TICKET_TYPES, ticketType)) continue;
            const element = REVERSE_TICKET_TYPES[ticketType];
            console.log (element , " : " , ticketType);
            const ticketByType =  tickets.filter (t => t.type === element );
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
                status: REVERSE_TICKET_STATUS["New"],
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
