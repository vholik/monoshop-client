import { Item } from "./item";

export interface User {
  email: string;
  fullName: string;
  items?: Item[];
  location?: string;
  phone?: string;
  image: string;
  id: number;
  favorites?: Item[];
  lastActivity: string;
}

export interface IProfileFormData {
  image?: string;
  fullName?: string;
  phone?: string;
  location?: string;
}
