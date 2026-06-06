export interface IDocumentItemLink {
  rel: string;
  href: string;
}

export interface IDocumentItem {
  id: number;
  documents_id: number;
  items_id: number;
  itemtype: string;
  entities_id: number;
  is_recursive: number;
  date_mod: string;
  users_id: number;
  timeline_position: number;
  date_creation: string;
  date: string | null;
  links: IDocumentItemLink[];
}
