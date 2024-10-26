import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { OrderTotalResponseObject } from "~/interface/OrderInterface";
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

  const [order, setOrder] = useState<OrderTotalResponseObject>();
  const [isPending, setIsPending] = useState(false);

  const fetcher = useFetcher();

  const mutate = () => {
    console.log("MUTATING");
    setOrder(undefined);
    setIsPending(true);
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

  useEffect(() => {
    if (fetcher.data) {
      setIsPending(false);
      setOrder(JSON.parse(fetcher.data).data);
    }
  }, [fetcher.data]);

  return { order, isPending, mutate };
};
