import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Gender } from "@store/types/gender.enum";
import { Item } from "@store/types/item";
import { IFilter } from "@store/types/filter";

interface ItemState {
  isLoading: boolean;
  error: string;
  item: Item | null;
}

const initialState: ItemState = {
  isLoading: false,
  error: "",
  item: null,
};

export const getItemById = createAsyncThunk<Item, string>(
  "item",
  async (id: string, thunkAPI: any) => {
    try {
      const response = await instance.get<Item[]>(`item/${id}`);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetItemByIdSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: {
    [getItemById.fulfilled.type]: (state, action: PayloadAction<Item>) => {
      state.item = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [getItemById.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getItemById.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default GetItemByIdSlice.reducer;
