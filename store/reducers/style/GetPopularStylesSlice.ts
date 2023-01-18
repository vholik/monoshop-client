import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { API_URL } from "@utils/axios";
import axios, { AxiosError, isAxiosError } from "axios";
import { ItemEntityWithImage } from "@store/types/item-entity";
import { RejectError } from "@store/types/error";

interface BrandsState {
  status: "init" | "loading" | "error" | "success";
  styles: ItemEntityWithImage[];
}

const initialState: BrandsState = {
  status: "init",
  styles: [],
};

export const getPopularStyles = createAsyncThunk<
  ItemEntityWithImage[],
  void,
  {
    rejectValue: RejectError;
  }
>("popularStyles", async (_, thunkAPI) => {
  try {
    const response = await axios.get<ItemEntityWithImage[]>(
      `${API_URL}/style/popular`
    );
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response!.data.message);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const GetPopularStylesSlice = createSlice({
  name: "popularStyles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPopularStyles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPopularStyles.fulfilled, (state, action) => {
        state.styles = action.payload;
        state.status = "success";
      })
      .addCase(getPopularStyles.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetPopularStylesSlice.reducer;
