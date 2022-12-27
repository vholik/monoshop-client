import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Item } from "@store/types/item";

interface ItemsState {
  isItemsLoading: boolean;
  itemsError: string;
  items: Item[];
}

const initialState: ItemsState = {
  isItemsLoading: false,
  itemsError: "",
  items: [],
};

export const getUserItems = createAsyncThunk<Item[]>(
  "userItems",
  async (_, thunkAPI: any) => {
    try {
      const response = await instance.get<Item[]>("item/user");
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetUserItemsSlice = createSlice({
  name: "userItems",
  initialState,
  reducers: {},
  extraReducers: {
    [getUserItems.fulfilled.type]: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.isItemsLoading = false;
      state.itemsError = "";
    },
    [getUserItems.pending.type]: (state) => {
      state.isItemsLoading = true;
    },
    [getUserItems.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isItemsLoading = false;
      state.itemsError = action.payload;
    },
  },
});

export default GetUserItemsSlice.reducer;
