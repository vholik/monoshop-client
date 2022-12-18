import { FilterBy } from "./filter-by.enum";
import { Gender } from "./gender.enum";

export interface IFilter {
  price: number[];
  gender: Gender | undefined;
  category: string[];
  size: string[];
  condition: number[];
  brand: string[];
  style: string[];
  colour: string[];
  sortBy: FilterBy;
}
