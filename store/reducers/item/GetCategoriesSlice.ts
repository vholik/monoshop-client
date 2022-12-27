import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity, ItemEntityWithId } from "@store/types/item-entity";
import { Gender } from "@store/types/gender.enum";

interface CategoriesState {
  isCategoriesLoading: boolean;
  categoriesError: string;
  categories: ItemEntityWithId[];
}

const initialState: CategoriesState = {
  isCategoriesLoading: false,
  categoriesError: "",
  categories: [],
};

export const getCategories = createAsyncThunk(
  "category",
  async (gender: Gender | undefined, thunkAPI) => {
    try {
      const response = await instance.get<ItemEntityWithId[]>("category", {
        params: {
          gender: gender,
        },
      });
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
      action: PayloadAction<ItemEntityWithId[]>
    ) => {
      state.categories = action.payload;
      state.isCategoriesLoading = false;
      state.categoriesError = "";
    },
    [getCategories.pending.type]: (state) => {
      state.isCategoriesLoading = true;
    },
    [getCategories.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isCategoriesLoading = false;
      state.categoriesError = action.payload;
    },
  },
});

export default GetCategoriesSlice.reducer;
