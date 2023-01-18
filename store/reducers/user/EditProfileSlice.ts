import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";

import { IProfileFormData, User } from "@store/types/user";
import { RejectError } from "@store/types/error";

interface UserState {
  status: "init" | "loading" | "error" | "success";
}

const initialState: UserState = {
  status: "init",
};

export const editProfile = createAsyncThunk<
  User,
  IProfileFormData,
  { rejectValue: RejectError }
>("profile/id", async (formData: IProfileFormData, thunkAPI: any) => {
  try {
    const response = await instance.put<User>(`user`, formData);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not make changes" });
  }
});

export const EditProfileSlice = createSlice({
  name: "profile/id",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(editProfile.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default EditProfileSlice.reducer;
