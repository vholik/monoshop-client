import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";
import { RejectError } from "@store/types/error";

interface BrandsState {
  status: "init" | "loading" | "error" | "success";
  colours: ItemEntity[];
}

const initialState: BrandsState = {
  status: "init",
  colours: [],
};

export const getColours = createAsyncThunk<
  ItemEntity[],
  void,
  { rejectValue: RejectError }
>("colour", async (_, thunkAPI) => {
  try {
    const response = await instance.get<ItemEntity[]>("colour");
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not get colours" });
  }
});

export const GetColoursSlice = createSlice({
  name: "colour",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getColours.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getColours.fulfilled, (state, action) => {
        state.colours = action.payload;
        state.status = "success";
      })
      .addCase(getColours.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetColoursSlice.reducer;
