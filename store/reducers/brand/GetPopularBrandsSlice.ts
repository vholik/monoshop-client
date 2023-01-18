import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@utils/axios";
import axios, { isAxiosError } from "axios";
import { ItemEntityWithImage } from "@store/types/item-entity";
import { RejectError } from "@store/types/error";

interface BrandsState {
  status: "init" | "loading" | "error" | "success";
  brands: ItemEntityWithImage[];
}

const initialState: BrandsState = {
  status: "init",
  brands: [],
};

export const getPopularBrands = createAsyncThunk<
  ItemEntityWithImage[],
  void,
  {
    rejectValue: RejectError;
  }
>("popularBrands", async (_, thunkAPI) => {
  try {
    const response = await axios.get<ItemEntityWithImage[]>(
      `${API_URL}/brand/popular`
    );
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response!.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const GetPopularBrandsSlice = createSlice({
  name: "popularBrands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPopularBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPopularBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.status = "success";
      })
      .addCase(getPopularBrands.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetPopularBrandsSlice.reducer;
