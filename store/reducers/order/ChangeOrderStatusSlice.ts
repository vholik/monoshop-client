import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { AxiosError, isAxiosError } from 'axios'
import { RejectError } from '@store/types/error'
import { Order } from '@stripe/stripe-js'

interface OrderState {
  status: 'init' | 'loading' | 'error' | 'success'
}

const initialState: OrderState = {
  status: 'init'
}

export const changeOrderStatus = createAsyncThunk<
  Order[],
  { orderId: string },
  { rejectValue: RejectError }
>('order', async ({ orderId }, thunkAPI) => {
  try {
    const response = await instance.put<Order[]>('order/changeStatus', {
      orderId
    })
    return response.data
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the data' })
  }
})

export const ChangeOrderStatusSlice = createSlice({
  name: 'order/changeStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changeOrderStatus.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(changeOrderStatus.fulfilled, (state) => {
        state.status = 'success'
      })
      .addCase(changeOrderStatus.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default ChangeOrderStatusSlice.reducer
