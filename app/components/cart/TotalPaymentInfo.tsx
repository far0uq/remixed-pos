import { Flex, Card, Button, theme } from "antd";
import { OrderResponse } from "../../interface/OrderInterface";
import { useTotalStore } from "../../store/store";
import { toast } from "react-hot-toast";

const { Meta } = Card;
const { useToken } = theme;

function TotalPaymentInfo({ totalAll }: { totalAll: OrderResponse }) {
  const { token } = useToken();

  const clearCart = useTotalStore((state) => state.clearCart);
  const handleClearCart = () => {
    toast.success("Order Placed Successfully.", {
      style: {
        border: `1px solid ${token.colorSuccess}`,
        padding: "16px",
        color: token.colorSuccess,
        fontSize: "20px",
      },
      iconTheme: {
        primary: token.colorSuccess,
        secondary: "white",
      },
    });
    clearCart();
  };

  return (
    <Flex vertical gap="large">
      <Flex gap="small" vertical>
        <Flex justify="space-between">
          <Meta title="Total Discount" />
          <p style={{ fontWeight: "bolder" }}>
            $ {totalAll.totalDiscountMoney.toLocaleString()}
          </p>
        </Flex>
        <Flex justify="space-between">
          <Meta title="Total Tax" />
          <p style={{ fontWeight: "bolder" }}>
            $ {totalAll.totalTaxMoney.toLocaleString()}
          </p>
        </Flex>
        <Flex justify="space-between">
          <Meta title="Total without Tax + Discounts" />
          <p style={{ fontWeight: "bolder" }} className="total-money">
            ${" "}
            {(
              totalAll.totalMoney +
              totalAll.totalDiscountMoney -
              totalAll.totalTaxMoney
            ).toLocaleString()}
          </p>
        </Flex>
        <Flex justify="space-between">
          <Meta title="Total with Tax + Discounts" />
          <p style={{ fontWeight: "bolder" }} className="total-money">
            $ {totalAll.totalMoney.toLocaleString()}
          </p>
        </Flex>
      </Flex>
      <Button onClick={() => handleClearCart()}>Confirm and Place Order</Button>
    </Flex>
  );
}

export default TotalPaymentInfo;
