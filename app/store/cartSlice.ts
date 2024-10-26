import { StateCreator } from "zustand";
import { Product } from "../interface/ProductInterface";
import { TaxID, ProductID, DiscountID } from "../interface/CartInterface";

interface CartState {
  cartProducts: Product[];
  quantityCounts: Map<ProductID, number>;
  cartLength: number;
  taxes: Map<TaxID, number>;
  itemTaxRecord: Map<ProductID, TaxID[]>;
  discounts: Map<DiscountID, number>;
  itemDiscountRecord: Map<ProductID, DiscountID[]>;
  taxNames: Map<TaxID, string>;
  discountNames: Map<DiscountID, string>;
}

interface CartActions {
  increaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => Map<ProductID, number>;
  decreaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => Map<ProductID, number>;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  addTax: (
    taxID: string,
    productID: string,
    type: "order" | "item",
    name: string
  ) => void;
  removeTax: (taxID: string, productID: string, type: "order" | "item") => void;
  addDiscount: (
    discountID: string,
    productID: string,
    type: "order" | "item",
    name: string
  ) => void;
  removeDiscount: (
    discountID: string,
    productID: string,
    type: "order" | "item"
  ) => void;
  clearCart: () => void;
}

export interface CartSlice extends CartState, CartActions {}

