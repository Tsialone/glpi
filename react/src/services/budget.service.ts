import type { IBudget } from "../types/budget";
import { MethodeService } from "./methode.service";

class BudgetService extends MethodeService {
    private endpoint = "Budget";

    async getAll() {
        return await this.get<IBudget[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IBudget>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IBudget>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IBudget>) {
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

export const budgetService = new BudgetService();
