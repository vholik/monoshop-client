import { Item } from "./item";

export interface User {
  email: string;
  fullName: string;
  items?: Item[];
  location?: string;
  phone?: string;
  image?: string;
  favorites?: Item[];
}
