import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { AxiosError, isAxiosError } from 'axios'
import { ItemEntity } from '@store/types/item-entity'
import { IAddItemFormData, Item } from '@store/types/item'
import { RejectError } from '@store/types/error'

interface BrandsState {
  status: 'init' | 'loading' | 'error' | 'success'
}

const initialState: BrandsState = {
  status: 'init'
}

export const addItem = createAsyncThunk<
  Item,
  IAddItemFormData,
  {
    rejectValue: RejectError
  }
>('item', async (formData: IAddItemFormData, thunkAPI) => {
  try {
    const response = await instance.post<Item>('item', formData)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the data' })
  }
})

export const AddItemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = 'success'
      })
      .addCase(addItem.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default AddItemSlice.reducer
