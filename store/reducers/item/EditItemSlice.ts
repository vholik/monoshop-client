import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { ItemEntity } from "@store/types/item-entity";
import { IAddItemFormData, IEditItemFormData, Item } from "@store/types/item";

interface BrandsState {
  editItemLoading: boolean;
  editItemError: string;
  item: Item | null;
}

const initialState: BrandsState = {
  editItemLoading: false,
  editItemError: "",
  item: null,
};

export const editItem = createAsyncThunk<Item, IEditItemFormData>(
  "editItem",
  async (formData: IEditItemFormData, thunkAPI: any) => {
    try {
      const response = await instance.put<Item>(
        `item/${formData.id}`,
        formData
      );
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const EditItemSlice = createSlice({
  name: "editItem",
  initialState,
  reducers: {},
  extraReducers: {
    [editItem.fulfilled.type]: (state, action: PayloadAction<Item>) => {
      state.item = action.payload;
      state.editItemLoading = false;
      state.editItemError = "";
    },
    [editItem.pending.type]: (state) => {
      state.editItemLoading = true;
    },
    [editItem.rejected.type]: (state, action: PayloadAction<string>) => {
      state.editItemLoading = false;
      state.editItemError = action.payload;
    },
  },
});

export default EditItemSlice.reducer;
