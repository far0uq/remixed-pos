import CartItem from "./CartItem";
import { Card, Flex, Empty } from "antd";
import { useTotalStore } from "../../store/store";
import TaxDropdown from "./TaxDropdown";
import {
  LineItemResponseCleaned,
  OrderTotalResponseObject,
} from "../../interface/OrderInterface";
import TotalPaymentInfo from "./TotalPaymentInfo";
import { useCartMutation } from "../../hooks/useCartMutation";
import { useEffect, useState } from "react";
import DiscountDropdown from "./DiscountDropdown";
import { Fetcher } from "@remix-run/react";
import { getProductMoneyDetails } from "~/utils/productHelper";
import { TaxOption } from "~/interface/TaxInterface";
import { DiscountOption } from "~/interface/DiscountInterface";
import { cleanDiscounts, cleanTaxes } from "~/utils/modifierHelper";

function CartContainer({ fetcher }: { fetcher: Fetcher }) {
  const products = useTotalStore((state) => state.cartProducts);
  const quantityCounts = useTotalStore((state) => state.quantityCounts);
  const taxes = useTotalStore((state) => state.taxes);
  const discounts = useTotalStore((state) => state.discounts);
  const { order, isError, isPending, mutate } = useCartMutation();

  useEffect(() => {
    mutate();
  }, [products, quantityCounts, taxes, discounts]);

  const [TaxesCleaned, setTaxesCleaned] = useState<TaxOption[]>([]);
  const [DiscountsCleaned, setDiscountsCleaned] = useState<DiscountOption[]>(
    []
  );

  useEffect(() => {
    if (fetcher.data) {
      setTaxesCleaned(cleanTaxes(JSON.parse(fetcher.data.TaxesResp)));
      setDiscountsCleaned(
        cleanDiscounts(JSON.parse(fetcher.data.DiscountsResp))
      );
    }
  }, [fetcher.data]);

  return (
    <div>
      {products && products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => {
            const productMoneyDetails = getProductMoneyDetails(
              product.id,
              order as OrderTotalResponseObject
            );

            return (
              <CartItem
                key={product.id}
                item={product}
                itemQuantity={quantityCounts.get(product.id) ?? 0}
                discountQuery={DiscountsCleaned}
                taxQuery={TaxesCleaned}
                individualCost={productMoneyDetails as LineItemResponseCleaned}
              />
            );
          })}

          <Card>
            <Flex gap="large" vertical>
              <DiscountDropdown
                discountQuery={DiscountsCleaned}
                productID="none"
                dropDownType="order"
              />

              <TaxDropdown
                taxQuery={TaxesCleaned}
                productID="none"
                dropDownType="order"
              />

              {isError && <p>Error calculating order</p>}
              {isPending && <p>Calculating order...</p>}
              {order && !isError && !isPending ? (
                <TotalPaymentInfo totalAll={order.orderResponse} />
              ) : null}
            </Flex>
          </Card>
        </Flex>
      ) : (
        <Empty style={{ marginTop: "40vh" }} description="No items in cart" />
      )}
    </div>
  );
}

export default CartContainer;
