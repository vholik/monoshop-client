import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RejectError } from "@store/types/error";
import instance from "@utils/axios";
import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios";

interface ImageState {
  status: "init" | "loading" | "error" | "success";
  url: string;
}

const initialState: ImageState = {
  status: "init",
  url: "",
};

export const uploadImage = createAsyncThunk<
  { data: { url: string } },
  FormData,
  {
    rejectValue: RejectError;
  }
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
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data);
    }
    return rejectWithValue({ message: "Can not upload the image" });
  }
});

export const UploadImageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.url = action.payload.data.url;
        state.status = "success";
      })
      .addCase(uploadImage.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default UploadImageSlice.reducer;
