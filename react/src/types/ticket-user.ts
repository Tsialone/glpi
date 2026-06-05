export interface ITicketUserLink {
  rel: string;
  href: string;
}

export interface ITicketUser {
  id: number;
  tickets_id: number;
  users_id: number;
  type: number;
  use_notification: number;
  alternative_email: string;
  links: ITicketUserLink[];
}
