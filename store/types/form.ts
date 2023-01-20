import { MultiValue } from "react-select";
import { Gender } from "./gender.enum";
import { ItemEntity, ItemEntityWithId } from "./item-entity";

export interface ISellForm {
  category: ItemEntityWithId | null;
  condition: ItemEntity | null;
  style: ItemEntity | null;
  brand: MultiValue<ItemEntityWithId> | null;
  colour: ItemEntity | null;
  size: ItemEntity | null;
  price: number;
  gender: Gender;
  description: string;
  hashtags: string[];
  name: string;
  subcategory: string;
}
