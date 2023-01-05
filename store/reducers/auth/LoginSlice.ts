import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { ILoginFormData } from "@store/types/auth";
import { AxiosError } from "axios";

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

export const fetchLogin = createAsyncThunk(
  "auth/login",
  async (formData: ILoginFormData, thunkAPI) => {
    try {
      const response = await instance.post<string>("auth/login", formData);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const checkIsAuth = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get<boolean>("auth/refresh");
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
    // Login logic
    [fetchLogin.fulfilled.type]: (state, action: PayloadAction<string>) => {
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
