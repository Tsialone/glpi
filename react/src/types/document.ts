export interface IDocumentLink {
  rel: string;
  href: string;
}

export interface IDocument {
  id: number;
  entities_id: number;
  is_recursive: number;
  name: string;
  filename: string;
  filepath: string;
  documentcategories_id: number;
  mime: string;
  date_mod: string;
  comment: string | null;
  is_deleted: number;
  link: string | null;
  users_id: number;
  tickets_id: number;
  sha1sum: string;
  is_blacklisted: number;
  tag: string;
  date_creation: string;
  links: IDocumentLink[];
}
