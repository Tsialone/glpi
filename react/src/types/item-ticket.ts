export interface IItemTicketLink {
  rel: string;
  href: string;
}

export interface IItemTicket {
  id: number;
  itemtype: string;
  items_id: number;
  tickets_id: number;
  links: IItemTicketLink[];
}
