import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError } from "axios";
import { Gender } from "@store/types/gender.enum";
import { Item } from "@store/types/item";
import { IFileringData, IFilter } from "@store/types/filter";

interface ItemsState {
  isItemsLoading: boolean;
  total: number;
  itemsError: string;
  items: Item[];
}

const initialState: ItemsState = {
  isItemsLoading: false,
  total: 1,
  itemsError: "",
  items: [],
};

export const getItems = createAsyncThunk<IFileringData[], IFilter>(
  "items",
  async (filter: IFilter, thunkAPI: any) => {
    try {
      const response = await instance.get<IFileringData[]>("item", {
        params: filter,
      });
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkAPI.rejectWithValue(e.response!.data.message);
      }
      return e;
    }
  }
);

export const GetItemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setFavorite: (
      state,
      action: PayloadAction<{ id: number; isFavorite: boolean }>
    ) => {
      state.items = state.items.map((it) => {
        if (it.id === action.payload.id) {
          return {
            ...it,
            isFavorite: action.payload.isFavorite,
          };
        }

        return it;
      });
    },
  },
  extraReducers: {
    [getItems.fulfilled.type]: (
      state,
      action: PayloadAction<IFileringData>
    ) => {
      state.items = action.payload.data;
      state.total = action.payload.meta.total;
      state.isItemsLoading = false;
      state.itemsError = "";
    },
    [getItems.pending.type]: (state) => {
      state.isItemsLoading = true;
    },
    [getItems.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isItemsLoading = false;
      state.itemsError = action.payload;
    },
  },
});

export const { setFavorite } = GetItemsSlice.actions;

export default GetItemsSlice.reducer;
