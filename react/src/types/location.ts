export interface ILocationLink {
  rel: string;
  href: string;
}

export interface ILocation {
  id: number;
  entities_id: number;
  is_recursive: number;
  name: string;
  code: string;
  alias: string;
  locations_id: number;
  completename: string;
  comment: string;
  level: number;
  ancestors_cache: string | null;
  sons_cache: string | null;
  address: string;
  postcode: string;
  town: string;
  state: string;
  country: string;
  building: string;
  room: string;
  latitude: string;
  longitude: string;
  altitude: string;
  date_mod: string;
  date_creation: string;
  links: ILocationLink[];
}
