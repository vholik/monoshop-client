import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFilter } from "@store/types/filter";
import { SortBy } from "@store/types/filter-by.enum";
import { Gender } from "@store/types/gender.enum";

const initialState: IFilter = {
  price: [0, 10000],
  gender: null,
  category: 0,
  subcategory: [],
  size: [],
  condition: [],
  brand: [],
  style: [],
  colour: [],
  sortBy: SortBy.Recent,
  page: 1,
};

export const FilterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    setPrice: (state, action: PayloadAction<[number, number]>) => {
      state.price = action.payload;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCategory: (state, action: PayloadAction<number>) => {
      state.category = action.payload;
    },
    setSubcategory: (state, action: PayloadAction<number[]>) => {
      state.subcategory = action.payload;
    },
    setCondition: (state, action: PayloadAction<number[]>) => {
      state.condition = action.payload;
    },
    setBrand: (state, action: PayloadAction<string[]>) => {
      state.brand = action.payload;
    },
    setStyle: (state, action: PayloadAction<string[]>) => {
      state.style = action.payload;
    },
    setColour: (state, action: PayloadAction<string[]>) => {
      state.colour = action.payload;
    },
    setSize: (state, action: PayloadAction<string[]>) => {
      state.size = action.payload;
    },
    setStoredFilter: (state, action: PayloadAction<IFilter>) => {
      state = action.payload;
    },
  },
});

export const {
  setGender,
  setPrice,
  changePage,
  setBrand,
  setCategory,
  setColour,
  setCondition,
  setSize,
  setStyle,
  setStoredFilter,
  setSubcategory,
  setSortBy,
} = FilterSlice.actions;

export default FilterSlice.reducer;
