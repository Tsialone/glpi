import type { IChangeTicket } from "../types/change-ticket";
import { MethodeService } from "./methode.service";

class ChangeTicketService extends MethodeService {
    private endpoint = "Change_Ticket";

    async getAll() {
        return await this.get<IChangeTicket[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IChangeTicket>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IChangeTicket>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IChangeTicket>) {
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

export const changeTicketService = new ChangeTicketService();
