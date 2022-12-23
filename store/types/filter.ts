import { FilterBy } from "./filter-by.enum";
import { Gender } from "./gender.enum";
import { Item } from "./item";

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
  page: number;
}

export interface IFileringData {
  data: Item[];
  meta: {
    total: number;
  };
}
