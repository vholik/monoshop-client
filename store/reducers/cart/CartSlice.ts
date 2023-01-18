import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Item } from "@store/types/item";

interface CartState {
  item: Item | null;
}

const initialState: CartState = {
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
