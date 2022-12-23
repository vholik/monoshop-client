import { Item } from "./item";

export interface User {
  email: string;
  fullName: string;
  items?: Item[];
  location?: string;
  phone?: string;
  image: string;
  id: string;
  favorites?: Item[];
}

export interface IProfileFormData {
  image?: string;
  fullName?: string;
  phone?: string;
  location?: string;
}
