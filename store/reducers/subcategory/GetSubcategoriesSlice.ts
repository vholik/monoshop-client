import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance, { basicInstance } from '@utils/axios'
import { AxiosError, isAxiosError } from 'axios'
import { ItemEntity, ItemEntityWithId } from '@store/types/item-entity'
import { Gender } from '@store/types/gender.enum'
import { RejectError } from '@store/types/error'

interface SubcategoriesState {
  status: 'init' | 'loading' | 'error' | 'success'
  subcategories: ItemEntityWithId[]
}

const initialState: SubcategoriesState = {
  status: 'init',
  subcategories: []
}

export const getSubcategories = createAsyncThunk<
  ItemEntityWithId[],
  number,
  { rejectValue: RejectError }
>('subcategory', async (categoryId, thunkAPI) => {
  try {
    const response = await basicInstance.get<ItemEntityWithId[]>(
      'subcategory',
      {
        params: {
          categoryId
        }
      }
    )
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not get subcategories' })
  }
})

export const GetSubcategoriesSlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubcategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload
        state.status = 'success'
      })
      .addCase(getSubcategories.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default GetSubcategoriesSlice.reducer
