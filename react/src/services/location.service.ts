import type { IAssetImport } from "../types/import/assets-import";
import type { ILocation } from "../types/location";
import { MethodeService } from "./methode.service";

class LocationService extends MethodeService {
    private endpoint = "Location";

    createByIAssetImport = async (assetImports: IAssetImport[]): Promise<void> => {
        const locationNames = [...new Set(assetImports.map(ai => ai.location.trim()))];
        for (const locationName of locationNames) {
            const location: Partial<ILocation> = {
                name: locationName,
                completename: locationName
            }
            await this.create(location)
        }
    }

    async getAll() {
        return await this.get<ILocation[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<ILocation>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<ILocation>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<ILocation>) {
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

export const locationService = new LocationService();
