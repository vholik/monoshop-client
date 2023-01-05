import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@utils/axios";
import { AxiosError, isAxiosError } from "axios";
import { ItemEntityWithId } from "@store/types/item-entity";
import { ReduxError } from "@store/types/error";
import { Item } from "@store/types/item";

interface BrandsState {
  isLoading: boolean;
  error: string;
  items: Item[];
}

const initialState: BrandsState = {
  isLoading: false,
  error: "",
  items: [],
};

export const getPopularItems = createAsyncThunk<
  Item[],
  void,
  {
    rejectValue: ReduxError;
  }
>("popularitems", async (_, thunkAPI) => {
  try {
    const response = await instance.get<Item[]>("item/popular");
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return thunkAPI.rejectWithValue(err.response!.data.message);
    }
    return thunkAPI.rejectWithValue({ message: "Can not loading the data" });
  }
});

export const GetPopularItemsSlice = createSlice({
  name: "popularItems",
  initialState,
  reducers: {},
  extraReducers: {
    [getPopularItems.fulfilled.type]: (
      state,
      action: PayloadAction<Item[]>
    ) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = "";
    },
    [getPopularItems.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getPopularItems.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default GetPopularItemsSlice.reducer;
