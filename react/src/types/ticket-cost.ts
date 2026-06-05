export interface ITicketCostLink {
  rel: string;
  href: string;
}

export interface ITicketCost {
  id: number;
  tickets_id: number;
  name: string;
  comment: string;
  begin_date: string;
  end_date: string;
  actiontime: number;
  cost_time: string;
  cost_fixed: string;
  cost_material: string;
  budgets_id: number;
  entities_id: number;
  links: ITicketCostLink[];
}
