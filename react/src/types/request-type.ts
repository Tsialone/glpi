export interface IRequestType {
  id: number;
  name: string;
  is_helpdesk_default: number;
  is_followup_default: number;
  is_mail_default: number;
  is_mailfollowup_default: number;
  is_active: number;
  is_ticketheader: number;
  is_itilfollowup: number;
  comment: string | null;
  date_mod: string | null;
  date_creation: string | null;
}
