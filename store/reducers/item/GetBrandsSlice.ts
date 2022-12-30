import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";

interface BrandsState {
  isBrandsLoading: boolean;
  brandsError: string;
  brands: ItemEntity[];
}

const initialState: BrandsState = {
  isBrandsLoading: false,
  brandsError: "",
  brands: [],
};

export const getBrands = createAsyncThunk<ItemEntity[], string, any>(
  "brand",
  async (search: string, thunkAPI) => {
    try {
      const response = await instance.get<ItemEntity[]>("brand", {
        params: {
          search: search || "",
        },
      });
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const GetBrandsSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: {
    [getBrands.fulfilled.type]: (
      state,
      action: PayloadAction<ItemEntity[]>
    ) => {
      state.brands = action.payload;
      state.isBrandsLoading = false;
      state.brandsError = "";
    },
    [getBrands.pending.type]: (state) => {
      state.isBrandsLoading = true;
    },
    [getBrands.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isBrandsLoading = false;
      state.brandsError = action.payload;
    },
  },
});

export default GetBrandsSlice.reducer;
