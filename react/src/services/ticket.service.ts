import type { ITicket } from "../types/ticket";
import { MethodeService } from "./methode.service";

class TicketService extends MethodeService {
    private endpoint = "Ticket";

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
        return await this.del(this.endpoint, id, false);
    }

    async purge() {
        const ids = (await this.getAll()).map(o => o.id);
        return await this.reset(this.endpoint, ids);
    }
}

export const ticketService = new TicketService();
