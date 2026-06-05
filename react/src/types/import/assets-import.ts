export interface IAssetImport {
    name : string ,
    status: string,
    location:string,
    manufacturer:string,
    item_type:string ,
    model:string,
    inventory_number:string,
    user:string | null // name of the user 
}