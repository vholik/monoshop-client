import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Item } from "@store/types/item";

interface ItemsState {
  isLoading: boolean;
  error: string;
  item: Item | null;
}

const initialState: ItemsState = {
  isLoading: false,
  error: "",
  item: null,
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Item>) => {
      state.item = action.payload;
    },
  },
});

export const { addToCart } = CartSlice.actions;

export default CartSlice.reducer;
