import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '@utils/axios'
import axios, { isAxiosError } from 'axios'
import { Item } from '@store/types/item'
import { RejectError } from '@store/types/error'
import { ParsedUrlQuery } from 'querystring'

interface ItemWithUserItems extends Item {
  userItems: Item[]
}

interface ItemState {
  status: 'init' | 'loading' | 'error' | 'success'
  item: ItemWithUserItems | null
}

const initialState: ItemState = {
  status: 'init',
  item: null
}

export const getItemById = createAsyncThunk<
  ItemWithUserItems,
  string,
  { rejectValue: RejectError }
>('item', async (id, thunkAPI) => {
  try {
    const response = await axios.get<ItemWithUserItems>(`${API_URL}/item/${id}`)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the item' })
  }
})

export const GetItemByIdSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItemById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.item = action.payload
        state.status = 'success'
      })
      .addCase(getItemById.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default GetItemByIdSlice.reducer
