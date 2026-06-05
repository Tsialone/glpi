import type { IAssetImport } from "../types/import/assets-import";
import type { IManufacturer } from "../types/manufacturer";
import { MethodeService } from "./methode.service";

class ManufacturerService extends MethodeService {
    private endpoint = "Manufacturer";

    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const manufacturerNames = [...new Set(assetImports.map(ai => ai.manufacturer.trim()))];
        for (const manufacturerName of manufacturerNames) {
            const manufacturer: Partial<IManufacturer> = {
                name: manufacturerName,
            }
            await this.create(manufacturer);
        }
    }
    async getAll() {
        return await this.get<IManufacturer[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IManufacturer>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IManufacturer>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IManufacturer>) {
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

export const manufacturerService = new ManufacturerService();
