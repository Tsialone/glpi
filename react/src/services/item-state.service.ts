import type { IAssetImport } from "../types/import/assets-import";
import type { IItemState } from "../types/item-state";
import { MethodeService } from "./methode.service";

class ItemStateService extends MethodeService {
    private endpoint = "State";

    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const statusNames = [...new Set(assetImports.map(ai => ai.status.trim()))];
        for (const statusName of statusNames) {
            const status: Partial<IItemState> = {
                name: statusName,
                completename: statusName
            }
            await this.create(status);
        }
    }

    async getAll() {
        return await this.get<IItemState[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IItemState>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IItemState>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IItemState>) {
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

export const itemStateService = new ItemStateService();
