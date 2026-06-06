import type { IGroupe } from "../types/groupe";
import { MethodeService } from "./methode.service";

class GroupeService extends MethodeService {
    private endpoint = "Group";

    async getAll() {
        return await this.get<IGroupe[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IGroupe>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IGroupe>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IGroupe>) {
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

export const groupeService = new GroupeService();
