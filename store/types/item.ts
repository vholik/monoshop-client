import { Brand } from "./brand";
import { Gender } from "./gender.enum";
import { Size } from "./size";
import { User } from "./user";
import { Colour } from "./colour";
import { Category } from "./category";

export interface Item {
  id: number;
  user: User;
  style: string;
  images: string[];
  price: number;
  size: Size;
  category: Category;
  brand: Brand;
  colour: Colour;
  condition: number;
  gender: Gender;
}
