import type { IItemTicket } from "../types/item-ticket";
import { MethodeService } from "./methode.service";

class ItemTicketService extends MethodeService {
    private endpoint = "Item_Ticket";

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
        return await this.del(this.endpoint, id, false);
    }

    async purge() {
        const ids = (await this.getAll()).map(o => o.id);
        return await this.reset(this.endpoint, ids);
    }
}

export const itemTicketService = new ItemTicketService();
