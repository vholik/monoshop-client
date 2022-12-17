import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Gender } from "@store/types/gender.enum";
import { Item } from "@store/types/item";

interface CategoriesState {
  isItemsLoading: boolean;
  itemsError: string;
  items: Item[];
}

const initialState: CategoriesState = {
  isItemsLoading: false,
  itemsError: "",
  items: [],
};

export const getItems = createAsyncThunk<Item[]>(
  "items",
  async (_, thunkAPI: any) => {
    try {
      const response = await instance.get<Item[]>("item");
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetItemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: {
    [getItems.fulfilled.type]: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.isItemsLoading = false;
      state.itemsError = "";
    },
    [getItems.pending.type]: (state) => {
      state.isItemsLoading = true;
    },
    [getItems.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isItemsLoading = false;
      state.itemsError = action.payload;
    },
  },
});

export default GetItemsSlice.reducer;
