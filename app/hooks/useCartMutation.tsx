import { useFetcher } from "@remix-run/react";
import { useTotalStore } from "~/store/store";

export const useCartMutation = () => {
  const getCartLength = useTotalStore((state) => state.cartLength);
  const getTaxes = useTotalStore((state) => state.taxes);
  const getDiscounts = useTotalStore((state) => state.discounts);
  const getItemDiscountRecord = useTotalStore(
    (state) => state.itemDiscountRecord
  );
  const getItemTaxRecord = useTotalStore((state) => state.itemTaxRecord);
  const getQuantityCounts = useTotalStore((state) => state.quantityCounts);

  const fetcher = useFetcher();

  const mutate = () => {
    console.log("MUTATING");
    const cartLength = getCartLength;
    const taxes = getTaxes;
    const discounts = getDiscounts;
    const itemDiscountRecord = getItemDiscountRecord;
    const itemTaxRecord = getItemTaxRecord;
    const quantityCounts = getQuantityCounts;
    console.log("🚀 ~ mutate ~ taxes", taxes);

    fetcher.submit(
      {
        cartLength,
        taxes: JSON.stringify(Array.from(taxes)),
        discounts: JSON.stringify(Array.from(discounts)),
        itemDiscountRecord: JSON.stringify(Array.from(itemDiscountRecord)),
        itemTaxRecord: JSON.stringify(Array.from(itemTaxRecord)),
        quantityCounts: JSON.stringify(Array.from(quantityCounts)),
      },
      {
        method: "POST",
        action: "/order",
      }
    );
  };

  const isPending = fetcher.state === "loading";
  const isError = fetcher.state === "idle" && !fetcher.data;
  const data = fetcher.data ? JSON.parse(fetcher.data).data : null;

  return { data, isError, isPending, mutate };
};
