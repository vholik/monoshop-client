import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Item } from "@store/types/item";

interface ItemsState {
  isLoading: boolean;
  error: string;
  items: Item[];
}

const initialState: ItemsState = {
  isLoading: false,
  error: "",
  items: [],
};

export const getFavorites = createAsyncThunk<Item[]>(
  "favorite",
  async (_, thunkAPI: any) => {
    try {
      const response = await instance.get<Item[]>("favorite");
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetFavoritesSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: {
    [getFavorites.fulfilled.type]: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [getFavorites.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getFavorites.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default GetFavoritesSlice.reducer;
