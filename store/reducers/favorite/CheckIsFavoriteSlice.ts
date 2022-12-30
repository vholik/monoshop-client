import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";

interface ItemState {
  isFavoriteLoading: boolean;
  error: string;
  isFavorite: boolean;
}

const initialState: ItemState = {
  isFavoriteLoading: false,
  error: "",
  isFavorite: false,
};

export const checkIsFavorite = createAsyncThunk<boolean, string>(
  "isFavorite",
  async (id: string, thunkAPI: any) => {
    try {
      const response = await instance.get<boolean>(`favorite/${id}`);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const CheckIsFavoriteSlice = createSlice({
  name: "isFavorite",
  initialState,
  reducers: {
    setIsFavorite: (state, action: PayloadAction<boolean>) => {
      state.isFavorite = action.payload;
    },
  },
  extraReducers: {
    [checkIsFavorite.fulfilled.type]: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isFavorite = action.payload;
      state.isFavoriteLoading = false;
      state.error = "";
    },
    [checkIsFavorite.pending.type]: (state) => {
      state.isFavoriteLoading = true;
    },
    [checkIsFavorite.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isFavoriteLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setIsFavorite } = CheckIsFavoriteSlice.actions;

export default CheckIsFavoriteSlice.reducer;
