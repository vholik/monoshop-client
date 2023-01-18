import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance, { API_URL } from "@utils/axios";
import axios, { AxiosError, isAxiosError } from "axios";

import { User } from "@store/types/user";
import { RejectError } from "@store/types/error";

interface UserState {
  status: "init" | "loading" | "error" | "success";
  user: User | null;
}

const initialState: UserState = {
  status: "init",
  user: null,
};

export const getUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: RejectError }
>("user/id", async (id, thunkAPI) => {
  try {
    const response = await axios.get<User>(`${API_URL}/user/${id}`);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the user" });
  }
});

export const GetUserByIdSlice = createSlice({
  name: "user/id",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "success";
      })
      .addCase(getUserById.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default GetUserByIdSlice.reducer;
