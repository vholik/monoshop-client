import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance from '@utils/axios'
import { IRegisterFormData } from '@store/types/auth'
import { User } from '@store/types/user'
import { AxiosError, isAxiosError } from 'axios'
import { RejectError } from '@store/types/error'

interface SubmitState {
  status: 'init' | 'loading' | 'error' | 'success'
  error: string
}

const initialState: SubmitState = {
  status: 'init',
  error: ''
}

export const confirmEmail = createAsyncThunk<
  unknown,
  { token: string },
  {
    rejectValue: RejectError
  }
>('email/submit', async (data, thunkAPI) => {
  try {
    const response = await instance.post('email/confirm', data)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not register' })
  }
})

export const ConfirmEmailSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(confirmEmail.fulfilled, (state) => {
      state.status = 'success'
    })
    builder.addCase(confirmEmail.rejected, (state) => {
      state.status = 'error'
    })
    builder.addCase(confirmEmail.pending, (state) => {
      state.status = 'loading'
    })
  }
})

export default ConfirmEmailSlice.reducer
