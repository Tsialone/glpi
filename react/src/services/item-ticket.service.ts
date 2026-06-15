import type { ITicketImport } from "../types/import/tickets-import";
import type { IItemTicket } from "../types/item-ticket";
import type { ITicket } from "../types/ticket";
import { REVERSE_TICKET_STATUS } from "../utils";
import { assetsService } from "./assets.service";
import { MethodeService } from "./methode.service";
import { ticketService } from "./ticket.service";

class ItemTicketService extends MethodeService {
    private endpoint = "Item_Ticket";
    
    async getByIdTicket(idTicket: number): Promise<IItemTicket[]> {
        return (await this.getAll()).filter(it => it.tickets_id === idTicket);
    }
    async createsByTicketImport(ticketImports: ITicketImport[]): Promise<void> {
        const [items, tickets] = await Promise.all([
            assetsService.getAll(),
            ticketService.getAll()
        ]);

        for (const ticketImport of ticketImports) {
            const itemFiltreds = items.filter(i => i.name && ticketImport.items_array.includes(i.name));
            const ticket = tickets.find(t => String(t.externalid) === String(ticketImport.ref_ticket));
            const idTicket = ticket?.id ?? null;
            console.log ("items a inséré: " , itemFiltreds.map (i => i.name));
            if (idTicket === null) throw new Error(`Ticket introuvable: ${ticketImport.ref_ticket}`)
            for (const itemFiltred of itemFiltreds) {
                // const itemType = await assetsService.getItempTypeById(itemFiltred.id);
                const itemType = itemFiltred.type;

                if (itemType === null) throw new Error(`Item pas de ItemType: ${itemFiltred.name}`)
                const itemTicket: Partial<IItemTicket> = {
                    itemtype: itemType,
                    items_id: itemFiltred.id,
                    tickets_id: idTicket,
                }
                console.log("ajout de l'item: ", itemFiltred.name, " dans le ticket: ", idTicket)
                await this.create(itemTicket)
            }
            const ticketUpdate: Partial<ITicket> = {
                id: idTicket,
                status: REVERSE_TICKET_STATUS[ticketImport.status.toLowerCase()]
            };
            await ticketService.modfiy(ticketUpdate); // modify = patch
        }
    }

    async getAll() {
        return await this.get<IItemTicket[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IItemTicket>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IItemTicket>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IItemTicket>) {
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

export const itemTicketService = new ItemTicketService();
