import type { IAssetImport } from "../types/import/assets-import";
import type { IItemState } from "../types/item-state";
import { MethodeService } from "./methode.service";

class ItemStateService extends MethodeService {
    private endpoint = "State";

    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const statusNames = [...new Set(assetImports.filter(ai => ai.status).map(ai => ai.status.trim()))];
        for (const statusName of statusNames) {
            const status: Partial<IItemState | any> = {
                name: statusName,
                completename: statusName,

                // rendre visible pour tout le monde
                "is_visible_computer": 1,
                "is_visible_monitor": 1,
                "is_visible_networkequipment": 1,
                "is_visible_peripheral": 1,
                "is_visible_phone": 1,
                "is_visible_printer": 1,
                "is_visible_softwareversion": 1,
                "is_visible_rack": 1,
                "is_visible_enclosure": 1,
                "is_visible_pdu": 1,
                "is_visible_passivedcequipment": 1,
                "is_visible_cable": 1,
                "is_visible_simcard": 1,
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
        return await this.del(this.endpoint, id);
    }

    async purge() {
        const ids = (await this.getAll()).map(o => o.id);
        return await this.reset(this.endpoint, ids);
    }
}

export const itemStateService = new ItemStateService();
