import { Flex, Grid } from "antd";

import Item from "./Item";
import { Product } from "../interface/ProductInterface";

const { useBreakpoint } = Grid;

function ItemContainer({ productResp: data }: { productResp: string }) {
  const screens = useBreakpoint();
  const dataArray = JSON.parse(data);

  return (
    <Flex wrap gap={screens.lg ? "2%" : "0%"} style={{ width: "100%" }}>
      {dataArray &&
        dataArray.length > 0 &&
        dataArray.map((item: Product) => {
          return (
            <div
              key={item.id}
              style={{
                width: screens.lg ? "18%" : "100%",
                marginTop: "20px",
              }}
            >
              <Item item={item} />
            </div>
          );
        })}
    </Flex>
  );
}

export default ItemContainer;
