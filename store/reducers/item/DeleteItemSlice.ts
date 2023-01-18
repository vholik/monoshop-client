import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { Gender } from "@store/types/gender.enum";
import { Item } from "@store/types/item";
import { IFilter } from "@store/types/filter";
import { RejectError } from "@store/types/error";

interface ItemState {
  status: "init" | "loading" | "error" | "success";
}

const initialState: ItemState = {
  status: "loading",
};

export const deleteItemById = createAsyncThunk<
  string,
  number,
  { rejectValue: RejectError }
>("item/delete", async (id, thunkAPI) => {
  try {
    const response = await instance.delete<string>(`item/${id}`);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const DeleteItemSlice = createSlice({
  name: "item/delete",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteItemById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteItemById.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(deleteItemById.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default DeleteItemSlice.reducer;
