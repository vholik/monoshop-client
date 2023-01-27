import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { AxiosError, isAxiosError } from 'axios'
import { ItemEntity } from '@store/types/item-entity'
import { IAddItemFormData, Item } from '@store/types/item'
import { RejectError } from '@store/types/error'
import { IReview, IReviewForm } from '@store/types/review'

interface ReviewState {
  status: 'init' | 'loading' | 'error' | 'success'
}

const initialState: ReviewState = {
  status: 'init'
}

export const postReview = createAsyncThunk<
  IReview,
  IReviewForm,
  {
    rejectValue: RejectError
  }
>('review', async (formData, thunkAPI) => {
  try {
    const response = await instance.post<IReview>('review', formData)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not post a review' })
  }
})

export const PostReviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postReview.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.status = 'success'
      })
      .addCase(postReview.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default PostReviewSlice.reducer
