import { Item } from "./item";

export interface IOrder {
  id: String;
  city: String;
  country: String;
  line1: String;
  line2?: String;
  postalCode: String;
  state: String;
  customerId: String;
  fullName: String;
  phone: String;
  item: Item;
}
