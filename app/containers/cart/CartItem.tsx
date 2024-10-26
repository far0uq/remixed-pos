import { Product } from "../../interface/ProductInterface";
import { Card, Flex, Image, theme } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTotalStore } from "../../store/store";
import DiscountDropdown from "./DiscountDropdown";
import { DiscountOption } from "../../interface/DiscountInterface";
import { LineItemResponseCleaned } from "../../interface/OrderInterface";
import TaxDropdown from "./TaxDropdown";
import { TaxOption } from "../../interface/TaxInterface";

const { Meta } = Card;
const { useToken } = theme;

function CartItem({
  item,
  itemQuantity,
  discountQuery,
  taxQuery,
  individualCost,
  areDiscountsLoading,
  areTaxesLoading,
  taxError,
  discountError,
}: {
  item: Product;
  itemQuantity: number;
  discountQuery: DiscountOption[];
  taxQuery: TaxOption[];
  individualCost: LineItemResponseCleaned;
  areDiscountsLoading: boolean;
  areTaxesLoading: boolean;
  taxError: boolean;
  discountError: boolean;
}) {
  const { token } = useToken();
  const addProduct = useTotalStore((state) => state.addProduct);
  const removeProduct = useTotalStore((state) => state.removeProduct);
  const handleAddProduct = (item: Product) => {
    addProduct(item);
  };
  const handleRemoveProduct = (item: Product) => {
    removeProduct(item);
  };

  return (
    <Card
      actions={[
        <MinusCircleOutlined
          key="minus"
          onClick={() => handleRemoveProduct(item)}
        />,
        <PlusCircleOutlined key="add" onClick={() => handleAddProduct(item)} />,
        <p style={{ color: "black" }} key="price" className="cart-item-total">
          ${" "}
          {individualCost
            ? (
                item.price * itemQuantity +
                individualCost.totalTaxMoney -
                individualCost.totalDiscountMoney
              ).toLocaleString()
            : (item.price * itemQuantity).toLocaleString()}
        </p>,
      ]}
    >
      <Flex vertical gap="large">
        <Flex justify="flex-start" gap="large" align="center">
          <Image
            width={60}
            height={100}
            src={item.image}
            preview={false}
            alt={item.name}
            style={{ borderRadius: token.borderRadius, objectFit: "cover" }}
          />

          <Flex vertical>
            <Meta title={item.name} />
            <p
              style={{ fontWeight: "bolder", color: "gray" }}
              className="cart-item-quantity"
            >
              x {itemQuantity}
            </p>
            {individualCost && (
              <p
                style={{ fontWeight: "bolder", color: "gray" }}
                className="cart-item-discount"
              >
                Discount: $ {individualCost.totalDiscountMoney.toLocaleString()}
              </p>
            )}
            {individualCost && (
              <p
                style={{ fontWeight: "bolder", color: "gray" }}
                className="cart-item-tax"
              >
                Tax: $ {individualCost.totalTaxMoney.toLocaleString()}
              </p>
            )}
            {individualCost && (
              <p
                style={{ fontWeight: "bolder", color: "gray" }}
                className="cart-item-raw-price"
              >
                Raw Price: $ {(item.price * itemQuantity).toLocaleString()}
              </p>
            )}
          </Flex>
        </Flex>
        <DiscountDropdown
          discountQuery={discountQuery}
          areDiscountsLoading={areDiscountsLoading}
          discountError={discountError}
          productID={item.id}
          dropDownType="item"
        />

        <TaxDropdown
          taxQuery={taxQuery}
          areTaxesLoading={areTaxesLoading}
          taxError={taxError}
          productID={item.id}
          dropDownType="item"
        />
      </Flex>
    </Card>
  );
}

export default CartItem;
