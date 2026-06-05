export interface IAssetLink {
    rel: string;
    href: string;
}

export interface IAsset {
    id: number;
    name: string | null;
}

export interface IComputer extends IAsset {
    entities_id: number;
    serial: string | null;
    otherserial: string | null;
    contact: string | null;
    contact_num: string | null;
    users_id_tech: number;
    comment: string | null;
    date_mod: string | null;
    autoupdatesystems_id: number;
    locations_id: number;
    networks_id: number;
    computermodels_id: number;
    computertypes_id: number;
    is_template: number;
    template_name: string | null;
    manufacturers_id: number;
    is_deleted: number;
    is_dynamic: number;
    users_id: number;
    states_id: number;
    ticket_tco: string | null;
    uuid: string | null;
    date_creation: string | null;
    is_recursive: number;
    last_inventory_update: string | null;
    last_boot: string | null;
    links: IAssetLink[];
}