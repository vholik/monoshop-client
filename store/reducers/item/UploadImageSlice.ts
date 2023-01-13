import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import axios, { AxiosError, AxiosResponse } from "axios";

interface ImageState {
  isLoading: boolean;
  error: string;
  url: string;
}

const initialState: ImageState = {
  isLoading: false,
  error: "",
  url: "",
};

export const uploadImage = createAsyncThunk<
  { data: { url: string } },
  FormData
>("image/upload", async (formData, { rejectWithValue }: any) => {
  try {
    const response: AxiosResponse<{ data: { url: string } }> = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        withCredentials: false,
      }
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data.error.message);
    }
    return e;
  }
});

export const UploadImageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [uploadImage.fulfilled.type]: (
      state,
      action: PayloadAction<{ data: { url: string } }>
    ) => {
      state.url = action.payload.data.url;
      state.isLoading = false;
      state.error = "";
    },
    [uploadImage.pending.type]: (state) => {
      state.isLoading = true;
    },
    [uploadImage.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setError } = UploadImageSlice.actions;

export default UploadImageSlice.reducer;
