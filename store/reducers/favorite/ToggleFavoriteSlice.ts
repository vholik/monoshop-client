import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RejectError } from "@store/types/error";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";

interface ItemState {
  status: "init" | "loading" | "error" | "success";
}

const initialState: ItemState = {
  status: "init",
};

export const toggleFavorite = createAsyncThunk<
  boolean,
  number,
  { rejectValue: RejectError }
>("favorite/id", async (id: number, thunkAPI: any) => {
  try {
    const response = await instance.put<boolean>(`favorite/${id}`);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return e;
  }
});

export const ToggleFavoriteSlice = createSlice({
  name: "favorite/id",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleFavorite.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(toggleFavorite.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default ToggleFavoriteSlice.reducer;
