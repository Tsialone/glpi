import { MethodeService } from "./methode.service";
import type { IAsset, IAssetFiche, IAssetFicheFilter } from "../types/assets";
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
import { itemTicketService } from "./item-ticket.service";
import type { IDocument } from "../types/document";
import { ticketService } from "./ticket.service";
import { specialCostService } from "./nest/special-cost.service";

export interface Super {
    itemType: string,
    glpiCost: number,
    superCost: number,
    openCost: number,
    total: number
}
class AssetsService extends MethodeService {

    async getGlpiCostByType(type: string) {
        let total = 0;
        const histTickets = await ticketService.getByItemType(type);
        for (const histTicket of histTickets) {
            total += await ticketService.getGlpiCostById(histTicket.id);
        }
        return total;
    }

    async getTable() {
        const resp: Super[] = [];
        const superCosts = await specialCostService.getSuperCost();
        const openCosts = await specialCostService.getOpenCost();
        const glpiCosts = await specialCostService.getGlpiCost ();

        console.log (superCosts);
        for (const type of ITEM_TYPE) {
            const superCost = superCosts.find (sc => sc.item_type.toLowerCase ( ) ===  type.toLowerCase () )?.cost ?? 0;
            const openCost = openCosts.find (sc => sc.item_type.toLowerCase ( ) ===  type.toLowerCase () )?.cost ?? 0;
            const glpiCost = glpiCosts.find (sc => sc.item_type.toLowerCase ( ) ===  type.toLowerCase () )?.cost ?? 0;

            // const [glpiCost] = await Promise.all([
            //     this.getGlpiCostByType(type),
            // ]);

            // resp.push({ itemType: element, totalCost: totalCost, superCost: superCost, total: superCostGeneral, openCost: openCost })
            const total = glpiCost + superCost + openCost;

            // for (const ticket of hisTickets) {
            // const temp = await ticketService.getTotalCostById(ticket.id);
            // superCost += await superCostService.getTotalByIdTicket(ticket.id);
            // }
            // console.log("hisTickets: ", hisTickets, "itemType: ", element, " totalCost:", totalCost, " superCost: ", superCostGeneral);
            resp.push({ itemType: type, glpiCost: glpiCost, superCost: superCost, openCost: openCost, total: total })
        }
        return resp;
    }

    async getAllFiche<T extends IAssetFiche = IAssetFiche>(assetFicheFilter?: Partial<IAssetFicheFilter>, itemType?: string): Promise<T[]> {
        let assetFiches: T[] = [];
        const [users, manufacturers, locations, itemStates, itemModels] = await Promise.all([
            userService.getAll(),
            manufacturerService.getAll(),
            locationService.getAll(),
            itemStateService.getAll(),
            itemModelService.getAll()

        ])
        if (itemType) {
            assetFiches = await this.getAll(itemType);
        }
        else {
            // const tempAssets =
            // const resp = (await Promise.all(assetPromises)).flat();
            assetFiches = await this.getAll();
        }
        // console.log (assetFiches);
        for (const assetFiche of assetFiches) {
            console.log(assetFiche.type);
            const ficheItemType = assetFiche.type;
            const modelKey = `${ficheItemType?.toLowerCase()}models_id`;
            const tempAssetFiche = { ...assetFiche } as any;
            const idModel = tempAssetFiche[modelKey] ?? null;
            const itemModel = ficheItemType ? itemModels.find(im => {
                if (idModel) {
                    return im.id === idModel;
                }
                return false;
            }) ?? null : null;
            // const ficheItemType = "test";

            const user = users.find(u => u.id === assetFiche.users_id) ?? null;
            const manufacturer = manufacturers.find(m => m.id === assetFiche.manufacturers_id) ?? null;
            const location = locations.find(l => l.id === assetFiche.locations_id) ?? null;
            const itemState = itemStates.find(is => is.id === assetFiche.states_id) ?? null;
            const documents = await documentService.getByIdItem(assetFiche.id);
            const idDocumentFirst = documents.length > 0 ? documents[0].id : null;
            const image = idDocumentFirst ? await documentService.getImageById(idDocumentFirst) : null;
            if (ficheItemType) {
                assetFiche.item_type = ficheItemType;
            }
            if (image) {
                assetFiche.image = URL.createObjectURL(image);
            }
            assetFiche.item_model = itemModel;
            assetFiche.item_state = itemState;
            assetFiche.user = user;
            assetFiche.manufacturer = manufacturer;
            assetFiche.location = location;
        }
        if (assetFicheFilter) {
            assetFiches = (assetFicheFilter.user_name ? assetFiches.filter(a => a.user?.name?.includes(assetFicheFilter.user_name ?? '')) : assetFiches);
            assetFiches = (assetFicheFilter.name ? assetFiches.filter(a => a.name?.includes(assetFicheFilter.name ?? '')) : assetFiches);
            assetFiches = assetFicheFilter.item_type ? assetFiches.filter(a => a.item_type.includes(assetFicheFilter.item_type ?? '')) : assetFiches;
            // assetFiches = assetFicheFilter.manufacturer_name ? assetFiches.filter(a => a.manufacturer?.name === assetFicheFilter.man ufacturer_name) : assetFiches;

            //  assetFiches = assetFicheFilter.model_name ?  assetFiches.filter (a => a.item_model?.name ===  assetFicheFilter.model_name) : assetFiches;
            // assetFiches = assetFicheFilter.status_name ? assetFiches.filter(a => a.item_state?.name === assetFicheFilter.status_name) : assetFiches;
            // assetFiches = assetFicheFilter.localistaion_name ? assetFiches.filter(a => a.location?.name === assetFicheFilter.localistaion_name) : assetFiches;
        }
        return assetFiches;
    }

