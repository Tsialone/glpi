export interface IGroupeLink {
  rel: string;
  href: string;
}

export interface IGroupe {
  id: number;
  entities_id: number;
  is_recursive: number;
  name: string;
  code: string;
  comment: string;
  ldap_field: string | null;
  ldap_value: string | null;
  ldap_group_dn: string | null;
  date_mod: string;
  groups_id: number;
  completename: string;
  level: number;
  ancestors_cache: any | null;
  sons_cache: any | null;
  is_requester: number;
  is_watcher: number;
  is_assign: number;
  is_task: number;
  is_notify: number;
  is_itemgroup: number;
  is_usergroup: number;
  is_manager: number;
  date_creation: string;
  recursive_membership: number;
  "2fa_enforced": number;
  links: IGroupeLink[];
}
