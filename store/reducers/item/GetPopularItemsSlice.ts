import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { API_URL } from "@utils/axios";
import axios, { AxiosError, isAxiosError } from "axios";
import { ItemEntityWithId } from "@store/types/item-entity";
import { RejectError } from "@store/types/error";
import { Item } from "@store/types/item";

interface BrandsState {
  status: "init" | "loading" | "error" | "success";
  items: Item[];
}

const initialState: BrandsState = {
  status: "init",
  items: [],
};

export const getPopularItems = createAsyncThunk<
  Item[],
  void,
  {
    rejectValue: RejectError;
  }
>("popularitems", async (_, thunkAPI) => {
  try {
    const response = await axios.get<Item[]>(`${API_URL}/item/popular`);
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const GetPopularItemsSlice = createSlice({
  name: "popularItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPopularItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPopularItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(getPopularItems.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetPopularItemsSlice.reducer;
