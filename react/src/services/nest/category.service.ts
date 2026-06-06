import type INCategory from "../../types/nest/category";
import { nestApiClient } from "../../utils/api";
import { MethodeService } from "../methode.service";

class CategoryService extends MethodeService {
    private endpoint = "categories";

    constructor() {
        super()
        this.defaultApiClient = nestApiClient;
    }

    async getAll(): Promise<INCategory[]> {
        return await this.get<INCategory[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<INCategory>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<INCategory>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<INCategory>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge(ids: number[]) {
        return await this.reset(this.endpoint, ids);
    }
}

export const categoryService = new CategoryService();
