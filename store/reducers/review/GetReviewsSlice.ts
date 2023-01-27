import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { isAxiosError } from 'axios'
import { RejectError } from '@store/types/error'
import { IGetReviewsForm, IReview } from '@store/types/review'

interface ReviewState {
  status: 'init' | 'loading' | 'error' | 'success' | 'end'
  reviews: IReview[]
}

const initialState: ReviewState = {
  status: 'init',
  reviews: []
}

export const getReviews = createAsyncThunk<
  IReview[],
  IGetReviewsForm,
  { rejectValue: RejectError }
>('getReviews', async (formData, thunkAPI: any) => {
  try {
    const response = await instance.get<IReview[]>('review', {
      params: formData
    })
    return response.data
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not load the data' })
  }
})

export const GetUserItemsSlice = createSlice({
  name: 'getReviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        if (!action.payload.length) {
          state.status = 'end'
        } else {
          state.reviews = state.reviews.concat(action.payload)
          state.status = 'success'
        }
      })
      .addCase(getReviews.rejected, (state) => {
        state.status = 'error'
      })
  }
})

export default GetUserItemsSlice.reducer
