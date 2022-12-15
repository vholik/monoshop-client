import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";
import { IAddItemFormData, Item } from "@store/types/item";

interface BrandsState {
  addItemLoading: boolean;
  addItemError: string;
  item: Item | null;
}

const initialState: BrandsState = {
  addItemLoading: false,
  addItemError: "",
  item: null,
};

export const addItem = createAsyncThunk(
  "item",
  async (formData: IAddItemFormData, thunkAPI) => {
    try {
      const response = await instance.post<Item>("item", formData);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const AddItemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: {
    [addItem.fulfilled.type]: (state, action: PayloadAction<Item>) => {
      state.item = action.payload;
      state.addItemLoading = false;
      state.addItemError = "";
    },
    [addItem.pending.type]: (state) => {
      state.addItemLoading = true;
    },
    [addItem.rejected.type]: (state, action: PayloadAction<string>) => {
      state.addItemLoading = false;
      state.addItemError = action.payload;
    },
  },
});

export default AddItemSlice.reducer;
