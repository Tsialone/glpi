import { MethodeService } from "./methode.service";
import type { IAsset } from "../types/assets";

class AssetsService extends MethodeService {
    async getAll<T extends IAsset = IAsset>(itemType: string) {
        return await this.get<T[]>(itemType);
    }

    async getById<T extends IAsset = IAsset>(itemType: string, id: number) {
        return await this.get<T>(`${itemType}/${id}`);
    }

    async create<T extends IAsset = IAsset>(itemType: string, data: Partial<T>) {
        return await this.post(itemType, data);
    }

    async update<T extends IAsset = IAsset>(itemType: string, id: number, data: Partial<T>) {
        return await this.put(`${itemType}/${id}`, { id, ...data });
    }

    async delete(itemType: string, id: number) {
        return await this.del(itemType, id, false);
    }

    async purge(itemType: string) {
        const ids = (await this.getAll(itemType)).map(a => a.id);
        return await this.reset(itemType, ids);
    }
}

export const assetsService = new AssetsService();
