export interface ITicketImport {
    ref_ticket: string,
    date: string // dd/mm/yyyy
    heure: string // HH:mm
    type:string,
    titre: string,
    description: string,
    status: string,
    priority: string,
    items: string 
    items_array : string [] // list of itemType is name must be unique
}