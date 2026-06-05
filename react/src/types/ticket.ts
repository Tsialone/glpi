export interface ITicketLink {
  rel: string;
  href: string;
}

export interface ITicket {
  id: number;
  entities_id: number;
  name: string;
  date: string;
  closedate: string | null;
  solvedate: string | null;
  takeintoaccountdate: string | null;
  date_mod: string;
  users_id_lastupdater: number;
  status: number;
  users_id_recipient: number;
  requesttypes_id: number;
  content: string;
  urgency: number;
  impact: number;
  priority: number;
  itilcategories_id: number;
  type: number;
  global_validation: number;
  slas_id_ttr: number;
  slas_id_tto: number;
  slalevels_id_ttr: number;
  time_to_resolve: string | null;
  time_to_own: string | null;
  begin_waiting_date: string | null;
  sla_waiting_duration: number;
  ola_waiting_duration: number;
  olas_id_tto: number;
  olas_id_ttr: number;
  olalevels_id_ttr: number;
  ola_tto_begin_date: string | null;
  ola_ttr_begin_date: string | null;
  internal_time_to_resolve: string | null;
  internal_time_to_own: string | null;
  waiting_duration: number;
  close_delay_stat: number;
  solve_delay_stat: number;
  takeintoaccount_delay_stat: number;
  actiontime: number;
  is_deleted: number;
  locations_id: number;
  date_creation: string;
  tickettemplates_id: number;
  externalid: string | null;
  links: ITicketLink[];
}
