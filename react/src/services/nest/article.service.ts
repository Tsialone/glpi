import type { INArticle } from "../../types/nest/article";
import { nestApiClient } from "../../utils/api";
import { MethodeService } from "../methode.service";

class ArticleService extends MethodeService {
    private endpoint = "articles";

    constructor() {
        super()
        this.defaultApiClient = nestApiClient;
    }

    async getAll(): Promise<INArticle[]> {
        return await this.get<INArticle[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<INArticle>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<INArticle>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<INArticle>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge(ids: number[]) {
        return await this.reset(this.endpoint, ids);
    }
}

export const articleService = new ArticleService();
