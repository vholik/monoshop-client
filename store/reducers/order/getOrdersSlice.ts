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

export const getOrders = createAsyncThunk<
  Item[],
  void,
  { rejectValue: RejectError }
>("order", async (_, thunkAPI) => {
  try {
    const response = await instance.get<Item[]>("order");
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const GetOrdersSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(getOrders.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetOrdersSlice.reducer;
