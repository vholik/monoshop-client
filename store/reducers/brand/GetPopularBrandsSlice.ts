import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { API_URL } from "@utils/axios";
import axios, { AxiosError, isAxiosError } from "axios";
import { ItemEntityWithImage } from "@store/types/item-entity";
import { ReduxError } from "@store/types/error";

interface BrandsState {
  isBrandsLoading: boolean;
  brandsError: string;
  popularBrands: ItemEntityWithImage[];
}

const initialState: BrandsState = {
  isBrandsLoading: false,
  brandsError: "",
  popularBrands: [],
};

export const getPopularBrands = createAsyncThunk<
  ItemEntityWithImage[],
  void,
  {
    rejectValue: ReduxError;
  }
>("popularBrands", async (_, thunkAPI) => {
  try {
    const response = await axios.get<ItemEntityWithImage[]>(
      `${API_URL}/brand/popular`
    );
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response!.data.message);
    }
    return thunkAPI.rejectWithValue({ message: "Can not loading the data" });
  }
});

export const GetPopularBrandsSlice = createSlice({
  name: "popularBrands",
  initialState,
  reducers: {},
  extraReducers: {
    [getPopularBrands.fulfilled.type]: (
      state,
      action: PayloadAction<ItemEntityWithImage[]>
    ) => {
      state.popularBrands = action.payload;
      state.isBrandsLoading = false;
      state.brandsError = "";
    },
    [getPopularBrands.pending.type]: (state) => {
      state.isBrandsLoading = true;
    },
    [getPopularBrands.rejected.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.isBrandsLoading = false;
      state.brandsError = action.payload;
    },
  },
});

export default GetPopularBrandsSlice.reducer;
