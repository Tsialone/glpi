import type { IAssetImport } from "../types/import/assets-import";
import type { IItemModel } from "../types/item-model";
import { ITEM_NO_MODEL, ITEM_TYPE } from "../utils";
import { MethodeService } from "./methode.service";

class ItemModelService extends MethodeService {

    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const modelNames = [...new Set(assetImports.filter(ai => ai.model).map(ai => ai.model.trim()))];
        const mapItemModel: Record<string, string | undefined> = {
        };
        modelNames.map(n => {
            mapItemModel[n] = assetImports.find(ai => ai.model === n)?.item_type;
        })
        console.log(mapItemModel);

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
    async getAll<T extends IItemModel = IItemModel>(itemType?: string): Promise<T[]> {
        if (itemType) {
            if (!ITEM_NO_MODEL.includes(itemType)) {
                return await this.get<T[]>(`${itemType}Model`);
            }
            return [];
        } else {
            const promises = ITEM_TYPE.map(it => {
                if (!ITEM_NO_MODEL.includes(it)) {
                    return this.get<T[]>(`${it}Model`)
                }
                return [];
            });
            const results = await Promise.all(promises);
            return results.flat();
        }
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
        return await this.del(`${itemType}Model`, id);
    }

    async purge(itemType?: string) {
        if (itemType) {
            if (!ITEM_NO_MODEL.includes(itemType)) {
                const ids = (await this.getAll(itemType)).map(o => o.id);
                return await this.reset(`${itemType}Model`, ids);
            }
        }
        else {
            ITEM_TYPE.map(async it => {
                if (!ITEM_NO_MODEL.includes(it)) {
                    const ids = (await this.getAll(it)).map(o => o.id);
                    return await this.reset(`${it}Model`, ids);
                }

            })
        }

    }
}

export const itemModelService = new ItemModelService();
