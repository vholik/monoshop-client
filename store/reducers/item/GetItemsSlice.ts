import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { Gender } from "@store/types/gender.enum";
import { Item } from "@store/types/item";
import { IFileringData, IFilter } from "@store/types/filter";
import { RejectError } from "@store/types/error";
import { ParsedUrlQuery } from "querystring";

interface ItemsState {
  status: "init" | "loading" | "error" | "success";
  total: number;
  items: Item[];
}

const initialState: ItemsState = {
  status: "init",
  total: 1,
  items: [],
};

export const getItems = createAsyncThunk<
  IFileringData,
  IFilter,
  { rejectValue: RejectError }
>("items", async (filter: IFilter, thunkAPI) => {
  try {
    const response = await instance.get<IFileringData>("item", {
      params: filter,
    });
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    return thunkAPI.rejectWithValue({ message: "Can not load the data" });
  }
});

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
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.total = action.payload.meta.total;
        state.status = "success";
      })
      .addCase(getItems.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { setFavorite } = GetItemsSlice.actions;

export default GetItemsSlice.reducer;
