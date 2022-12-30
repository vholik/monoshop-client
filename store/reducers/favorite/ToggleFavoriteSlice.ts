import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";

interface ItemState {
  isFavoriteToggleLoading: boolean;
  error: string;
}

const initialState: ItemState = {
  isFavoriteToggleLoading: false,
  error: "",
};

export const toggleFavorite = createAsyncThunk<boolean, number>(
  "toggleFavorite",
  async (id: number, thunkAPI: any) => {
    try {
      const response = await instance.put<boolean>(`favorite/${id}`);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const ToggleFavoriteSlice = createSlice({
  name: "toggleFavorite",
  initialState,
  reducers: {},
  extraReducers: {
    [toggleFavorite.fulfilled.type]: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isFavoriteToggleLoading = false;
      state.error = "";
    },
    [toggleFavorite.pending.type]: (state) => {
      state.isFavoriteToggleLoading = true;
    },
    [toggleFavorite.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isFavoriteToggleLoading = false;
      state.error = action.payload;
    },
  },
});

export default ToggleFavoriteSlice.reducer;
