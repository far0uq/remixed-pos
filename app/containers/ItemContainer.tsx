import { Empty, Flex, Grid } from "antd";

import Item from "./Item";
import { useState, useEffect } from "react";
import { Product } from "../interface/ProductInterface";
import InfiniteScroll from "react-infinite-scroll-component";
import ItemsLoading from "./ItemsLoading";
import { useFetcher } from "@remix-run/react";

const { useBreakpoint } = Grid;

function ItemContainer({ productResp: data }: { productResp: string }) {
  const fetcher = useFetcher();
  const screens = useBreakpoint();

  const [items, setItems] = useState<Product[]>(JSON.parse(data).items);
  const [cursor, setCursor] = useState<string>(JSON.parse(data).cursor);

  useEffect(() => {
    setItems(JSON.parse(data).items);
    setCursor(JSON.parse(data).cursor);
  }, [data]);

  useEffect(() => {
    if (fetcher.data) {
      const newItems = JSON.parse(fetcher.data as string).items;
      const newCursor = JSON.parse(fetcher.data as string).cursor;
      setItems([...items, ...newItems]);
      setCursor(newCursor);
    }
  }, [fetcher.data]);

  return (
    <div>
      {items && items.length > 0 ? (
        <InfiniteScroll
          dataLength={items.length}
          loader={<ItemsLoading />}
          next={() => fetcher.load(`/home?cursor=${cursor}`)}
          hasMore={cursor !== null}
        >
          <Flex wrap gap={screens.lg ? "2%" : "0%"} style={{ width: "100%" }}>
            {items.map((item: Product) => {
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
        </InfiniteScroll>
      ) : (
        <Empty style={{ width: "100%", marginTop: "22vh" }} />
      )}
    </div>
  );
}

export default ItemContainer;
