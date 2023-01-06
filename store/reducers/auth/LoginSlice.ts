import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { AuthResponse } from "@utils/axios";
import { ILoginFormData } from "@store/types/auth";
import { AxiosError, isAxiosError } from "axios";
import { ReduxError } from "@store/types/error";

interface LoginState {
  isLoading: boolean;
  error: string;
  isAuth: boolean;
}

const initialState: LoginState = {
  isLoading: false,
  error: "",
  isAuth: false,
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

export const checkIsAuth = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get<boolean>("auth/me");
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: {
    // Check auth logic
    [checkIsAuth.fulfilled.type]: (state) => {
      state.isAuth = true;
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
