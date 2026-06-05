import type { IAssetImport } from "../types/import/assets-import";
import type { IItemModel } from "../types/item-model";
import { MethodeService } from "./methode.service";

class ItemModelService extends MethodeService {

    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const modelNames = [...new Set(assetImports.map(ai => ai.model.trim()))];
        const mapItemModel: Record<string, string | undefined> = {
        };
        modelNames.map(n => {
            mapItemModel[n] = assetImports.find(ai => ai.model === n)?.item_type;
        })
        console.log (mapItemModel);

        for (const modelName of modelNames) {
            const model: Partial<IItemModel> = {
                name: modelName,
            }
            const itemType = mapItemModel[modelName];
            if (!itemType) {
                throw new Error(`Model pas de types: ${modelName}`);
            }
            await this.create(itemType, model);
        }
    }
    async getAll<T extends IItemModel = IItemModel>(itemType: string) {
        return await this.get<T[]>(`${itemType}Model`);
    }

    async getById<T extends IItemModel = IItemModel>(itemType: string, id: number) {
        return await this.get<T>(`${itemType}Model/${id}`);
    }

    async create<T extends IItemModel = IItemModel>(itemType: string, data: Partial<T>) {
        return await this.post(`${itemType}Model`, data);
    }

    async update<T extends IItemModel = IItemModel>(itemType: string, id: number, data: Partial<T>) {
        return await this.put(`${itemType}Model/${id}`, { id, ...data });
    }

    async delete(itemType: string, id: number) {
        return await this.del(`${itemType}Model`, id, false);
    }

    async purge(itemType: string) {
        const ids = (await this.getAll(itemType)).map(o => o.id);
        return await this.reset(`${itemType}Model`, ids);
    }
}

export const itemModelService = new ItemModelService();
