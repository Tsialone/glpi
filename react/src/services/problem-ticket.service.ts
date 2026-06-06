import type { IProblemTicket } from "../types/problem-ticket";
import { MethodeService } from "./methode.service";

class ProblemTicketService extends MethodeService {
    private endpoint = "Problem_Ticket";

    async getAll() {
        return await this.get<IProblemTicket[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IProblemTicket>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IProblemTicket>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IProblemTicket>) {
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

export const problemTicketService = new ProblemTicketService();