export const createCartStore: StateCreator<CartSlice> = (set, get) => ({
  cartProducts: [],
  cartLength: 0,
  quantityCounts: new Map<ProductID, number>(),
  taxes: new Map<TaxID, number>([]),
  itemTaxRecord: new Map<ProductID, TaxID[]>(),
  discounts: new Map<DiscountID, number>([]),
  itemDiscountRecord: new Map<ProductID, DiscountID[]>(),
  taxNames: new Map<TaxID, string>(),
  discountNames: new Map<DiscountID, string>(),

  increaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => {
    const updatedQuantity = new Map([...oldQuantityCounts]);
    if (updatedQuantity.has(productID)) {
      const currentQuantity = updatedQuantity.get(productID) as number;
      updatedQuantity.set(productID, currentQuantity + 1);
    } else {
      updatedQuantity.set(productID, 1);
    }

    return updatedQuantity;
  },

  decreaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => {
    const updatedQuantity = new Map([...oldQuantityCounts]);
    const currentQuantity = updatedQuantity.get(productID) as number;
    if (currentQuantity > 1) {
      updatedQuantity.set(productID, currentQuantity - 1);
    } else {
      updatedQuantity.delete(productID);
    }

    return updatedQuantity;
  },

  addProduct: (product: Product) =>
    set((state) => {
      const { increaseProductQuantity } = get();
      const updatedQuantity = increaseProductQuantity(
        product.id,
        state.quantityCounts
      );
      if (state.quantityCounts.has(product.id)) {
        return {
          cartProducts: state.cartProducts,
          cartLength: state.cartLength + 1,
          quantityCounts: updatedQuantity,
        };
      } else {
        return {
          cartProducts: [...state.cartProducts, product],
          cartLength: state.cartLength + 1,
          quantityCounts: updatedQuantity,
        };
      }
    }),

  removeProduct: (product: Product) => {
    set((state) => {
      const { decreaseProductQuantity } = get();
      const updatedQuantity = decreaseProductQuantity(
        product.id,
        state.quantityCounts
      );

      if (updatedQuantity.has(product.id)) {
        return {
          cartProducts: state.cartProducts,
          cartLength: state.cartLength - 1,
          quantityCounts: updatedQuantity,
        };
      } else {
        return {
          cartProducts: state.cartProducts.filter((p) => p.id !== product.id),
          cartLength: state.cartLength - 1,
          quantityCounts: updatedQuantity,
        };
      }
    });
  },

  addTax(
    taxID: string,
    productID: string,
    type: "order" | "item",
    name: string
  ) {
    if (type === "order") {
      set((state) => {
        const totalProducts = state.cartProducts.length;
        const updatedTaxes = new Map([...state.taxes]);
        updatedTaxes.set(taxID, totalProducts);
        const updatedTaxNames = new Map([...state.taxNames]);
        if (!state.taxNames.has(taxID)) {
          updatedTaxNames.set(taxID, name);
        }

        const updatedTaxRecord = new Map([...state.itemTaxRecord]);
        const cartProducts = state.cartProducts;
        for (let product of cartProducts) {
          const oldTaxIDs = updatedTaxRecord.get(product.id) || [];
          if (!oldTaxIDs.includes(taxID)) {
            updatedTaxRecord.set(product.id, [...oldTaxIDs, taxID]);
          }
        }
        return {
          taxes: updatedTaxes,
          itemTaxRecord: updatedTaxRecord,
          taxNames: updatedTaxNames,
        };
      });
    } else if (type === "item") {
      set((state) => {
        const thisTaxExists = state.taxes.has(taxID);
        const updatedTaxes = new Map([...state.taxes]);
        const updatedTaxNames = new Map([...state.taxNames]);

        if (!thisTaxExists) {
          updatedTaxes.set(taxID, 1);
          updatedTaxNames.set(taxID, name);
        } else {
          const currentTax = updatedTaxes.get(taxID) as number;
          updatedTaxes.set(taxID, currentTax + 1);
        }

        const updatedTaxRecord = new Map([...state.itemTaxRecord]);
        const oldTaxIDs = updatedTaxRecord.get(productID) || [];
        updatedTaxRecord.set(productID, [...oldTaxIDs, taxID]);

        return {
          taxes: updatedTaxes,
          itemTaxRecord: updatedTaxRecord,
          taxNames: updatedTaxNames,
        };
      });
    }
  },

  removeTax(taxID: string, productID: string, type: "order" | "item") {
    if (type === "order") {
      set((state) => {
        const updatedTaxes = new Map([...state.taxes]);
        updatedTaxes.delete(taxID);

        const updatedTaxNames = new Map([...state.taxNames]);
        updatedTaxNames.delete(taxID);

        const updatedTaxRecord = new Map([...state.itemTaxRecord]);
        for (let product of state.cartProducts) {
          const oldTaxIDs = updatedTaxRecord.get(product.id) || [];
          const newTaxIDs = oldTaxIDs.filter((id) => id !== taxID);
          updatedTaxRecord.set(product.id, newTaxIDs);
        }

        return {
          taxes: updatedTaxes,
          itemTaxRecord: updatedTaxRecord,
          taxNames: updatedTaxNames,
        };
      });
    } else if (type === "item") {
      set((state) => {
        const updatedTaxes = new Map([...state.taxes]);
        const currentTax = updatedTaxes.get(taxID) as number;
        const updatedTaxNames = new Map([...state.taxNames]);

        if (currentTax > 1) {
          updatedTaxes.set(taxID, currentTax - 1);
        } else {
          updatedTaxes.delete(taxID);
          updatedTaxNames.delete(taxID);
        }
        const updatedTaxRecord = new Map([...state.itemTaxRecord]);
        const oldTaxIDs = updatedTaxRecord.get(productID) || [];
        const newTaxIDs = oldTaxIDs.filter((id) => id !== taxID);
        updatedTaxRecord.set(productID, newTaxIDs);

        return {
          taxes: updatedTaxes,
          itemTaxRecord: updatedTaxRecord,
          taxNames: updatedTaxNames,
        };
      });
    }
  },

  addDiscount(
    discountID: string,
    productID: string,
    type: "order" | "item",
    name: string
  ) {
    if (type === "order") {
      set((state) => {
        const totalProducts = state.cartProducts.length;
        const updatedDiscounts = new Map([...state.discounts]);
        updatedDiscounts.set(discountID, totalProducts);
        const updatedDiscountNames = new Map([...state.discountNames]);
        if (!state.discountNames.has(discountID)) {
          updatedDiscountNames.set(discountID, name);
        }

        const updatedDiscountRecord = new Map([...state.itemDiscountRecord]);
        const cartProducts = state.cartProducts;
        for (let product of cartProducts) {
          const oldDiscountIDs = updatedDiscountRecord.get(product.id) || [];
          if (!oldDiscountIDs.includes(discountID)) {
            updatedDiscountRecord.set(product.id, [
              ...oldDiscountIDs,
              discountID,
            ]);
          }
        }

        return {
          discounts: updatedDiscounts,
          itemDiscountRecord: updatedDiscountRecord,
          discountNames: updatedDiscountNames,
        };
      });
    } else if (type === "item") {
      set((state) => {
        const updatedDiscounts = new Map([...state.discounts]);
        const updatedDiscountNames = new Map([...state.discountNames]);

        const thisDiscountExists = updatedDiscounts.has(discountID);

        if (!thisDiscountExists) {
          updatedDiscounts.set(discountID, 1);
          updatedDiscountNames.set(discountID, name);
        } else {
          const currentDiscount = updatedDiscounts.get(discountID) as number;
          updatedDiscounts.set(discountID, currentDiscount + 1);
        }

        const updatedDiscountRecord = new Map([...state.itemDiscountRecord]);
        const oldDiscountIDs = updatedDiscountRecord.get(productID) || [];
        updatedDiscountRecord.set(productID, [...oldDiscountIDs, discountID]);

        return {
          discounts: updatedDiscounts,
          itemDiscountRecord: updatedDiscountRecord,
          discountNames: updatedDiscountNames,
        };
      });
    }
  },

  removeDiscount(
    discountID: string,
    productID: string,
    type: "order" | "item"
  ) {
    if (type === "order") {
      set((state) => {
        const updatedDiscounts = new Map([...state.discounts]);
        const updatedDiscountNames = new Map([...state.discountNames]);
        updatedDiscounts.delete(discountID);
        updatedDiscountNames.delete(discountID);

        const updatedDiscountRecord = new Map([...state.itemDiscountRecord]);
        const cartProducts = state.cartProducts;
        for (let product of cartProducts) {
          const oldDiscountIDs = updatedDiscountRecord.get(product.id) || [];
          const newDiscountIDs = oldDiscountIDs.filter(
            (id) => id !== discountID
          );
          updatedDiscountRecord.set(product.id, newDiscountIDs);
        }

        return {
          discounts: updatedDiscounts,
          itemDiscountRecord: updatedDiscountRecord,
          discountNames: updatedDiscountNames,
        };
      });
    } else if (type === "item") {
      set((state) => {
        const updatedDiscounts = new Map([...state.discounts]);
        const currentDiscount = updatedDiscounts.get(discountID) as number;
        const updatedDiscountNames = new Map([...state.discountNames]);
        if (currentDiscount > 1) {
          updatedDiscounts.set(discountID, currentDiscount - 1);
        } else {
          updatedDiscounts.delete(discountID);
          updatedDiscountNames.delete(discountID);
        }

        const updatedDiscountRecord = new Map([...state.itemDiscountRecord]);
        const oldDiscountIDs = updatedDiscountRecord.get(productID) || [];
        const newDiscountIDs = oldDiscountIDs.filter((id) => id !== discountID);
        updatedDiscountRecord.set(productID, newDiscountIDs);

        return {
          discounts: updatedDiscounts,
          itemDiscountRecord: updatedDiscountRecord,
          discountNames: updatedDiscountNames,
        };
      });
    }
  },

  clearCart: () =>
    set({
      cartProducts: [],
      cartLength: 0,
      quantityCounts: new Map<string, number>(),
    }),
});
