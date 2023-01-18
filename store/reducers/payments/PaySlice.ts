import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { ItemEntityWithId } from "@store/types/item-entity";
import { PayFormData } from "@store/types/pay";
import { RejectError } from "@store/types/error";

interface PayState {
  status: "init" | "loading" | "error" | "success";
}

const initialState: PayState = {
  status: "init",
};

interface IData extends PayFormData {
  itemId: number;
}

export const getStripeSession = createAsyncThunk<
  string,
  IData,
  { rejectValue: RejectError }
>("brand", async (data, thunkAPI) => {
  try {
    const response = await instance.post<string>("stripe", data);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({
      message: "Can not load a payment session",
    });
  }
});

export const PaySlice = createSlice({
  name: "stripeSession",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStripeSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStripeSession.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(getStripeSession.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default PaySlice.reducer;
