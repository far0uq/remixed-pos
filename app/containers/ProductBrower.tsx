"use client";
import React from "react";
import ItemContainer from "./items/ItemContainer";
import SearchBar from "./SearchBar";
import { Flex } from "antd";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import * as Sentry from "@sentry/react";
import QueryClientWrapper from "../../wrapper/QueryClientWrapper";

function ProductBrowser() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("0");

  const screens = useBreakpoint();

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occured</p>}>
      <QueryClientWrapper>
        <Flex
          gap="large"
          style={{ width: screens.sm ? "65%" : "90%", margin: "auto" }}
          vertical
        >
          <SearchBar
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
          />
          <ItemContainer query={query} category={category} />
        </Flex>
      </QueryClientWrapper>
    </Sentry.ErrorBoundary>
  );
}

export default ProductBrowser;
 