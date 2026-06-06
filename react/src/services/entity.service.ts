import type { IEntity } from "../types/entity";
import { MethodeService } from "./methode.service";

class EntityService extends MethodeService {
    private endpoint = "Entity";

    async getAll() {
        return await this.get<IEntity[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IEntity>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IEntity>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IEntity>) {
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

export const entityService = new EntityService();
