import { MethodeService } from "./methode.service";
import type { IAsset, IComputer } from "../types/assets";
import type { IAssetImport } from "../types/import/assets-import";
import { userService } from "./user.service";
import { itemModelService } from "./item-model.service";
import { itemStateService } from "./item-state.service";
import { locationService } from "./location.service";
import { manufacturerService } from "./manufacturer.service";
import { ITEM_TYPE } from "../utils";
import { documentService } from "./document.service";
import type { IDocumentItem } from "../types/document-item";
import { documentItemService } from "./document-item.service";


class AssetsService extends MethodeService {
    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const [users, itemModels, states, locations, manufacturers, documents] = await Promise.all([
            userService.getAll(),
            itemModelService.getAll(),
            itemStateService.getAll(),
            locationService.getAll(),
            manufacturerService.getAll(),
            documentService.getAll()
        ]);
        for (const assetImport of assetImports) {
            const idState = states.find(s => s.name === assetImport.status)?.id ?? 0;
            const idLocation = locations.find(l => l.name === assetImport.location)?.id ?? 0;
            const idManufacturer = manufacturers.find(m => m.name === assetImport.manufacturer)?.id ?? 0;
            const idUser = users.find(u => u.name === assetImport.user)?.id ?? 0;
            const idModel = itemModels.find(im => im.name === assetImport.model)?.id ?? 0;
            const idDocument = documents.find(d => {
                const name = d.name.split(".")[0];
                return name === assetImport.name;
            })?.id ?? null;

            // if (!idState) throw new Error("Pas de status");
            // if (!idLocation) throw new Error("Pas de locations");
            // if (!idManufacturer) throw new Error("Pas de manufacturer");
            // if (!idModel) throw new Error("Pas de Model");

            const itemType = assetImport.item_type;


            console.log("creation de " + itemType + " Name: ", assetImport.name, " IdDocument: ", idDocument);
            const tempAsset: Partial<IAsset | any> = {
                states_id: idState,
                name: assetImport.name,
                locations_id: idLocation,
                manufacturers_id: idManufacturer,
                otherserial: assetImport.inventory_number,
                users_id: idUser,
            }
            const modelItemKey = `${itemType.toLowerCase()}models_id`;
            tempAsset[modelItemKey] = idModel;
            const resp = await this.create(itemType, tempAsset);
            if (idDocument && resp?.id) {
                const documentItem: Partial<IDocumentItem> = {
                    itemtype: `${itemType}`,
                    items_id: resp.id,
                    documents_id: idDocument
                }
                await documentItemService.create(documentItem);
            }
        }


    }
    async getItempTypeById<T extends IAsset = IAsset>(idItem: number): Promise<string | null> {
        for (const itemType of ITEM_TYPE) {
            const items = await this.get<T[]>(itemType);
            const item = items.find(i => i.id === idItem);
            if (item) return itemType;
        }
        return null;
    }
    async getAll<T extends IAsset = IAsset>(itemType?: string): Promise<T[]> {
        if (itemType) {
            return await this.get<T[]>(itemType);
        }
        else {
            const assetPromises = ITEM_TYPE.map(it => {
                return this.get<T[]>(it);
            });
            const resp = (await Promise.all(assetPromises)).flat();
            return resp;

        }
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
        return await this.del(itemType, id);
    }

    async purge(itemType?: string) {
        if (itemType) {
            const ids = (await this.getAll(itemType)).map(a => a.id);
            await this.reset(itemType, ids);
        }
        else {
            ITEM_TYPE.map(async it => {
                const ids = (await this.getAll(it)).map(a => a.id);
                await this.reset(it, ids);
            });
        }
    }
}

export const assetsService = new AssetsService();