    async getDocumentsById(id: number): Promise<IDocument[]> {
        return await documentService.getByIdItem(id);
    }

    async getByIdTicket(idTicket: number): Promise<IAsset[]> {
        const itemTickets = await itemTicketService.getByIdTicket(idTicket);
        // console.log ("xxx: " , itemTickets);
        const resp: IAsset[] = [];
        const assets = await this.getAll();
        for (const itemTicket of itemTickets) {
            const asset = assets.find(a => a.id === itemTicket.items_id) ?? null;
            if (asset) {
                resp.push(asset);
            }
        }
        // console.log ("resp: " , resp);
        return resp;
    }
    async getDashBoardTotalParc(): Promise<Record<string, number>> {
        const resp: Record<string, number> = {};
        for (const itemType of ITEM_TYPE) {
            const assets = await this.getAll(itemType);
            resp[itemType] = assets.length;
        }
        return resp;
    }
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
            if (itemType.toLowerCase() === "dcroom") {
                tempAsset["vis_rows"] = 1;
                tempAsset["vis_cols"] = 1;
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
    async getItemTypeById<T extends IAsset = IAsset>(idItem: number): Promise<string | null> {
        for (const itemType of ITEM_TYPE) {
            const items = await this.get<T[]>(itemType);
            const item = items.some(i => i.id === idItem);
            if (item) {
                return itemType
            };
        }
        return null;
    }
    // async getItemTypeById<T extends IAsset = IAsset>(idItem: number): Promise<string | null> {

    //     if (!localStorage.getItem(UTIL_CONST.item_type)) {
    //         localStorage.setItem(UTIL_CONST.item_type, JSON.stringify({}));
    //     }
    //     const storage = localStorage.getItem(UTIL_CONST.item_type)!;
    //     const map = JSON.parse(storage);
    //     if (map[idItem]) {
    //         console.log("recherche dans map");
    //         return map[idItem];
    //     }
    //     else {
    //         console.log("recherche dans ailleurs");

    //         for (const itemType of ITEM_TYPE) {
    //             const items = await this.get<T[]>(itemType);
    //             const item = items.some(i => i.id === idItem);
    //             if (item) {
    //                 map[idItem] = itemType;
    //                 localStorage.setItem(UTIL_CONST.item_type, JSON.stringify(map));
    //                 return itemType
    //             };
    //         }
    //     }
    //     return null;
    // }
    async getAll<T extends IAsset = IAsset>(itemType?: string): Promise<T[]> {
        if (itemType) {
            const resp = await this.get<T[]>(itemType);
            resp.forEach(r => r.type = itemType);
            return resp;
        } else {
            const assetPromises = ITEM_TYPE.map(async (it) => {
                const items = await this.get<T[]>(it);
                items.forEach(t => t.type = it);
                return items; // On retourne explicitement le tableau modifié
            });

            const resp = await Promise.all(assetPromises);
            return resp.flat();
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
