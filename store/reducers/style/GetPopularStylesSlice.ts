import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { API_URL } from "@utils/axios";
import axios, { AxiosError, isAxiosError } from "axios";
import { ItemEntityWithImage } from "@store/types/item-entity";
import { ReduxError } from "@store/types/error";

interface BrandsState {
  isLoading: boolean;
  error: string;
  styles: ItemEntityWithImage[];
}

const initialState: BrandsState = {
  isLoading: false,
  error: "",
  styles: [],
};

export const getPopularStyles = createAsyncThunk<
  ItemEntityWithImage[],
  void,
  {
    rejectValue: ReduxError;
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
    console.log(err);
    return thunkAPI.rejectWithValue({ message: "Can not loading the data" });
  }
});

export const GetPopularStylesSlice = createSlice({
  name: "popularStyles",
  initialState,
  reducers: {},
  extraReducers: {
    [getPopularStyles.fulfilled.type]: (
      state,
      action: PayloadAction<ItemEntityWithImage[]>
    ) => {
      state.styles = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [getPopularStyles.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getPopularStyles.rejected.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default GetPopularStylesSlice.reducer;
