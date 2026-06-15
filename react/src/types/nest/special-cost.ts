export interface INSpecialCost {
    id: number;
    id_ticket: number;
    item_type: string;
    id_item: number;
    category: string;
    created: Date;
    value: number;
}
export interface INCost {
    item_type: string;
    cost: number;
}