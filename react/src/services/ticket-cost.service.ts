import type { ITicketCost } from "../types/ticket-cost";
import { MethodeService } from "./methode.service";

class TicketCostService extends MethodeService {
    private endpoint = "TicketCost";

    async getAll() {
        return await this.get<ITicketCost[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ITicketCost>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ITicketCost>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ITicketCost>) {
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

export const ticketCostService = new TicketCostService();
