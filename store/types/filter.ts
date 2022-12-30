import { SortBy } from "./filter-by.enum";
import { Gender } from "./gender.enum";
import { Item } from "./item";

export interface IFilter {
  price: [number, number];
  gender: Gender | null;
  category: number;
  subcategory: number[];
  size: string[];
  condition: number[];
  brand: string[];
  style: string[];
  colour: string[];
  sortBy: SortBy;
  page: number;
  search: string;
}

export interface IFileringData {
  data: Item[];
  meta: {
    total: number;
  };
}
