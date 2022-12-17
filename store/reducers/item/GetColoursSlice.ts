import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";

interface BrandsState {
  isColoursLoading: boolean;
  coloursError: string;
  colours: ItemEntity[];
}

const initialState: BrandsState = {
  isColoursLoading: false,
  coloursError: "",
  colours: [],
};

export const getColours = createAsyncThunk("colour", async (_, thunkAPI) => {
  try {
    const response = await instance.get<ItemEntity[]>("colour");
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return thunkAPI.rejectWithValue(e.response!.data.message);
    }
    return e;
  }
});

export const GetColoursSlice = createSlice({
  name: "colour",
  initialState,
  reducers: {},
  extraReducers: {
    [getColours.fulfilled.type]: (
      state,
      action: PayloadAction<ItemEntity[]>
    ) => {
      state.colours = action.payload;
      state.isColoursLoading = false;
      state.coloursError = "";
    },
    [getColours.pending.type]: (state) => {
      state.isColoursLoading = true;
    },
    [getColours.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isColoursLoading = false;
      state.coloursError = action.payload;
    },
  },
});

export default GetColoursSlice.reducer;
