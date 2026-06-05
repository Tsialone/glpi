import type { ITicketUser } from "../types/ticket-user";
import { MethodeService } from "./methode.service";

class TicketUserService extends MethodeService {
    private endpoint = "Ticket_User";

    async getAll() {
        return await this.get<ITicketUser[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ITicketUser>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ITicketUser>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ITicketUser>) {
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

export const ticketUserService = new TicketUserService();
