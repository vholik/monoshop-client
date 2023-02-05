import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import instance, { AuthResponse, logoutInstance } from '@utils/axios'
import { ILoginFormData } from '@store/types/auth'
import { AxiosError, isAxiosError } from 'axios'
import { RejectError } from '@store/types/error'
import { HYDRATE } from 'next-redux-wrapper'

interface InitState {
  userId: number | null
  fullName: string | null
  photo: string | null
  status: 'init' | 'loading' | 'error' | 'authenticated' | 'unauthorized'
  error: string
}

const initialState: InitState = {
  userId: null,
  status: 'init',
  error: '',
  fullName: null,
  photo: null
}

export const logout = createAsyncThunk<
  any,
  void,
  {
    rejectValue: RejectError
  }
>('auth/logout', async (_, thunkAPI) => {
  try {
    const response = await logoutInstance.post<any>('auth/logout')
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not log out' })
  }
})

export const loginUser = createAsyncThunk<
  AuthResponse,
  ILoginFormData,
  {
    rejectValue: RejectError
  }
>('auth/login', async (formData, thunkAPI) => {
  try {
    const response = await instance.post<AuthResponse>('auth/login', formData)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'Can not login' })
  }
})

export const checkIsAuth = createAsyncThunk<
  AuthResponse,
  void,
  {
    rejectValue: RejectError
  }
>('auth/me', async (_: void, thunkAPI) => {
  try {
    const response = await instance.get<AuthResponse>('auth/me')
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data)
    }
    return thunkAPI.rejectWithValue({ message: 'User is not signed' })
  }
})

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login out
    builder
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userId = null
        state.fullName = null
        state.photo = null
        state.status = 'unauthorized'
      })
      .addCase(logout.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message
        }
        state.status = 'error'
      })
    // Log in
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userId = action.payload.userId
        state.fullName = action.payload.fullName
        state.photo = action.payload.photo
        state.status = 'authenticated'
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message
        }
        state.status = 'error'
      })
    // Me
    builder
      .addCase(checkIsAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(checkIsAuth.fulfilled, (state, action) => {
        state.userId = action.payload.userId
        state.fullName = action.payload.fullName
        state.photo = action.payload.photo
        state.status = 'authenticated'
      })
      .addCase(checkIsAuth.rejected, (state, action) => {
        state.status = 'unauthorized'
        if (action.payload) {
          state.error = action.payload.message
        }
      })
  }
})

export const { reducer: authReducer } = AuthSlice
