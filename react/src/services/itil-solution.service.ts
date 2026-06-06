import type { IITILSolution } from "../types/itil-solution";
import { MethodeService } from "./methode.service";

class ITILSolutionService extends MethodeService {
    private endpoint = "ITILSolution";

    async getAll() {
        return await this.get<IITILSolution[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IITILSolution>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IITILSolution>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IITILSolution>) {
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

export const itilSolutionService = new ITILSolutionService();
