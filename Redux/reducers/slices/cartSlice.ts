import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { TProductInterface } from "../../../types/ProductType";
import { TCartItemType } from "../../../types/CartItemType";

const initialState: TCartItemType[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (
      state,
      action: PayloadAction<{
        product: TProductInterface;
        quantity: number;
        image: string;
      }>
    ) => {
      const { product, quantity, image } = action.payload;
      const existingItemIndex = state.findIndex(
        (item) => item.items.id === product.id
      );

      if (existingItemIndex !== -1) {
        state[existingItemIndex].quantity += quantity;
        state[existingItemIndex].totalPrice =
          state[existingItemIndex].items.price *
          state[existingItemIndex].quantity;
      } else {
        state.push({
          items: {
            ...product,
          },
          quantity,
          image,
          totalPrice: product.price * quantity,
        });
      }
      const totalQuantity = state.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalPrice = state.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      state.forEach((item) => {
        item.quantity = totalQuantity;
        item.totalPrice = totalPrice;
      });
    },
    clearCart: (state) => {
      state.splice(0, state.length);
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export const cart = (state: RootState) => state.cart;
export default cartSlice.reducer;
