import { Gender } from "./gender.enum";

export interface Category {
  id: number;
  name: string;
  gender: Gender;
}
