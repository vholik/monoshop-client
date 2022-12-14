import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Category } from "@store/types/category";

interface CategoriesState {
  isLoading: boolean;
  error: string;
  categories: Category[];
}

const initialState: CategoriesState = {
  isLoading: false,
  error: "",
  categories: [],
};

export const getCategories = createAsyncThunk(
  "category",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get<Category[]>("category");
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetCategoriesSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    [getCategories.fulfilled.type]: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [getCategories.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getCategories.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default GetCategoriesSlice.reducer;
