import CartItem from "../../components/cart/CartItem";
import { Card, Flex, Empty } from "antd";
import { useTotalStore } from "../../store/store";
import TaxDropdown from "../../components/cart/TaxDropdown";
import {
  LineItemResponseCleaned,
  OrderTotalResponseObject,
} from "../../interface/OrderInterface";
import TotalPaymentInfo from "../../components/cart/TotalPaymentInfo";
import { useCartMutation } from "../../hooks/useCartMutation";
import { useEffect } from "react";
import DiscountDropdown from "../../components/cart/DiscountDropdown";
import { getProductMoneyDetails } from "~/utils/productHelper";
import { TaxOption } from "~/interface/TaxInterface";
import { DiscountOption } from "~/interface/DiscountInterface";

function CartContainer({
  areTaxesLoading,
  areDiscountsLoading,
  TaxesCleaned,
  DiscountsCleaned,
  taxError,
  discountError,
}: {
  areTaxesLoading: boolean;
  areDiscountsLoading: boolean;
  TaxesCleaned: TaxOption[];
  DiscountsCleaned: DiscountOption[];
  taxError: boolean;
  discountError: boolean;
}) {
  const products = useTotalStore((state) => state.cartProducts);
  const quantityCounts = useTotalStore((state) => state.quantityCounts);
  const taxes = useTotalStore((state) => state.taxes);
  const discounts = useTotalStore((state) => state.discounts);
  const { order, orderError, isPending, mutate } = useCartMutation();

  useEffect(() => {
    mutate();
  }, [products, quantityCounts, taxes, discounts]);

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
                areDiscountsLoading={areDiscountsLoading}
                areTaxesLoading={areTaxesLoading}
                discountError={discountError}
                taxError={taxError}
                individualCost={productMoneyDetails as LineItemResponseCleaned}
              />
            );
          })}

          <Card>
            <Flex gap="large" vertical>
              <DiscountDropdown
                discountQuery={DiscountsCleaned}
                areDiscountsLoading={areDiscountsLoading}
                discountError={discountError}
                productID="none"
                dropDownType="order"
              />

              <TaxDropdown
                taxQuery={TaxesCleaned}
                areTaxesLoading={areTaxesLoading}
                taxError={taxError}
                productID="none"
                dropDownType="order"
              />

              {orderError && <p>Could not calculate order.</p>}
              {isPending && <p>Calculating order...</p>}
              {order && !isPending ? (
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
