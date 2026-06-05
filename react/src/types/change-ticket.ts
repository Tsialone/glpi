export interface IChangeTicketLink {
  rel: string;
  href: string;
}

export interface IChangeTicket {
  id: number;
  changes_id: number;
  tickets_id: number;
  link: number;
  links: IChangeTicketLink[];
}
