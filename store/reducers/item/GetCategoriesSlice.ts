import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { Axios, AxiosError, isAxiosError } from "axios";
import { ItemEntityWithId } from "@store/types/item-entity";
import { Gender } from "@store/types/gender.enum";
import { ReduxError } from "@store/types/error";

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

export const getCategories = createAsyncThunk<
  ItemEntityWithId[],
  Gender,
  {
    rejectValue: ReduxError;
  }
>("category", async (gender, thunkAPI) => {
  try {
    const response = await instance.get<ItemEntityWithId[]>("category", {
      params: {
        gender: gender,
      },
    });
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response!.data.message);
    }
    return thunkAPI.rejectWithValue({ message: "Can not loading the data" });
  }
});

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
