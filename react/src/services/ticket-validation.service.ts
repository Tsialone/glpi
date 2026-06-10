import { MethodeService } from "./methode.service";
import type { ITicketValidation } from "../types/ticket-validation";

class TicketValidationService extends MethodeService {
    private endpoint = "TicketValidation";

    async modify(data: Partial<ITicketValidation>) {
        return await this.patch(this.endpoint, data);
    }
    async getAll() {
        return await this.get<ITicketValidation[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ITicketValidation>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ITicketValidation>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ITicketValidation>) {
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

export const ticketValidationService = new TicketValidationService();
