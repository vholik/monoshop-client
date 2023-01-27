import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { AxiosError, isAxiosError } from 'axios'
import { RejectError } from '@store/types/error'
import { IOrder } from '@store/types/order'

interface OrderState {
  status: 'init' | 'loading' | 'error' | 'success'
  orders: IOrder[]
}

const initialState: OrderState = {
  status: 'init',
  orders: []
}

export const getSelled = createAsyncThunk<
  IOrder[],
  void,
  { rejectValue: RejectError }
>('order', async (_, thunkAPI) => {
  try {
    const response = await instance.get<IOrder[]>('order/selled')
    return response.data
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the data' })
  }
})

export const GetSelledSlice = createSlice({
  name: 'order/selling',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSelled.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getSelled.fulfilled, (state, action) => {
        state.orders = action.payload
        state.status = 'success'
      })
      .addCase(getSelled.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default GetSelledSlice.reducer
