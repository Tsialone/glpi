import type { INStatusColor } from "../../types/nest/status-color";
import { nestApiClient } from "../../utils/api";
import { MethodeService } from "../methode.service";

class StatusColor extends MethodeService {
    private endpoint = "status-colors";

    constructor() {
        super()
        this.defaultApiClient = nestApiClient;
    }

    async modify(data: Partial<INStatusColor>) {
        return await this.patch(`${this.endpoint}/${data.id}`, data, false);
    }

    async getAll(): Promise<INStatusColor[]> {
        return await this.get<INStatusColor[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<INStatusColor>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<INStatusColor>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<INStatusColor>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge(ids: number[]) {
        return await this.reset(this.endpoint, ids);
    }
}

export const statusColorService = new StatusColor();
