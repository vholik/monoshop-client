import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { IRegisterFormData } from "@store/types/auth";
import { User } from "@store/types/user";
import { AxiosError } from "axios";

interface RegisterState {
  isLoading: boolean;
  error: string;
  user: User | null;
}

const initialState: RegisterState = {
  isLoading: false,
  error: "",
  user: null,
};

export const fetchRegister = createAsyncThunk(
  "auth/register",
  async (formData: IRegisterFormData, thunkAPI) => {
    try {
      const response = await instance.post<User>("auth/register", formData);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchRegister.fulfilled.type]: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [fetchRegister.pending.type]: (state) => {
      state.isLoading = true;
    },
    [fetchRegister.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
    },
  },
});

export default RegisterSlice.reducer;
