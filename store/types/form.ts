import { MultiValue } from "react-select";
import { Gender } from "./gender.enum";
import { ItemEntity, ItemEntityWithId } from "./item-entity";
import { Size } from "./size.enum";

export interface ISellForm {
  style: string;
  images: string[];
  hashtags: string;
  gender: Gender;
  price: number;
  size: Size;
  categoryId: number;
  subcategoryId: number;
  brand: number[];
  colour: string;
  condition: number;
  description: string;
  name: string;
}
