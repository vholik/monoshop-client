import { createSlice } from "@reduxjs/toolkit";
import { IFilter } from "@store/types/filter";
import { FilterBy } from "@store/types/filter-by.enum";

interface FilterState {
  isLoading: boolean;
  error: string;
  filter: IFilter;
}

const initialState: FilterState = {
  isLoading: false,
  error: "",
  filter: {
    price: [0, 10000],
    gender: undefined,
    category: [],
    size: [],
    condition: [],
    brand: [],
    style: [],
    colour: [],
    sortBy: FilterBy.Popular,
    page: 1,
  },
};

export const GetUserByIdSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
});

export default GetUserByIdSlice.reducer;
