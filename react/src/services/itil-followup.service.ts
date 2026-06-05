import type { IITILFollowup } from "../types/itil-followup";
import { MethodeService } from "./methode.service";

class ITILFollowupService extends MethodeService {
    private endpoint = "ITILFollowup";

    async getAll() {
        return await this.get<IITILFollowup[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IITILFollowup>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IITILFollowup>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IITILFollowup>) {
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

export const itilFollowupService = new ITILFollowupService();
