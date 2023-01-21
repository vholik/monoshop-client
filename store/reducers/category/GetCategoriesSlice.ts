import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance, { basicInstance } from '@utils/axios'
import { Axios, AxiosError, isAxiosError } from 'axios'
import { ItemEntityWithId } from '@store/types/item-entity'
import { Gender } from '@store/types/gender.enum'
import { RejectError } from '@store/types/error'

interface CategoriesState {
  status: 'init' | 'loading' | 'error' | 'success'
  categories: ItemEntityWithId[]
}

const initialState: CategoriesState = {
  status: 'init',
  categories: []
}

export const getCategories = createAsyncThunk<
  ItemEntityWithId[],
  Gender,
  {
    rejectValue: RejectError
  }
>('category', async (gender, thunkAPI) => {
  try {
    const response = await basicInstance.get<ItemEntityWithId[]>('category', {
      params: {
        gender: gender
      }
    })
    return response.data
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the data' })
  }
})

export const GetCategoriesSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload
        state.status = 'success'
      })
      .addCase(getCategories.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default GetCategoriesSlice.reducer
