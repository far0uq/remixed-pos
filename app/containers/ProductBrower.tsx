import { Flex, Grid } from "antd";
import SearchBar from "./SearchBar";
import { Suspense, useState } from "react";
import ItemContainer from "./ItemContainer";
import ItemsLoading from "./ItemsLoading";
import { Await, useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/auth";

const { useBreakpoint } = Grid;

function ProductBrowser() {
  const { productResp } = useLoaderData<typeof loader>();

  const screens = useBreakpoint();
  return (
    <Flex
      gap="large"
      style={{ width: screens.sm ? "65%" : "90%", margin: "auto" }}
      vertical
    >
      <SearchBar />

      <Suspense fallback={<ItemsLoading />}>
        <Await resolve={productResp}>
          {(productResp) => <ItemContainer productResp={productResp} />}
        </Await>
      </Suspense>
    </Flex>
  );
}

export default ProductBrowser;
