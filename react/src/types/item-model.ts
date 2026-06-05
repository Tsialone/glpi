export interface IItemModel {
  id: number;
  name: string;
  comment: string;
  product_number: string;
  weight: number;
  required_units: number;
  depth: number;
  power_connections: number;
  power_consumption: number;
  is_half_rack: number;
  picture_front: string | null;
  picture_rear: string | null;
  pictures: string | null;
  date_mod: string;
  date_creation: string;
}
