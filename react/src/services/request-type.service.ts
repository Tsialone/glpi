import type { IRequestType } from "../types/request-type";
import { MethodeService } from "./methode.service";

class RequestTypeService extends MethodeService {
    private endpoint = "RequestType";

    async getAll() {
        return await this.get<IRequestType[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IRequestType>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IRequestType>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IRequestType>) {
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

export const requestTypeService = new RequestTypeService();
