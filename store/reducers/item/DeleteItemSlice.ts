import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Gender } from "@store/types/gender.enum";
import { Item } from "@store/types/item";
import { IFilter } from "@store/types/filter";

interface ItemState {
  isLoading: boolean;
  error: string;
}

const initialState: ItemState = {
  isLoading: false,
  error: "",
};

export const deleteItemById = createAsyncThunk<string, number>(
  "delte",
  async (id: number, thunkAPI: any) => {
    try {
      const response = await instance.delete<string>(`item/${id}`);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const DeleteItemSlice = createSlice({
  name: "delete",
  initialState,
  reducers: {},
  extraReducers: {
    [deleteItemById.fulfilled.type]: (state, action: PayloadAction<Item>) => {
      state.isLoading = false;
      state.error = "";
    },
    [deleteItemById.pending.type]: (state) => {
      state.isLoading = true;
    },
    [deleteItemById.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default DeleteItemSlice.reducer;
