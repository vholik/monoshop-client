import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { AxiosError, isAxiosError } from 'axios'
import { RejectError } from '@store/types/error'
import { Order } from '@stripe/stripe-js'
import { IOrder } from '@store/types/order'

interface OrderState {
  status: 'init' | 'loading' | 'error' | 'success'
}

const initialState: OrderState = {
  status: 'init'
}

export const setDeliveredOrder = createAsyncThunk<
  IOrder[],
  { orderId: string },
  { rejectValue: RejectError }
>('order', async ({ orderId }, thunkAPI) => {
  try {
    const response = await instance.put<IOrder[]>(`order/${orderId}`)
    return response.data
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the data' })
  }
})

export const SetDeliveredOrderSlice = createSlice({
  name: 'order/:id',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setDeliveredOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(setDeliveredOrder.fulfilled, (state) => {
        state.status = 'success'
      })
      .addCase(setDeliveredOrder.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default SetDeliveredOrderSlice.reducer
