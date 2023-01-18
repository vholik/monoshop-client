import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";

import { User } from "@store/types/user";

interface UserState {
  status: "init" | "loading" | "error" | "success";
  user: User | null;
}

const initialState: UserState = {
  status: "init",
  user: null,
};

export const getProfile = createAsyncThunk<User>(
  "profile",
  async (_, thunkAPI: any) => {
    try {
      const response = await instance.get<User>(`user/profile`);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return thunkAPI.rejectWithValue(e.response.data);
      }
      return thunkAPI.rejectWithValue({ message: "Can not load profile" });
    }
  }
);

export const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "success";
      })
      .addCase(getProfile.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default ProfileSlice.reducer;
