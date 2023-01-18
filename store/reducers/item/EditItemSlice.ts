import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";
import { IAddItemFormData, IEditItemFormData, Item } from "@store/types/item";
import { RejectError } from "@store/types/error";

interface BrandsState {
  status: "init" | "loading" | "error" | "success";
}

const initialState: BrandsState = {
  status: "init",
};

export const editItem = createAsyncThunk<
  Item,
  IEditItemFormData,
  {
    rejectValue: RejectError;
  }
>("editItem", async (formData, thunkAPI) => {
  try {
    const response = await instance.put<Item>(`item/${formData.id}`, formData);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not get favorites" });
  }
});

export const EditItemSlice = createSlice({
  name: "editItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editItem.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(editItem.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default EditItemSlice.reducer;
