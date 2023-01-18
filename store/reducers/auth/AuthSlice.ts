import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { AuthResponse } from "@utils/axios";
import { ILoginFormData } from "@store/types/auth";
import { AxiosError, isAxiosError } from "axios";
import { RejectError } from "@store/types/error";

interface InitState {
  userId: number | null;
  status: "init" | "loading" | "error" | "authenticated";
  error: string;
}

const initialState: InitState = {
  userId: null,
  status: "init",
  error: "",
};

export const loginUser = createAsyncThunk<
  AuthResponse,
  ILoginFormData,
  {
    rejectValue: RejectError;
  }
>("auth/login", async (formData, thunkAPI) => {
  try {
    const response = await instance.post<AuthResponse>("auth/login", formData);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not login" });
  }
});

export const checkIsAuth = createAsyncThunk<
  number,
  void,
  {
    rejectValue: RejectError;
  }
>("auth/me", async (_: void, thunkAPI) => {
  try {
    const response = await instance.get<number>("auth/me");
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "User is not signed" });
  }
});

export const AuthSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "authenticated";
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        }
        state.status = "error";
      });
    // Check if auth is logged in
    builder
      .addCase(checkIsAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkIsAuth.fulfilled, (state, action) => {
        state.userId = action.payload;
        state.status = "authenticated";
      })
      .addCase(checkIsAuth.rejected, (state, action) => {
        state.status = "error";
        if (action.payload) {
          state.error = action.payload.message;
        }
      });
  },
});

export const { reducer: authReducer } = AuthSlice;
