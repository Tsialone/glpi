import type { IUser } from "./auth/user";
import type { IItemModel } from "./item-model";
import type { IItemState } from "./item-state";
import type { ILocation } from "./location";
import type { IManufacturer } from "./manufacturer";

export interface IAssetLink {
    rel: string;
    href: string;
}

export interface IAsset {
    id: number;
    name: string | null;
    users_id: number;
    locations_id: number;
    states_id: number;
    manufacturers_id: number;
    is_deleted: number;
    is_recursive: number;
    date_creation: string | null;
    entities_id: number;
    serial: string | null;
    users_id_tech: number;
    date_mod: string | null;
    is_template: number;
    is_dynamic: number;
    uuid: string | null;
    comment: string | null;
    otherserial: string | null;

    type?:string;
}

export interface IComputer extends IAsset {
    contact: string | null;
    contact_num: string | null;
    autoupdatesystems_id: number;
    networks_id: number;
    computermodels_id: number;
    computertypes_id: number;
    template_name: string | null;
    ticket_tco: string | null;
    last_inventory_update: string | null;
    last_boot: string | null;
    links: IAssetLink[];
}

export interface IAssetFiche extends IAsset {
    user:IUser | null,
    manufacturer:IManufacturer | null,
    item_type:string,
    location:ILocation | null,
    item_model:IItemModel | null,
    item_state:IItemState | null
    image:string
}

export interface IAssetFicheFilter {
    name:string,
    status_name:string,
    user_name:string,
    manufacturer_name:string,
    localistaion_name:string,
    item_type:string,
    model_name:string,
}

// export interface IDashBoardTotalParc {
//     Computer: number;
//     Monitor: number;
//     NetworkEquipment: number;
//     Peripheral: number;
//     Printer: number;
//     Phone: number;
//     Rack: number;
//     Enclosure: number;
//     PDU: number;
//     PassiveDCEquipment: number;
//     Software: number;
//     CartridgeItem: number;
//     ConsumableItem: number;
//     Item_DeviceSimcard: number;
//     Cable: number;
// }