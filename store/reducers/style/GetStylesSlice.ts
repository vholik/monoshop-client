import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance, { API_URL, basicInstance } from '@utils/axios'
import axios, { AxiosError, isAxiosError } from 'axios'
import { ItemEntity } from '@store/types/item-entity'
import { RejectError } from '@store/types/error'

interface BrandsState {
  status: 'init' | 'loading' | 'error' | 'success'
  styles: ItemEntity[]
}

const initialState: BrandsState = {
  status: 'init',
  styles: []
}

export const getStyles = createAsyncThunk<
  ItemEntity[],
  void,
  { rejectValue: RejectError }
>('styles', async (_: void, thunkAPI) => {
  try {
    const response = await basicInstance.get<ItemEntity[]>(`style`)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the styles' })
  }
})

export const GetStylesSlice = createSlice({
  name: 'styles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStyles.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getStyles.fulfilled, (state, action) => {
        state.styles = action.payload
        state.status = 'success'
      })
      .addCase(getStyles.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default GetStylesSlice.reducer
