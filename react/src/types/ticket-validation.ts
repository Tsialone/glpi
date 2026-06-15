export interface ITicketValidationLink {
    rel: string | null,
    href: string
}
export interface ITicketValidation {
    id: number;
    itils_validationsteps_id: number;
    entities_id: number;
    users_id: number;
    tickets_id: number;
    users_id_validate: number;
    itilvalidationtemplates_id: number;
    itemtype_target: string;
    items_id_target: number;
    comment_submission: string | null;
    comment_validation: string | null;
    status: number;
    submission_date: string | null;
    validation_date: string | null;
    timeline_position: number;
    last_reminder_date: string | null;
    links?: ITicketValidationLink[];

    //
    super_cost?:number;
}
