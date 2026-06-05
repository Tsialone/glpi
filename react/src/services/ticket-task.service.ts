import type { ITicketTask } from "../types/ticket-task";
import { MethodeService } from "./methode.service";

class TicketTaskService extends MethodeService {
    private endpoint = "TicketTask";

    async getAll() {
        return await this.get<ITicketTask[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ITicketTask>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ITicketTask>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ITicketTask>) {
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

export const ticketTaskService = new TicketTaskService();
