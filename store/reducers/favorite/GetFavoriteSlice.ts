import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { Item } from "@store/types/item";
import { RejectError } from "@store/types/error";

interface ItemsState {
  status: "init" | "loading" | "error" | "success";
  items: Item[];
}

const initialState: ItemsState = {
  status: "init",
  items: [],
};

export const getFavorites = createAsyncThunk<
  Item[],
  void,
  {
    rejectValue: RejectError;
  }
>("favorite", async (_, thunkAPI: any) => {
  try {
    const response = await instance.get<Item[]>("favorite");
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not get favorites" });
  }
});

export const GetFavoritesSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(getFavorites.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetFavoritesSlice.reducer;
