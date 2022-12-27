import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity, ItemEntityWithId } from "@store/types/item-entity";
import { Gender } from "@store/types/gender.enum";

interface SubcategoriesState {
  isSubcategoriesLoading: boolean;
  subcategoriesError: string;
  subcategories: ItemEntityWithId[];
}

const initialState: SubcategoriesState = {
  isSubcategoriesLoading: false,
  subcategoriesError: "",
  subcategories: [],
};

export const getSubcategories = createAsyncThunk(
  "subcategory",
  async (categoryId: number, thunkAPI) => {
    try {
      const response = await instance.get<ItemEntityWithId[]>("subcategory", {
        params: {
          categoryId,
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

export const GetSubcategoriesSlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {},
  extraReducers: {
    [getSubcategories.fulfilled.type]: (
      state,
      action: PayloadAction<ItemEntityWithId[]>
    ) => {
      state.subcategories = action.payload;
      state.isSubcategoriesLoading = false;
      state.subcategoriesError = "";
    },
    [getSubcategories.pending.type]: (state) => {
      state.isSubcategoriesLoading = true;
    },
    [getSubcategories.rejected.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.isSubcategoriesLoading = false;
      state.subcategoriesError = action.payload;
    },
  },
});

export default GetSubcategoriesSlice.reducer;
