import type { INStatusLang } from "../../types/nest/status-lang";
import { nestApiClient } from "../../utils/api";
import { MethodeService } from "../methode.service";

class StatusLangService extends MethodeService {
    private endpoint = "status-lang";

    constructor() {
        super()
        this.defaultApiClient = nestApiClient;
    }

    async modify(data: Partial<INStatusLang>) {
        return await this.patch(`${this.endpoint}/${data.id}`, data, false);
    }

    async getAll(): Promise<INStatusLang[]> {
        return await this.get<INStatusLang[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<INStatusLang>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<INStatusLang>) {
        return await this.post(this.endpoint, data , false);
    }

    async update(id: number, data: Partial<INStatusLang>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge(ids: number[]) {
        return await this.reset(this.endpoint, ids);
    }
}

export const statusLangService = new StatusLangService();
