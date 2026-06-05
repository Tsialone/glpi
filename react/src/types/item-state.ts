export interface IItemStateLink {
  rel: string;
  href: string;
}

export interface IItemState {
  id: number;
  name: string;
  entities_id: number;
  is_recursive: number;
  comment: string;
  states_id: number;
  completename: string;
  level: number;
  ancestors_cache: string | null;
  sons_cache: string | null;
  is_helpdesk_visible: number;
  date_mod: string;
  date_creation: string;
  links: IItemStateLink[];
}
