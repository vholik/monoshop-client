import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RejectError } from "@store/types/error";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";

interface ItemState {
  status: "init" | "loading" | "error" | "success";
  isFavorite: boolean;
}

const initialState: ItemState = {
  status: "init",
  isFavorite: false,
};

export const checkIsFavorite = createAsyncThunk<
  boolean,
  string,
  { rejectValue: RejectError }
>("isFavorite", async (id: string, thunkAPI: any) => {
  try {
    const response = await instance.get<boolean>(`favorite/${id}`);
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response!.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

export const CheckIsFavoriteSlice = createSlice({
  name: "isFavorite",
  initialState,
  reducers: {
    setIsFavorite: (state, action: PayloadAction<{ isFavorite: boolean }>) => {
      state.isFavorite = action.payload.isFavorite;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIsFavorite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkIsFavorite.fulfilled, (state, action) => {
        state.isFavorite = action.payload;
        state.status = "success";
      })
      .addCase(checkIsFavorite.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const {
  reducer: checkIsFavoriteReducer,
  actions: checkIsFavoriteActions,
} = CheckIsFavoriteSlice;
