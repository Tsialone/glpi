export interface IITILSolutionLink {
  rel: string;
  href: string;
}

export interface IITILSolution {
  id: number;
  itemtype: string;
  items_id: number;
  solutiontypes_id: number;
  solutiontype_name: string | null;
  content: string;
  date_creation: string;
  date_mod: string;
  date_approval: string;
  users_id: number;
  user_name: string | null;
  users_id_editor: number;
  users_id_approval: number;
  user_name_approval: string | null;
  status: number;
  itilfollowups_id: number | null;
  links: IITILSolutionLink[];
}
