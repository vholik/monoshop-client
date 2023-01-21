import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance, { API_URL, basicInstance } from '@utils/axios'
import axios, { AxiosError, isAxiosError } from 'axios'
import { ItemEntityWithId } from '@store/types/item-entity'
import { RejectError } from '@store/types/error'

interface BrandsState {
  status: 'init' | 'loading' | 'error' | 'success'
  brands: ItemEntityWithId[]
}

const initialState: BrandsState = {
  status: 'init',
  brands: []
}

export const getBrands = createAsyncThunk<
  ItemEntityWithId[],
  string | undefined,
  {
    rejectValue: RejectError
  }
>('brand', async (keywords: string | undefined, thunkAPI) => {
  try {
    const response = await basicInstance.get<ItemEntityWithId[]>('brand', {
      params: {
        search: keywords || ''
      }
    })
    return response.data
  } catch (e: any) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }

    return thunkAPI.rejectWithValue({ message: e.message })
  }
})

export const GetBrandsSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.brands = action.payload
        state.status = 'success'
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.status = 'error'
      })
  }
})

export default GetBrandsSlice.reducer
