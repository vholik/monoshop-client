import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";

interface BrandsState {
  isStylesLoading: boolean;
  stylesError: string;
  styles: ItemEntity[];
}

const initialState: BrandsState = {
  isStylesLoading: false,
  stylesError: "",
  styles: [],
};

export const getStyles = createAsyncThunk("styles", async (_, thunkAPI) => {
  try {
    const response = await instance.get<ItemEntity[]>("style");
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return thunkAPI.rejectWithValue(e.response!.data.message);
    }
    return e;
  }
});

export const GetStylesSlice = createSlice({
  name: "styles",
  initialState,
  reducers: {},
  extraReducers: {
    [getStyles.fulfilled.type]: (
      state,
      action: PayloadAction<ItemEntity[]>
    ) => {
      state.styles = action.payload;
      state.isStylesLoading = false;
      state.stylesError = "";
    },
    [getStyles.pending.type]: (state) => {
      state.isStylesLoading = true;
    },
    [getStyles.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isStylesLoading = false;
      state.stylesError = action.payload;
    },
  },
});

export default GetStylesSlice.reducer;
