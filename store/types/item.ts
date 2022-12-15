import { Gender } from "./gender.enum";
import { ItemEntity } from "./item-entity";
import { User } from "./user";

export interface Item {
  id: number;
  user: User;
  style: string;
  images: string[];
  price: number;
  size: ItemEntity;
  category: ItemEntity;
  brand: ItemEntity;
  colour: ItemEntity;
  condition: number;
  gender: Gender;
}

export interface IAddItemFormData {
  categoryId: number;
  condition: number;
  style: string;
  brand: string;
  colour: string;
  size: string;
  price: number;
  gender: string;
  images: string[];
}
