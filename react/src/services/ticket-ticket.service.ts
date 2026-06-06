import type { ITicketTicket } from "../types/ticket-ticket";
import { MethodeService } from "./methode.service";

class TicketTicketService extends MethodeService {
    private endpoint = "Ticket_Ticket";

    async getAll() {
        return await this.get<ITicketTicket[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ITicketTicket>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ITicketTicket>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ITicketTicket>) {
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

export const ticketTicketService = new TicketTicketService();
