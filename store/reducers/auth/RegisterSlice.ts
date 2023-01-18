import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { IRegisterFormData } from "@store/types/auth";
import { User } from "@store/types/user";
import { AxiosError, isAxiosError } from "axios";
import { RejectError } from "@store/types/error";

interface RegisterState {
  status: "init" | "loading" | "error" | "success";
  error: string;
  user: User | null;
}

const initialState: RegisterState = {
  status: "init",
  error: "",
  user: null,
};

export const registerUser = createAsyncThunk<
  User,
  IRegisterFormData,
  {
    rejectValue: RejectError;
  }
>("auth/register", async (formData: IRegisterFormData, thunkAPI) => {
  try {
    const response = await instance.post<User>("auth/register", formData);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not register" });
  }
});

export const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = "success";
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = "error";
      if (action.payload) {
        state.error = action.payload.message;
      }
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = "loading";
    });
  },
});

export default RegisterSlice.reducer;
