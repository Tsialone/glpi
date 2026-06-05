export interface ITicketTaskLink {
  rel: string;
  href: string;
}

export interface ITicketTask {
  id: number;
  uuid: string;
  tickets_id: number;
  taskcategories_id: number;
  date: string;
  users_id: number;
  users_id_editor: number;
  content: string;
  is_private: number;
  actiontime: number;
  begin: string | null;
  end: string | null;
  state: number;
  users_id_tech: number;
  groups_id_tech: number;
  date_mod: string;
  date_creation: string;
  tasktemplates_id: number;
  timeline_position: number;
  sourceitems_id: number;
  sourceof_items_id: number;
  links: ITicketTaskLink[];
}
