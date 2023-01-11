import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { AuthResponse } from "@utils/axios";
import { ILoginFormData } from "@store/types/auth";
import { AxiosError, isAxiosError } from "axios";
import { ReduxError } from "@store/types/error";

interface LoginState {
  isLoading: boolean;
  error: string;
  isAuth: boolean;
  userId: number;
}

const initialState: LoginState = {
  isLoading: false,
  error: "",
  isAuth: false,
  userId: 0,
};

export const fetchLogin = createAsyncThunk<
  AuthResponse,
  ILoginFormData,
  {
    rejectValue: ReduxError;
  }
>("auth/login", async (formData, thunkAPI) => {
  try {
    const response = await instance.post<AuthResponse>("auth/login", formData);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response!.data.message);
    }
    return thunkAPI.rejectWithValue({ message: "Can not loading the data" });
  }
});

export const checkIsAuth = createAsyncThunk<
  number,
  void,
  {
    rejectValue: ReduxError;
  }
>("auth/refresh", async (_: void, thunkAPI) => {
  try {
    const response = await instance.get<number>("auth/me");
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response!.data.message);
    }
    return thunkAPI.rejectWithValue({ message: "Can not auth" });
  }
});

export const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: {
    // Check auth logic
    [checkIsAuth.fulfilled.type]: (state, action: PayloadAction<number>) => {
      state.isAuth = true;
      state.userId = action.payload;
    },
    [checkIsAuth.pending.type]: (state) => {
      state.isAuth = false;
    },
    [checkIsAuth.rejected.type]: (state) => {
      state.isAuth = false;
    },
    // Login logic
    [fetchLogin.fulfilled.type]: (
      state,
      action: PayloadAction<AuthResponse>
    ) => {
      state.isLoading = false;
      state.error = "";
      state.isAuth = true;
    },
    [fetchLogin.pending.type]: (state) => {
      state.isLoading = true;
    },
    [fetchLogin.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuth = false;
    },
  },
});

export default LoginSlice.reducer;
