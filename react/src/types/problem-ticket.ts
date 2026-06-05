export interface IProblemTicketLink {
  rel: string;
  href: string;
}

export interface IProblemTicket {
  id: number;
  problems_id: number;
  tickets_id: number;
  link: number;
  links: IProblemTicketLink[];
}
