import type { IDocumentItem } from "../types/document-item";
import { MethodeService } from "./methode.service";

class DocumentItemService extends MethodeService {
    private endpoint = "Document_Item";

    
    async getByIdItem(idItem: number): Promise<IDocumentItem[]> {
        return (await this.getAll()).filter(di => di.items_id === idItem);
    }
    async getAll() {
        return await this.get<IDocumentItem[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IDocumentItem>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IDocumentItem>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IDocumentItem>) {
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

export const documentItemService = new DocumentItemService();
