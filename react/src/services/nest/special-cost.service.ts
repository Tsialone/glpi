import { DateTime } from "luxon";
import type { INCost, INSpecialCost } from "../../types/nest/special-cost";
import { nestApiClient } from "../../utils/api";
import { MethodeService } from "../methode.service";
import { ticketService } from "../ticket.service";

class SpecialCostService extends MethodeService {
    private endpoint = "special-cost";

    constructor() {
        super()
        this.defaultApiClient = nestApiClient;
    }

    async initGlpiCost() {
        const haveGlpiCost = await this.haveGlpiCost();
        if (!haveGlpiCost) {
            const tickets = await ticketService.getAll();
            console.log ("dont have tickets: " , tickets);
            for (const ticket of tickets) {
                const totalCost = await ticketService.getTotalCostById(ticket.id);
                await this.saveSpecialCostByIdTicket(ticket.id, totalCost, "glpi");
            }
        }
        console.log(haveGlpiCost);
    }

    async haveGlpiCost() {
        return (await this.getAll()).some(sc => sc.category === "glpi");
    }
    async deleteCurrentSpecialCostByIdTicket(idTicket: number, category: string) {
        const currentSpecialCosts = (await this.getCurrentSpecialCostByIdTicket(idTicket)).filter(csp => csp.category === category);
        const currentSpecialCostsIds = currentSpecialCosts.map(csc => csc.id);
        console.log("toDelete: ", currentSpecialCostsIds);
        console.log("toDelete: ", currentSpecialCosts);
        return await this.reset(this.endpoint, currentSpecialCostsIds);
    }

    async getCurrentTotalCostByIdTicket(idTicket: number) {
        const currentSpecialCost = await this.getCurrentSpecialCostByIdTicket(idTicket);
        let total = 0;
        for (const sc of currentSpecialCost) {
            total += sc.value;
        }
        return total;
    }

    async getCurrentSpecialCostByIdTicket(idTicket: number) {
        const all = (await this.getAll()).filter(a => a.id_ticket === idTicket);
        all.forEach(a => a.created = new Date(a.created));
        const maxDateTime = Math.max(...all.map(a => a.created.getTime()));
        return all.filter(a => a.created.getTime() === maxDateTime);
    }
    async saveSpecialCostByIdTicket(idTicket: number, value: number, category: string) {
        const ticket = await ticketService.getTicketFicheById(idTicket);
        if (ticket && ticket.items.length > 0) {
            const dividedValue = value / ticket.items.length;
            const created = new Date();
            for (const item of ticket.items) {
                const tempSpecialCost: Partial<INSpecialCost> = {
                    value: dividedValue,
                    id_ticket: idTicket,
                    id_item: item.id,
                    item_type: item.type?.toLowerCase(),
                    category: category,
                    created: created
                }
                await this.create(tempSpecialCost);
            }
        }

    }
     async getGlpiCost(): Promise<INCost[]> {
        return await this.get(`${this.endpoint}/glpi-cost`);
    }
    async getOpenCost(): Promise<INCost[]> {
        return await this.get(`${this.endpoint}/open-cost`);
    }
    async getSuperCost(): Promise<INCost[]> {
        return await this.get(`${this.endpoint}/super-cost`);
    }

    async modify(data: Partial<INSpecialCost>) {
        return await this.patch(`${this.endpoint}/${data.id}`, data, false);
    }

    async getAll(): Promise<INSpecialCost[]> {
        return await this.get<INSpecialCost[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<INSpecialCost>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<INSpecialCost>) {
        return await this.post(this.endpoint, data, false);
    }

    async update(id: number, data: Partial<INSpecialCost>) {
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

export const specialCostService = new SpecialCostService();
