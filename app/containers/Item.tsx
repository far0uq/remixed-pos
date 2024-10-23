import { Card, Image, Grid, Button } from "antd";
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Product } from "../interface/ProductInterface";
import { useTotalStore } from "../store/store";
import { fallbackImage } from "../../constants/fallbackImage";

const { Meta } = Card;
const { useBreakpoint } = Grid;

enum Quantity {
  increase = "add",
  decrease = "sub",
}

function Item({ item }: { item: Product }) {
  const screens = useBreakpoint();
  const quantityCounts = useTotalStore((state) => state.quantityCounts);
  const addProduct = useTotalStore((state) => state.addProduct);
  const removeProduct = useTotalStore((state) => state.removeProduct);

  const toggleQuantity = (type: string) => {
    if (item.priceExists) {
      if (type === "add") {
        addProduct(item);
      } else if (type === "sub") {
        removeProduct(item);
      }
    }
  };

  return (
    <Card
      title={item.name}
      style={{ width: "100%" }}
      actions={
        (quantityCounts.get(item.id) ?? 0) > 0
          ? [
              <MinusCircleOutlined
                key="minus"
                onClick={() => toggleQuantity(Quantity.decrease)}
              />,
              <PlusCircleOutlined
                key="add"
                onClick={() => toggleQuantity(Quantity.increase)}
              />,
            ]
          : [<ShoppingCartOutlined key="shopping" />]
      }
      cover={
        <Image
          width={"100%"}
          height={screens.lg ? "150px" : "300px"}
          src={item.image}
          alt="book"
          preview={false}
          style={{ objectFit: "cover" }}
          fallback={fallbackImage}
        />
      }
    >
      <Meta
        title={item.price ? item.price : item.priceExists ? "Free" : "Variable"}
        description={`Quantity: ${quantityCounts.get(item.id) ?? 0}`}
      />
      <Button
        className="add-to-cart"
        style={{
          marginTop: "20px",
          width: "100%",
        }}
        disabled={(quantityCounts.get(item.id) ?? 0) > 0}
        onClick={() => toggleQuantity(Quantity.increase)}
      >
        Add to Cart
      </Button>
    </Card>
  );
}

export default Item;
