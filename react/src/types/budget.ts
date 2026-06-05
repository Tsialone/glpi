export interface IBudgetLink {
  rel: string;
  href: string;
}

export interface IBudget {
  id: number;
  name: string;
  entities_id: number;
  is_recursive: number;
  comment: string;
  is_deleted: number;
  begin_date: string;
  end_date: string | null;
  value: string;
  is_template: number;
  template_name: string | null;
  date_mod: string;
  date_creation: string;
  locations_id: number;
  budgettypes_id: number;
  links: IBudgetLink[];
}
