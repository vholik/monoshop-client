import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";

import { User } from "@store/types/user";

interface UserState {
  isLoading: boolean;
  error: string;
  user: User | null;
}

const initialState: UserState = {
  isLoading: false,
  error: "",
  user: null,
};

export const getUserById = createAsyncThunk<User, string>(
  "user",
  async (id: string, thunkAPI: any) => {
    try {
      const response = await instance.get<User>(`user/${id}`);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetUserByIdSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [getUserById.fulfilled.type]: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [getUserById.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getUserById.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default GetUserByIdSlice.reducer;
