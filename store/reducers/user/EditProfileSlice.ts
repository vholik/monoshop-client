import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";

import { IProfileFormData, User } from "@store/types/user";

interface UserState {
  isProfileLoading: boolean;
  profileError: string;
  profile: User | null;
}

const initialState: UserState = {
  isProfileLoading: false,
  profileError: "",
  profile: null,
};

export const editProfile = createAsyncThunk<User, IProfileFormData>(
  "editProfile",
  async (formData: IProfileFormData, thunkAPI: any) => {
    try {
      const response = await instance.put<User>(`user`, formData);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const EditProfileSlice = createSlice({
  name: "editProfile",
  initialState,
  reducers: {},
  extraReducers: {
    [editProfile.fulfilled.type]: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.isProfileLoading = false;
      state.profileError = "";
    },
    [editProfile.pending.type]: (state) => {
      state.isProfileLoading = true;
    },
    [editProfile.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isProfileLoading = false;
      state.profileError = action.payload;
    },
  },
});

export default EditProfileSlice.reducer;
