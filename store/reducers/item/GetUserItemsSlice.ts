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

export const getUserItems = createAsyncThunk<
  Item[],
  void,
  { rejectValue: RejectError }
>("item/user", async (_, thunkAPI: any) => {
  try {
    const response = await instance.get<Item[]>("item/user");
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const GetUserItemsSlice = createSlice({
  name: "item/user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(getUserItems.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetUserItemsSlice.reducer;
