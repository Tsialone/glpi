export interface ITicketTicketLink {
  rel: string;
  href: string;
}

export interface ITicketTicket {
  id: number;
  tickets_id_1: number;
  tickets_id_2: number;
  link: number;
  links: ITicketTicketLink[];
}
