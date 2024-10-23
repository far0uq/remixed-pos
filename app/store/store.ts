import { create } from "zustand";
import { createCartStore, CartSlice } from "./cartSlice";

type TotalStore = CartSlice;

export const useTotalStore = create<TotalStore>()((...a) => ({
  ...createCartStore(...a),
}));
