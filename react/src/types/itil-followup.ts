export interface IITILFollowupLink {
  rel: string;
  href: string;
}

export interface IITILFollowup {
  id: number;
  itemtype: string;
  items_id: number;
  date: string;
  users_id: number;
  users_id_editor: number;
  content: string;
  is_private: number;
  requesttypes_id: number;
  date_mod: string;
  date_creation: string;
  timeline_position: number;
  sourceitems_id: number;
  sourceof_items_id: number;
  links: IITILFollowupLink[];
}
