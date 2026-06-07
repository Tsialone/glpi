import type { ITicketCostImport } from "../types/import/tickets-cost-import";
import type { ITicketCost } from "../types/ticket-cost";
import { MethodeService } from "./methode.service";
import { ticketService } from "./ticket.service";

class TicketCostService extends MethodeService {

    private endpoint = "TicketCost";
    async createByTicketCostImports(ticketCostImports: ITicketCostImport[]) {
        const tickets = await ticketService.getAll();
        for (const ticketCostImport of ticketCostImports) {
            const ticket = tickets.find(t => String(t.externalid) === String(ticketCostImport.num_ticket)) ?? null;
            if (!ticket) throw new Error(`Pas de ticket pour: ${ticketCostImport.num_ticket}`);
            const ticketCost: Partial<ITicketCost> = {
                actiontime: ticketCostImport.duration_second,
                cost_time: String(ticketCostImport.time_cost),
                tickets_id: ticket.id,
                cost_fixed: String(ticketCostImport.fixed_cost),
                begin_date: ticket.date_creation,
            }
            await this.create(ticketCost);
        }
    }
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
        return await this.del(this.endpoint, id);
    }

    async purge() {
        const ids = (await this.getAll()).map(o => o.id);
        return await this.reset(this.endpoint, ids);
    }
}

export const ticketCostService = new TicketCostService();
